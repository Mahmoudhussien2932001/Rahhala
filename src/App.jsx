import { useEffect } from 'react';
import { LangProvider } from './lib/i18n';
import { StoreProvider } from './store/store';
import { UIProvider } from './components/UI';
import { useRoute } from './lib/router';
import { CompareBar, Footer, Navbar } from './components/Layout';
import Home from './pages/Home';
import Offers from './pages/Offers';
import { Agencies, Compare, Destinations, Login } from './pages/Browse';
import Guides from './pages/Guides';
import AgencyDashboard from './pages/dashboard/AgencyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

const PAGES = {
  home: Home,
  offers: Offers,
  destinations: Destinations,
  agencies: Agencies,
  compare: Compare,
  guides: Guides,
  login: Login,
  dashboard: AgencyDashboard,
  admin: AdminDashboard,
};
const NO_FOOTER = ['login', 'dashboard', 'admin'];

function Shell() {
  const { name, query, key } = useRoute();
  const route = PAGES[name] ? name : 'home';
  const Page = PAGES[route];

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [route]);

  return (
    <>
      <Navbar route={route} />
      <main key={route} className="page-enter">
        <Page query={query} routeKey={key} />
      </main>
      {!NO_FOOTER.includes(route) && <Footer />}
      <CompareBar route={route} />
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
