import { useEffect, useState } from 'react';
import api from '../services/api';
import BuildingImage from '../components/BuildingImage';
import Reveal from '../components/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import { Award, Check, Leaf } from '../components/Icons';

const VALUE_ICONS = {
  'valor-seguridad': Award,
  'valor-excelencia': Check,
  'valor-sustentabilidad': Leaf,
};
const KNOWN_KEYS = ['historia', 'mision', 'vision', ...Object.keys(VALUE_ICONS)];

export default function Institucional() {
  usePageMeta(
    'Institucional',
    'Conocé la historia, misión y visión de Lumina Office, desarrolladora líder en edificios de oficinas AAA.'
  );

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/content/institucional')
      .then((res) => setBlocks(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Cargando...</div>;

  const find = (key) => blocks.find((b) => b.blockKey === key);
  const historia = find('historia');
  const mision = find('mision');
  const vision = find('vision');
  const valores = Object.keys(VALUE_ICONS).map(find).filter(Boolean);
  const extraBlocks = blocks.filter((b) => !KNOWN_KEYS.includes(b.blockKey));

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-eyebrow">Lumina Office</span>
          <h1>Institucional</h1>
        </div>
      </section>

      {historia && (
        <section className="section institucional-history">
          <Reveal as="div" className="institucional-history-media">
            <BuildingImage src={historia.imageUrl} alt="Lumina Office" large />
          </Reveal>
          <Reveal as="div" delay={80} className="institucional-history-text">
            {historia.title && <h2>{historia.title}</h2>}
            {historia.body && <p>{historia.body}</p>}
          </Reveal>
        </section>
      )}

      {(mision || vision) && (
        <section className="section section-alt">
          <div className="institucional-pillars-grid">
            {mision && (
              <Reveal className="pillar-quote-card">
                <span className="pillar-quote-mark">“</span>
                {mision.title && <h3>{mision.title}</h3>}
                {mision.body && <p>{mision.body}</p>}
              </Reveal>
            )}
            {vision && (
              <Reveal delay={80} className="pillar-quote-card">
                <span className="pillar-quote-mark">“</span>
                {vision.title && <h3>{vision.title}</h3>}
                {vision.body && <p>{vision.body}</p>}
              </Reveal>
            )}
          </div>
        </section>
      )}

      {valores.length > 0 && (
        <section className="section">
          <Reveal className="section-head">
            <div>
              <span className="section-eyebrow">Nuestros valores</span>
              <h2>Lo que nos define</h2>
            </div>
          </Reveal>
          <div className="feature-grid">
            {valores.map((block, i) => {
              const Icon = VALUE_ICONS[block.blockKey] || Check;
              return (
                <Reveal key={block.id} delay={i * 80}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>
                    {block.title && <h3>{block.title}</h3>}
                    {block.body && <p>{block.body}</p>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {extraBlocks.length > 0 && (
        <div className="section content-blocks">
          {extraBlocks.map((block, i) => (
            <Reveal key={block.id} as="div" className="content-block" delay={i * 60}>
              <div className="content-block-body">
                {block.title && <h2>{block.title}</h2>}
                {block.body && <p>{block.body}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
