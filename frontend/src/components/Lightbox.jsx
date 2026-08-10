import { useCallback, useEffect, useRef } from 'react';
import { assetUrl } from '../services/api';
import { ArrowLeft, ArrowRight, X } from './Icons';

export default function Lightbox({ images, index, alt, onClose, onNavigate }) {
  const total = images.length;
  const closeRef = useRef(null);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + total) % total);
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % total);
  }, [index, total, onNavigate]);

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [goPrev, goNext, onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Galería de ${alt}`} onClick={onClose}>
      <button type="button" ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Cerrar">
        <X />
      </button>

      {total > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Foto anterior"
        >
          <ArrowLeft />
        </button>
      )}

      <img
        key={images[index]}
        src={assetUrl(images[index])}
        alt={`${alt} - foto ${index + 1} de ${total}`}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      {total > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Foto siguiente"
        >
          <ArrowRight />
        </button>
      )}

      {total > 1 && (
        <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
}
