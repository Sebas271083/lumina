import { useState } from 'react';
import { assetUrl } from '../services/api';
import { Building2 } from './Icons';

export default function BuildingImage({ src, alt, large = false }) {
  const [errored, setErrored] = useState(false);
  const url = !errored ? assetUrl(src) : null;

  if (!url) {
    return (
      <div className={`building-image-fallback${large ? ' large' : ''}`}>
        <Building2 size={large ? 36 : 26} />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}
