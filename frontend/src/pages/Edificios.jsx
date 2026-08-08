import { useEffect, useState } from 'react';
import api from '../services/api';
import BuildingCard from '../components/BuildingCard';
import Reveal from '../components/Reveal';

const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'finalizado', label: 'Finalizados' },
  { id: 'proyecto', label: 'Proyectos' },
];

export default function Edificios() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

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
              onClick={() => setFilter(tab.id)}
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
          <p>No hay edificios para mostrar en esta categoria.</p>
        )}
      </div>
    </div>
  );
}
