import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { assetUrl } from '../services/api';
import { ArrowRight, Building2, MapPin } from '../components/Icons';

export default function EdificioDetail() {
  const { slug } = useParams();
  const [building, setBuilding] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

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
        {building.coverImage ? (
          <img src={assetUrl(building.coverImage)} alt={building.name} />
        ) : (
          <div className="building-card-placeholder large">{building.name}</div>
        )}
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
                {building.sizeM2.toLocaleString('es-AR')} m²
              </span>
            )}
          </div>

          {building.description && <p>{building.description}</p>}

          {building.gallery && building.gallery.length > 0 && (
            <div className="gallery-grid">
              {building.gallery.map((img) => (
                <img key={img} src={assetUrl(img)} alt={building.name} />
              ))}
            </div>
          )}
        </div>

        <aside className="building-detail-cta">
          <h3>¿Te interesa este edificio?</h3>
          <p>Escribinos y un asesor de Lumina Office te va a contactar a la brevedad.</p>
          <Link to="/contacto" className="btn btn-primary">
            Consultar por este edificio <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
