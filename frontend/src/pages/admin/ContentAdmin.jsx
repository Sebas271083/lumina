import { useEffect, useState } from 'react';
import api from '../../services/api';

const pages = [
  { value: 'institucional', label: 'Institucional' },
  { value: 'sustentabilidad', label: 'Sustentabilidad' },
];

export default function ContentAdmin() {
  const [page, setPage] = useState('institucional');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
              <input
                placeholder="Clave del bloque (unica, ej: mision)"
                value={block.blockKey}
                onChange={(e) => updateBlockField(i, 'blockKey', e.target.value)}
              />
              <input
                placeholder="Titulo"
                value={block.title || ''}
                onChange={(e) => updateBlockField(i, 'title', e.target.value)}
              />
              <textarea
                placeholder="Texto"
                rows={3}
                value={block.body || ''}
                onChange={(e) => updateBlockField(i, 'body', e.target.value)}
              />
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
