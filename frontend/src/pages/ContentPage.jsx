import { useEffect, useState } from 'react';
import api from '../services/api';
import Reveal from '../components/Reveal';
import { Leaf } from '../components/Icons';

export default function ContentPage({ page, title }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/content/${page}`)
      .then((res) => setBlocks(res.data))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="page-loading">Cargando...</div>;

  const showLeafIcon = page === 'sustentabilidad';

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-eyebrow">Lumina Office</span>
          <h1>{title}</h1>
        </div>
      </section>

      <div className="section content-blocks">
        {blocks.map((block, i) =>
          i === 0 ? (
            <Reveal key={block.id} as="div" className="content-lead">
              {block.title && <h2>{block.title}</h2>}
              {block.body && <p>{block.body}</p>}
            </Reveal>
          ) : (
            <Reveal key={block.id} as="div" className="content-block" delay={i * 60}>
              {showLeafIcon && (
                <div className="content-block-icon">
                  <Leaf size={20} />
                </div>
              )}
              <div className="content-block-body">
                {block.title && <h2>{block.title}</h2>}
                {block.body && <p>{block.body}</p>}
              </div>
            </Reveal>
          )
        )}
      </div>
    </div>
  );
}
