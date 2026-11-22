import Anthropic from '@anthropic-ai/sdk';

/*
  POST /api/chat — Rahhala travel assistant (Claude).

  Body: { messages: [{ role: 'user'|'assistant', content: string }], offers: string, lang: 'ar'|'en' }
  Response: streamed plain text (the assistant's reply, token by token).

  The API key lives only on the server (ANTHROPIC_API_KEY env var) — never in the browser.
  Works as a Vercel serverless function as-is, and in `npm run dev` through the plugin in vite.config.js.
*/

const MODEL = 'claude-opus-5-5';
const MAX_MESSAGES = 30;
const MAX_CHARS_PER_MESSAGE = 4000;
const MAX_OFFERS_CHARS = 30000;

// Simple in-memory rate limit per IP (resets when the server restarts).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map();

const SYSTEM_PROMPT = `You are "Rahhala Assistant", the travel planner on Rahhala — a website where Egyptian travelers compare offers from licensed travel agencies (Umrah, Red Sea and North Coast beach holidays, chalets, safaris and mountains, and trips abroad) and book directly with the agency.

Your job is to help the traveler with anything they need for a trip:
- Answer travel questions: best time to go, weather, what to pack, visas and documents, transport, safety, local customs, money and budgets, what to eat.
- Build day-by-day itineraries: what to visit each day, how to get around, and roughly how long things take.
- Estimate costs: break the budget into transport, accommodation, food, activities and extras, in Egyptian pounds (EGP) unless the traveler asks otherwise. Say clearly that these are approximate estimates, since prices change.
- Recommend matching offers from the Rahhala catalog below when they fit the traveler's destination, dates, departure city or budget.

Rules:
- Reply in the same language the traveler writes in. If they write in Egyptian Arabic, reply in friendly Egyptian Arabic.
- Only mention Rahhala offers that appear in the catalog below, with their real price and nights. Never invent offers, agencies, prices or discounts. When you mention an offer, link it exactly like this: [offer title](#offer:OFFER_ID) — the site turns that into a button that opens the offer.
- If no offer in the catalog matches, say so and still help with a plan; suggest checking the Offers page later.
- For visas, entry rules, health requirements and anything that changes often, give the general picture and tell the traveler to confirm with the embassy or official source before booking.
- Booking and payment happen directly with the agency, not with you. You cannot book, hold seats or see the traveler's personal data.
- Keep answers practical and easy to scan: short paragraphs, headings for each day of a plan, bullet lists, and a small table for cost breakdowns. Don't pad the answer.
- Stay on travel topics. If asked something unrelated, briefly steer back to helping with their trip.`;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.socket?.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_REQUESTS_PER_WINDOW;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel already parsed it
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200_000) throw new Error('too large');
  }
  return JSON.parse(raw || '{}');
}

function validMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  const clean = [];
  for (const [i, m] of messages.entries()) {
    const role = i % 2 === 0 ? 'user' : 'assistant'; // must alternate, starting with the user
    if (!m || m.role !== role || typeof m.content !== 'string') return null;
    const content = m.content.trim().slice(0, MAX_CHARS_PER_MESSAGE);
    if (!content) return null;
    clean.push({ role, content });
  }
  return clean[clean.length - 1].role === 'user' ? clean : null;
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

let client;

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' });
  if (rateLimited(clientIp(req))) return sendJson(res, 429, { error: 'rate_limited' });

  let body;
  try { body = await readJson(req); } catch { return sendJson(res, 400, { error: 'bad_json' }); }

  const messages = validMessages(body.messages);
  if (!messages) return sendJson(res, 400, { error: 'bad_messages' });
  const offers = typeof body.offers === 'string' ? body.offers.slice(0, MAX_OFFERS_CHARS) : '';
  const today = new Date().toISOString().slice(0, 10);

  try {
    client ??= new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000, // cost cap for a public endpoint; a long multi-day plan fits well within it
      output_config: { effort: 'medium' },
      // If Claude declines a request, the API retries it on a suitable fallback model in the same call.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Today's date: ${today}\n\nRahhala offers catalog (live offers right now; prices are per person in EGP):\n${offers || '(no offers available)'}` },
      ],
      messages,
    });

    let started = false;
    stream.on('text', (text) => {
      if (!started) {
        started = true;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Accel-Buffering', 'no');
      }
      res.write(text);
    });

    const final = await stream.finalMessage();
    if (!started) {
      // No text at all (e.g. the whole chain declined) — tell the client in a structured way.
      return sendJson(res, 200, { error: final.stop_reason === 'refusal' ? 'refusal' : 'empty' });
    }
    if (final.stop_reason === 'max_tokens') res.write('\n\n…');
    res.end();
  } catch (err) {
    console.error('[api/chat]', err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    if (res.headersSent) { res.end(); return; }
    if (err instanceof Anthropic.AuthenticationError || !process.env.ANTHROPIC_API_KEY) return sendJson(res, 500, { error: 'server_not_configured' });
    if (err instanceof Anthropic.RateLimitError) return sendJson(res, 503, { error: 'busy' });
    return sendJson(res, 502, { error: 'upstream' });
  }
}
