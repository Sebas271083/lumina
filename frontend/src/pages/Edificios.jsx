import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BuildingCard from '../components/BuildingCard';
import Reveal from '../components/Reveal';
import usePageMeta from '../hooks/usePageMeta';

const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'finalizado', label: 'Finalizados' },
  { id: 'proyecto', label: 'Proyectos' },
];
const VALID_FILTERS = tabs.map((t) => t.id);

export default function Edificios() {
  usePageMeta(
    'Edificios',
    'Explorá el portfolio completo de edificios de oficinas de Lumina Office, finalizados y en desarrollo.'
  );

  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedFilter = searchParams.get('estado');
  const filter = VALID_FILTERS.includes(requestedFilter) ? requestedFilter : 'todos';

  function handleFilterChange(id) {
    setSearchParams(id === 'todos' ? {} : { estado: id });
  }

  useEffect(() => {
    api
      .get('/buildings')
      .then((res) => setBuildings(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Cargando edificios...</div>;

  const visible = filter === 'todos' ? buildings : buildings.filter((b) => b.category === filter);

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-eyebrow">Portfolio completo</span>
          <h1>Edificios</h1>
        </div>
      </section>

      <div className="section">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab${filter === tab.id ? ' active' : ''}`}
              onClick={() => handleFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="building-grid">
            {visible.map((b, i) => (
              <Reveal key={b.id} delay={(i % 6) * 60}>
                <BuildingCard building={b} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p>No hay edificios para mostrar en esta categoría.</p>
        )}
      </div>
    </div>
  );
}
