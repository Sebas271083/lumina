import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BuildingCard from '../components/BuildingCard';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import usePageMeta from '../hooks/usePageMeta';
import { Building2, Leaf, MapPin } from '../components/Icons';

// TODO(pendiente): reemplazar por los isotipos reales en escala de grises (SVG/PNG) de cada
// inquilino en cuanto se cuente con los archivos y la autorización de uso de marca correspondiente.
// Hasta entonces se muestran como placeholders de "logo" en vez de una lista de texto plano.
const tenants = [
  { name: 'SAP', logo: null },
  { name: 'Telecom Argentina', logo: null },
  { name: 'Siemens', logo: null },
  { name: 'Pfizer', logo: null },
  { name: 'Mondelez', logo: null },
  { name: 'Arcor', logo: null },
  { name: 'Accenture', logo: null },
  { name: 'Unilever', logo: null },
  { name: 'Nestlé', logo: null },
  { name: 'Danone', logo: null },
];

const features = [
  {
    icon: MapPin,
    title: 'Ubicación estratégica',
    text: 'Desarrollos posicionados en los principales corredores corporativos del norte del Gran Buenos Aires.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidad',
    text: 'Edificios pensados con criterios de eficiencia energética y bienestar para quienes los habitan.',
  },
  {
    icon: Building2,
    title: 'Diseño categoría AAA',
    text: 'Estándares constructivos y de terminación de primer nivel, a la altura de las compañías más exigentes.',
  },
];

export default function Home() {
  usePageMeta(
    'Inicio',
    'Lumina Office desarrolla y administra edificios de oficinas categoría AAA en el corredor norte del Gran Buenos Aires.'
  );

  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    api
      .get('/buildings')
      .then((res) => setBuildings(res.data))
      .catch(() => setBuildings([]));
  }, []);

  const featured = buildings.filter((b) => b.featured).slice(0, 6);
  const totalM2 = buildings.reduce((sum, b) => sum + (b.sizeM2 || 0), 0);

  return (
    <div>
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source
            src="https://luminaoffice.com.ar/wp-content/uploads/2023/09/Homepage-optimizado.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Desarrolladora inmobiliaria AAA</span>
            <h1>Edificios de oficinas categoría AAA</h1>
            <p>
              Desarrollamos y administramos espacios corporativos de alta gama en el corredor norte
              del Gran Buenos Aires, con los más altos estándares de excelencia y sustentabilidad.
            </p>
            <div className="hero-actions">
              <Link to="/edificios" className="btn btn-primary">
                Ver edificios
              </Link>
              <Link to="/contacto" className="btn btn-outline">
                Contáctanos
              </Link>
            </div>
          </div>

          {buildings.length > 0 && (
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">
                  <CountUp value={buildings.length} />
                </span>
                <span className="stat-label">Edificios</span>
              </div>
              {totalM2 > 0 && (
                <div className="stat-item">
                  <span className="stat-value">
                    <CountUp value={totalM2} formatter={(n) => n.toLocaleString('es-AR')} />
                  </span>
                  <span className="stat-label">m² desarrollados</span>
                </div>
              )}
              <div className="stat-item">
                <span className="stat-value">
                  <CountUp value={tenants.length} suffix="+" />
                </span>
                <span className="stat-label">Empresas inquilinas</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <Reveal className="section-head">
            <div>
              <span className="section-eyebrow">Portfolio</span>
              <h2>Edificios destacados</h2>
            </div>
          </Reveal>
          <div className="building-grid">
            {featured.map((b, i) => (
              <Reveal key={b.id} delay={i * 80}>
                <BuildingCard building={b} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <Reveal className="section-head">
          <div>
            <span className="section-eyebrow">Por qué Lumina Office</span>
            <h2>Excelencia en cada detalle</h2>
          </div>
        </Reveal>
        <div className="feature-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="feature-card">
                <div className="feature-icon">
                  <f.icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <Reveal>
          <span className="section-eyebrow">Confían en nosotros</span>
          <h2>Nuestros inquilinos</h2>
        </Reveal>
        <div className="marquee">
          <div className="marquee-track">
            {[...tenants, ...tenants].map((t, i) =>
              t.logo ? (
                <img key={`${t.name}-${i}`} src={t.logo} alt={t.name} className="marquee-logo" />
              ) : (
                <span key={`${t.name}-${i}`} className="marquee-item" title={`Logotipo de ${t.name} pendiente`}>
                  {t.name}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
