import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">LUMINA ADMIN</div>
        <nav>
          <NavLink to="/admin/edificios" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Edificios
          </NavLink>
          <NavLink to="/admin/contenido" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Contenido
          </NavLink>
          <NavLink to="/admin/consultas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Consultas
          </NavLink>
        </nav>
        <div className="admin-sidebar-user">
          <p>{user?.name}</p>
          <button onClick={handleLogout} className="btn btn-secondary">
            Cerrar sesion
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
