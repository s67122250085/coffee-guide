import { Route, Routes } from 'react-router';
import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/varieties" element={<CatalogPage kind="varieties" />} />
        <Route path="/coffee-menu" element={<CatalogPage kind="menu" />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
