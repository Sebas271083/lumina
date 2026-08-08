import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/leads')
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await api.put(`/leads/${id}/status`, { status });
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar esta consulta?')) return;
    await api.delete(`/leads/${id}`);
    load();
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Consultas recibidas</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{new Date(lead.createdAt).toLocaleDateString('es-AR')}</td>
              <td>{lead.name} {lead.surname}</td>
              <td>{lead.email}</td>
              <td>{lead.phone || '-'}</td>
              <td className="lead-message">{lead.message}</td>
              <td>
                <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}>
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="archivado">Archivado</option>
                </select>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => remove(lead.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={7}>No hay consultas todavia.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
