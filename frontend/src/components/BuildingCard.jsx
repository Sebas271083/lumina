import { Link } from 'react-router-dom';
import BuildingImage from './BuildingImage';

export default function BuildingCard({ building }) {
  return (
    <Link to={`/edificios/${building.slug}`} className="building-card">
      <div className="building-card-media">
        <BuildingImage src={building.coverImage} alt={building.name} />
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
