import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProductPage } from '../pages/ProductPage';
import { SupportPage } from '../pages/SupportPage';
import { ReleasesPage } from '../pages/ReleasesPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="releases" element={<ReleasesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
