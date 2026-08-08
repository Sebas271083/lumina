import { useEffect, useState } from 'react';
import api, { assetUrl } from '../../services/api';

const emptyForm = {
  name: '',
  category: 'finalizado',
  sizeM2: '',
  address: '',
  description: '',
  featured: false,
  displayOrder: 0,
};

export default function BuildingsAdmin() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api
      .get('/buildings')
      .then((res) => setBuildings(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setEditingId('new');
    setForm(emptyForm);
    setError('');
  }

  function startEdit(building) {
    setEditingId(building.id);
    setForm({
      name: building.name,
      category: building.category,
      sizeM2: building.sizeM2 || '',
      address: building.address || '',
      description: building.description || '',
      featured: building.featured,
      displayOrder: building.displayOrder,
    });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId === 'new') {
        await api.post('/buildings', form);
      } else {
        await api.put(`/buildings/${editingId}`, form);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el edificio');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este edificio?')) return;
    await api.delete(`/buildings/${id}`);
    load();
  }

  async function handleCoverUpload(id, file) {
    const data = new FormData();
    data.append('image', file);
    await api.post(`/buildings/${id}/cover-image`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    load();
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Edificios</h1>
        <button className="btn btn-primary" onClick={startCreate}>
          + Nuevo edificio
        </button>
      </div>

      {editingId && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId === 'new' ? 'Nuevo edificio' : 'Editar edificio'}</h2>
          <div className="form-row">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="finalizado">Finalizado</option>
              <option value="proyecto">Proyecto</option>
            </select>
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="Superficie (m2)"
              value={form.sizeM2}
              onChange={(e) => setForm({ ...form, sizeM2: e.target.value })}
            />
            <input
              type="number"
              placeholder="Orden"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
            />
          </div>
          <input
            placeholder="Direccion"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <textarea
            placeholder="Descripcion"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Destacado en portada
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>m²</th>
              <th>Destacado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b) => (
              <tr key={b.id}>
                <td>
                  <label className="thumb-upload">
                    {b.coverImage ? (
                      <img src={assetUrl(b.coverImage)} alt={b.name} />
                    ) : (
                      <span>Subir</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleCoverUpload(b.id, e.target.files[0])}
                    />
                  </label>
                </td>
                <td>{b.name}</td>
                <td>{b.category === 'finalizado' ? 'Finalizado' : 'Proyecto'}</td>
                <td>{b.sizeM2 ? b.sizeM2.toLocaleString('es-AR') : '-'}</td>
                <td>{b.featured ? 'Si' : 'No'}</td>
                <td className="admin-table-actions">
                  <button className="btn btn-secondary" onClick={() => startEdit(b)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
