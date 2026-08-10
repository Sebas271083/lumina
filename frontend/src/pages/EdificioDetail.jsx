import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { assetUrl } from '../services/api';
import BuildingImage from '../components/BuildingImage';
import MapEmbed from '../components/MapEmbed';
import Lightbox from '../components/Lightbox';
import usePageMeta from '../hooks/usePageMeta';
import { ArrowRight, Award, Building2, Check, Maximize, MapPin } from '../components/Icons';

export default function EdificioDetail() {
  const { slug } = useParams();
  const [building, setBuilding] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  usePageMeta(building?.name, building?.description);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/buildings/${slug}`)
      .then((res) => setBuilding(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-loading">Cargando...</div>;
  if (notFound || !building) {
    return (
      <div className="section">
        <h1>Edificio no encontrado</h1>
        <Link to="/edificios" className="btn btn-primary">
          Volver a edificios
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <Link to="/edificios" className="back-link">
        ← Volver a edificios
      </Link>

      <div className="building-hero">
        <BuildingImage src={building.coverImage} alt={building.name} large />
        <span className={`badge badge-${building.category}`}>
          {building.category === 'finalizado' ? 'Finalizado' : 'Proyecto'}
        </span>
      </div>

      <div className="building-detail-grid">
        <div className="building-detail-main">
          <h1>{building.name}</h1>

          <div className="stat-bar">
            {building.address && (
              <span className="stat-bar-item">
                <MapPin size={18} />
                {building.address}
              </span>
            )}
            {building.sizeM2 && (
              <span className="stat-bar-item">
                <Building2 size={18} />
                {building.sizeM2.toLocaleString('es-AR')} m² totales
              </span>
            )}
            {building.availableM2 != null && (
              <span className="stat-bar-item">
                <Building2 size={18} />
                {building.availableM2.toLocaleString('es-AR')} m² disponibles
              </span>
            )}
          </div>

          {building.description && <p>{building.description}</p>}

          {building.address && (
            <div className="detail-section">
              <h2>Ubicación</h2>
              <MapEmbed address={building.address} title={`Ubicación de ${building.name}`} />
            </div>
          )}

          {building.amenities && building.amenities.length > 0 && (
            <div className="detail-section">
              <h2>Amenities</h2>
              <ul className="amenities-list">
                {building.amenities.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {building.certifications && building.certifications.length > 0 && (
            <div className="detail-section">
              <h2>Certificaciones</h2>
              <ul className="certifications-list">
                {building.certifications.map((item) => (
                  <li key={item}>
                    <Award size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {building.gallery && building.gallery.length > 0 && (
            <div className="detail-section">
              <h2>Galería</h2>
              <div className="gallery-grid">
                {building.gallery.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className="gallery-thumb"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Ampliar foto ${i + 1} de ${building.gallery.length}`}
                  >
                    <img src={assetUrl(img)} alt={`${building.name} - foto ${i + 1}`} loading="lazy" decoding="async" />
                    <span className="gallery-thumb-icon">
                      <Maximize size={22} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="building-detail-cta">
          <h3>¿Te interesa este edificio?</h3>
          <p>Escribinos y un asesor de Lumina Office te va a contactar a la brevedad.</p>
          <Link to={`/contacto?edificio=${encodeURIComponent(building.name)}`} className="btn btn-primary">
            Consultar por este edificio <ArrowRight size={16} />
          </Link>
        </aside>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={building.gallery}
          index={lightboxIndex}
          alt={building.name}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
