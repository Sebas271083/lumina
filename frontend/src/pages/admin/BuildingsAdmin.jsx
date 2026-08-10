import { useEffect, useState } from 'react';
import api, { assetUrl } from '../../services/api';

const emptyForm = {
  name: '',
  category: 'finalizado',
  sizeM2: '',
  availableM2: '',
  address: '',
  description: '',
  amenities: '',
  certifications: '',
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
  const [uploading, setUploading] = useState(false);

  const editingBuilding = editingId && editingId !== 'new' ? buildings.find((b) => b.id === editingId) : null;

  function load() {
    setLoading(true);
    return api
      .get('/buildings')
      .then((res) => setBuildings(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

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
      availableM2: building.availableM2 || '',
      address: building.address || '',
      description: building.description || '',
      amenities: (building.amenities || []).join(', '),
      certifications: (building.certifications || []).join(', '),
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
      const payload = {
        ...form,
        amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editingId === 'new') {
        const res = await api.post('/buildings', payload);
        await load();
        setEditingId(res.data.id);
        return;
      }
      await api.put(`/buildings/${editingId}`, payload);
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
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      await api.post(`/buildings/${id}/cover-image`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(id, file) {
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      await api.post(`/buildings/${id}/gallery-image`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveGalleryImage(building, imageUrl) {
    if (!confirm('¿Quitar esta foto de la galería?')) return;
    const gallery = (building.gallery || []).filter((img) => img !== imageUrl);
    await api.put(`/buildings/${building.id}`, { gallery });
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
            <div className="admin-field">
              <label htmlFor="b-name">Nombre</label>
              <input
                id="b-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="b-category">Categoría</label>
              <select
                id="b-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="finalizado">Finalizado</option>
                <option value="proyecto">Proyecto</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="admin-field">
              <label htmlFor="b-size">Superficie total (m²)</label>
              <input
                id="b-size"
                type="number"
                value={form.sizeM2}
                onChange={(e) => setForm({ ...form, sizeM2: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="b-available">Superficie disponible (m²)</label>
              <input
                id="b-available"
                type="number"
                value={form.availableM2}
                onChange={(e) => setForm({ ...form, availableM2: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="b-address">Dirección</label>
            <input
              id="b-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="b-description">Descripción</label>
            <textarea
              id="b-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="b-amenities">Amenities (separados por coma)</label>
            <input
              id="b-amenities"
              placeholder="Ej: Estacionamiento cubierto, Gimnasio, Seguridad 24 hs"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="b-certifications">Certificaciones (separadas por coma)</label>
            <input
              id="b-certifications"
              placeholder="Ej: LEED Core & Shell"
              value={form.certifications}
              onChange={(e) => setForm({ ...form, certifications: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="b-order">Orden de aparición</label>
            <input
              id="b-order"
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
            />
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Destacado en portada
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="admin-photos">
            <h3>Fotos</h3>
            {!editingBuilding ? (
              <p className="admin-photos-hint">Guardá el edificio para poder subir fotos.</p>
            ) : (
              <>
                <div className="admin-field">
                  <label>Foto de portada</label>
                  <label className="thumb-upload large" title="Subir o reemplazar la foto de portada">
                    {editingBuilding.coverImage ? (
                      <img src={assetUrl(editingBuilding.coverImage)} alt={editingBuilding.name} />
                    ) : (
                      <span>Subir foto</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => e.target.files[0] && handleCoverUpload(editingBuilding.id, e.target.files[0])}
                    />
                  </label>
                </div>

                <div className="admin-field">
                  <label>Galería</label>
                  <div className="admin-gallery-grid">
                    {(editingBuilding.gallery || []).map((img) => (
                      <div key={img} className="admin-gallery-item">
                        <img src={assetUrl(img)} alt={editingBuilding.name} />
                        <button
                          type="button"
                          className="admin-gallery-remove"
                          title="Quitar foto"
                          onClick={() => handleRemoveGalleryImage(editingBuilding, img)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="admin-gallery-add">
                      {uploading ? 'Subiendo...' : '+ Agregar foto'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(e) => e.target.files[0] && handleGalleryUpload(editingBuilding.id, e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              {editingBuilding ? 'Listo' : 'Cancelar'}
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
              <th>Categoría</th>
              <th>m²</th>
              <th>Destacado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b) => (
              <tr key={b.id}>
                <td>
                  <label className="thumb-upload" title="Subir o reemplazar la foto de portada">
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
