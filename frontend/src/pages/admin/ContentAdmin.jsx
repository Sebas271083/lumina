import { useEffect, useState } from 'react';
import api, { assetUrl } from '../../services/api';

const pages = [
  { value: 'institucional', label: 'Institucional' },
  { value: 'sustentabilidad', label: 'Sustentabilidad' },
];

export default function ContentAdmin() {
  const [page, setPage] = useState('institucional');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  function load() {
    setLoading(true);
    api
      .get(`/content/${page}`)
      .then((res) => setBlocks(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page]);

  function updateBlockField(index, field, value) {
    const next = [...blocks];
    next[index] = { ...next[index], [field]: value };
    setBlocks(next);
  }

  async function saveBlock(block) {
    setSaving(true);
    try {
      await api.post('/content', {
        page,
        blockKey: block.blockKey,
        title: block.title,
        body: block.body,
        displayOrder: block.displayOrder,
      });
    } finally {
      setSaving(false);
      load();
    }
  }

  async function deleteBlock(id) {
    if (!confirm('¿Eliminar este bloque?')) return;
    await api.delete(`/content/${id}`);
    load();
  }

  async function handleImageUpload(id, file) {
    setUploadingId(id);
    const data = new FormData();
    data.append('image', file);
    try {
      await api.post(`/content/${id}/image`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      load();
    } finally {
      setUploadingId(null);
    }
  }

  async function handleRemoveImage(block) {
    await api.post('/content', { page, blockKey: block.blockKey, imageUrl: null });
    load();
  }

  function addBlock() {
    setBlocks([
      ...blocks,
      { id: `new-${Date.now()}`, blockKey: '', title: '', body: '', displayOrder: blocks.length + 1, isNew: true },
    ]);
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Contenido</h1>
        <select value={page} onChange={(e) => setPage(e.target.value)}>
          {pages.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="content-blocks-admin">
          {blocks.map((block, i) => (
            <div key={block.id} className="admin-form">
              <div className="admin-field">
                <label htmlFor={`ck-${block.id}`}>Clave del bloque (única)</label>
                <input
                  id={`ck-${block.id}`}
                  placeholder="Ej: mision"
                  value={block.blockKey}
                  onChange={(e) => updateBlockField(i, 'blockKey', e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`ct-${block.id}`}>Título</label>
                <input
                  id={`ct-${block.id}`}
                  value={block.title || ''}
                  onChange={(e) => updateBlockField(i, 'title', e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`cb-${block.id}`}>Texto</label>
                <textarea
                  id={`cb-${block.id}`}
                  rows={3}
                  value={block.body || ''}
                  onChange={(e) => updateBlockField(i, 'body', e.target.value)}
                />
              </div>

              {!block.isNew && (
                <div className="admin-field">
                  <label>Imagen del bloque</label>
                  <div className="admin-block-image">
                    <label className="thumb-upload large" title="Subir o reemplazar la imagen">
                      {block.imageUrl ? (
                        <img src={assetUrl(block.imageUrl)} alt={block.title || block.blockKey} />
                      ) : (
                        <span>{uploadingId === block.id ? 'Subiendo...' : 'Subir imagen'}</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingId === block.id}
                        onChange={(e) => e.target.files[0] && handleImageUpload(block.id, e.target.files[0])}
                      />
                    </label>
                    {block.imageUrl && (
                      <button type="button" className="admin-remove-image" onClick={() => handleRemoveImage(block)}>
                        Quitar imagen
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  disabled={saving || !block.blockKey}
                  onClick={() => saveBlock(block)}
                >
                  Guardar
                </button>
                {!block.isNew && (
                  <button className="btn btn-danger" onClick={() => deleteBlock(block.id)}>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addBlock}>
            + Agregar bloque
          </button>
        </div>
      )}
    </div>
  );
}
