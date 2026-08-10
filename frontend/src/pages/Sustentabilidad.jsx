import Reveal from '../components/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import { Droplet, Leaf, Recycle, Wind, Zap } from '../components/Icons';

const pillars = [
  {
    icon: Zap,
    title: 'Eficiencia energética',
    metric: 'Objetivo: -30% de consumo eléctrico',
    text: 'Climatización de alta eficiencia, iluminación LED y gestión automatizada del edificio para reducir el consumo frente a un edificio de oficinas convencional.',
  },
  {
    icon: Droplet,
    title: 'Uso eficiente del agua',
    metric: 'Objetivo: -25% de consumo hídrico',
    text: 'Griferías de bajo caudal y sistemas de recolección de agua de lluvia para riego y áreas comunes en los desarrollos que lo permiten.',
  },
  {
    icon: Recycle,
    title: 'Materiales responsables',
    metric: 'Mayor proporción de contenido reciclado',
    text: 'Priorizamos materiales de construcción con contenido reciclado y proveedores regionales para reducir la huella de transporte de cada obra.',
  },
  {
    icon: Wind,
    title: 'Calidad ambiental interior',
    metric: 'Ventilación mecánica controlada',
    text: 'Renovación permanente de aire, control de CO2 y materiales de bajas emisiones (low-VOC) en todos los espacios de trabajo.',
  },
];

export default function Sustentabilidad() {
  usePageMeta(
    'Sustentabilidad',
    'Conocé el compromiso de Lumina Office con la sustentabilidad y la certificación LEED Core & Shell.'
  );

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-eyebrow">Lumina Office</span>
          <h1>Sustentabilidad</h1>
        </div>
      </section>

      <div className="section sustentabilidad-intro">
        <Reveal className="leed-badge" as="div">
          <Leaf size={30} />
          <span className="leed-badge-title">LEED</span>
          <span className="leed-badge-sub">Core &amp; Shell</span>
        </Reveal>
        <Reveal as="div" delay={80} className="sustentabilidad-intro-text">
          <h2>Certificación LEED Core &amp; Shell</h2>
          <p>
            Nuestros edificios se desarrollan siguiendo los criterios de la certificación LEED Core &amp; Shell,
            el estándar internacional que evalúa el diseño y la construcción sustentable en el uso de energía,
            agua, materiales y calidad ambiental interior.
          </p>
        </Reveal>
      </div>

      <div className="section section-alt">
        <Reveal className="section-head">
          <div>
            <span className="section-eyebrow">Nuestros pilares</span>
            <h2>Cómo lo llevamos a la práctica</h2>
          </div>
        </Reveal>
        <div className="feature-grid">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="feature-card pillar-card">
                <div className="feature-icon">
                  <p.icon size={22} />
                </div>
                <h3>{p.title}</h3>
                <p className="pillar-metric">{p.metric}</p>
                <p>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
