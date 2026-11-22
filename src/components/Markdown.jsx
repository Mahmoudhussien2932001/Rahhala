/*
  Tiny, safe Markdown renderer for assistant replies.
  Builds React elements (never innerHTML), so model output can't inject HTML.
  Supports: # headings, **bold**, *italic*, `code`, bullet/numbered lists, tables, links.
  Links of the form [text](#offer:ID) call onOffer(ID) instead of navigating.
*/

function inline(text, onOffer, keyBase = 'i') {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const key = `${keyBase}-${k++}`;
    if (t.startsWith('**')) out.push(<strong key={key}>{inline(t.slice(2, -2), onOffer, key)}</strong>);
    else if (t.startsWith('`')) out.push(<code key={key}>{t.slice(1, -1)}</code>);
    else if (t.startsWith('[')) {
      const [, label, href] = t.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (href.startsWith('#offer:')) {
        const id = href.slice(7);
        out.push(<button key={key} type="button" className="md-offer" onClick={() => onOffer?.(id)}>{label}</button>);
      } else if (/^https?:\/\//.test(href)) {
        out.push(<a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>);
      } else out.push(label);
    } else out.push(<em key={key}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export default function Markdown({ text, onOffer }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = `b${i}`;
    if (!line.trim()) { i++; continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const Tag = `h${Math.min(h[1].length + 2, 6)}`;
      blocks.push(<Tag key={key}>{inline(h[2], onOffer, key)}</Tag>);
      i++; continue;
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { blocks.push(<hr key={key} />); i++; continue; }

    if (line.trim().startsWith('|') && lines[i + 1] && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={key} className="md-table"><table>
          <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, onOffer, `${key}h${j}`)}</th>)}</tr></thead>
          <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, onOffer, `${key}r${ri}${j}`)}</td>)}</tr>)}</tbody>
        </table></div>,
      );
      continue;
    }

    const isUl = (l) => /^\s*[-*•]\s+/.test(l);
    const isOl = (l) => /^\s*\d+[.)]\s+/.test(l);
    if (isUl(line) || isOl(line)) {
      const ordered = isOl(line);
      const items = [];
      while (i < lines.length && (ordered ? isOl(lines[i]) : isUl(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ''));
        i++;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={key}>{items.map((it, j) => <li key={j}>{inline(it, onOffer, `${key}l${j}`)}</li>)}</List>);
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4})\s|^\s*[-*•]\s|^\s*\d+[.)]\s|^\s*\|/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) para.push(lines[i++]);
    blocks.push(<p key={key}>{para.map((p, j) => <span key={j}>{j > 0 && <br />}{inline(p, onOffer, `${key}p${j}`)}</span>)}</p>);
  }
  return <div className="md">{blocks}</div>;
}
