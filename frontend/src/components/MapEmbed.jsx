export default function MapEmbed({ address, title }) {
  if (!address) return null;

  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="map-embed">
      <iframe
        src={src}
        title={title || address}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
