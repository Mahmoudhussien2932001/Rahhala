import { useEffect } from 'react';
import { LangProvider } from './lib/i18n';
import { StoreProvider } from './store/store';
import { UIProvider } from './components/UI';
import { useRoute } from './lib/router';
import { CompareBar, Footer, Navbar } from './components/Layout';
import { WelcomeChooser } from './components/Explore';
import Home from './pages/Home';
import Offers from './pages/Offers';
import { Agencies, Compare, Destinations, Login } from './pages/Browse';
import Guides from './pages/Guides';
import { AgencyPage, DestinationPage, OfferPage } from './pages/Detail';
import Favorites from './pages/Favorites';
import Quiz from './pages/Quiz';
import AgencyDashboard from './pages/dashboard/AgencyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

const PAGES = {
  home: Home,
  offers: Offers,
  destinations: Destinations,
  agencies: Agencies,
  compare: Compare,
  guides: Guides,
  offer: OfferPage,
  destination: DestinationPage,
  agency: AgencyPage,
  favorites: Favorites,
  quiz: Quiz,
  login: Login,
  dashboard: AgencyDashboard,
  admin: AdminDashboard,
};
const NO_FOOTER = ['login', 'dashboard', 'admin'];

function Shell() {
  const { name, params, query, key } = useRoute();
  const route = PAGES[name] ? name : 'home';
  const Page = PAGES[route];
  const pageKey = [route, ...params].join('/'); // a new offer/agency id = a fresh page

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pageKey]);

  return (
    <>
      <Navbar route={route} />
      <main key={pageKey} className="page-enter">
        <Page query={query} params={params} routeKey={key} />
      </main>
      {!NO_FOOTER.includes(route) && <Footer />}
      <CompareBar route={route} />
      <WelcomeChooser route={route} />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <StoreProvider>
        <UIProvider>
          <Shell />
        </UIProvider>
      </StoreProvider>
    </LangProvider>
  );
}
