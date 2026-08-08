import { Link } from 'react-router-dom';
import { assetUrl } from '../services/api';

export default function BuildingCard({ building }) {
  return (
    <Link to={`/edificios/${building.slug}`} className="building-card">
      <div className="building-card-media">
        {building.coverImage ? (
          <img src={assetUrl(building.coverImage)} alt={building.name} />
        ) : (
          <div className="building-card-placeholder">{building.name}</div>
        )}
        <div className="building-card-overlay">
          <span className={`badge badge-${building.category}`}>
            {building.category === 'finalizado' ? 'Finalizado' : 'Proyecto'}
          </span>
          <h3>{building.name}</h3>
          {building.sizeM2 && <p>{building.sizeM2.toLocaleString('es-AR')} m²</p>}
        </div>
      </div>
    </Link>
  );
}
