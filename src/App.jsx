import { Route, Routes } from 'react-router';
import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AssessmentPage from './pages/AssessmentPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assessment/:phase" element={<AssessmentPage />} />
        <Route path="/varieties" element={<CatalogPage kind="varieties" />} />
        <Route path="/coffee-menu" element={<CatalogPage kind="menu" />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
