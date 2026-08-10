import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Edificios from './pages/Edificios';
import EdificioDetail from './pages/EdificioDetail';
import Institucional from './pages/Institucional';
import Sustentabilidad from './pages/Sustentabilidad';
import Contacto from './pages/Contacto';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import BuildingsAdmin from './pages/admin/BuildingsAdmin';
import ContentAdmin from './pages/admin/ContentAdmin';
import LeadsAdmin from './pages/admin/LeadsAdmin';

function PublicLayout({ children }) {
  return (
    <div className="public-site">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/institucional" element={<PublicLayout><Institucional /></PublicLayout>} />
        <Route path="/edificios" element={<PublicLayout><Edificios /></PublicLayout>} />
        <Route path="/edificios/:slug" element={<PublicLayout><EdificioDetail /></PublicLayout>} />
        <Route path="/sustentabilidad" element={<PublicLayout><Sustentabilidad /></PublicLayout>} />
        <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="edificios" replace />} />
          <Route path="edificios" element={<BuildingsAdmin />} />
          <Route path="contenido" element={<ContentAdmin />} />
          <Route path="consultas" element={<LeadsAdmin />} />
        </Route>

        <Route path="*" element={<PublicLayout><h1 className="section">Página no encontrada</h1></PublicLayout>} />
      </Routes>
    </AuthProvider>
  );
}
