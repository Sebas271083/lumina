function Svg({ children, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MapPin = (props) => (
  <Svg {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="2.75" />
  </Svg>
);

export const Mail = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);

export const Phone = (props) => (
  <Svg {...props}>
    <path d="M6.6 10.6c1.2 2.4 3.2 4.4 5.6 5.6l2-2a1.3 1.3 0 0 1 1.4-.3c1 .35 2.1.55 3.2.55.7 0 1.2.55 1.2 1.2v3.1c0 .7-.55 1.25-1.2 1.25C10.4 20 4 13.6 4 5.2 4 4.55 4.55 4 5.2 4h3.1c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.55 3.2.15.5.05 1.05-.3 1.4l-2 2Z" />
  </Svg>
);

export const ArrowRight = (props) => (
  <Svg {...props}>
    <path d="M4 12h16" />
    <path d="m13 5 7 7-7 7" />
  </Svg>
);

export const ArrowLeft = (props) => (
  <Svg {...props}>
    <path d="M20 12H4" />
    <path d="m11 5-7 7 7 7" />
  </Svg>
);

export const Maximize = (props) => (
  <Svg {...props}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </Svg>
);

export const Menu = (props) => (
  <Svg {...props}>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </Svg>
);

export const X = (props) => (
  <Svg {...props}>
    <path d="m5 5 14 14" />
    <path d="m19 5-14 14" />
  </Svg>
);

export const Leaf = (props) => (
  <Svg {...props}>
    <path d="M20 4c-8 0-16 4-16 13 0 .55.45 1 1 1 9 0 13-8 13-16 0-.55.45-1 1-1a1 1 0 0 1 1 1v2Z" />
    <path d="M5 20c2-4 5-7 9-9" />
  </Svg>
);

export const Building2 = (props) => (
  <Svg {...props}>
    <path d="M4 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
    <path d="M13 10h6a1 1 0 0 1 1 1v10" />
    <path d="M4 21h16" />
    <path d="M7 8h1M7 12h1M7 16h1M10 8h1M10 12h1M10 16h1M16 14h1M16 17h1" />
  </Svg>
);

export const ChevronDown = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const Check = (props) => (
  <Svg {...props}>
    <path d="m5 13 4 4 10-10" />
  </Svg>
);

export const Award = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" />
  </Svg>
);

export const Zap = (props) => (
  <Svg {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </Svg>
);

export const Droplet = (props) => (
  <Svg {...props}>
    <path d="M12 3s7 7.5 7 12.2A7 7 0 0 1 5 15.2C5 10.5 12 3 12 3Z" />
  </Svg>
);

export const Recycle = (props) => (
  <Svg {...props}>
    <path d="M7 19H4.8a2 2 0 0 1-1.7-3l1.7-2.9" />
    <path d="m10 5.5 2.2-3.5 2.2 3.5" />
    <path d="M14 19h4.9a2 2 0 0 0 1.7-3L18.5 12" />
    <path d="m8.5 12-2.2 3.5H10" />
    <path d="m18 12 2.2 3.5" />
    <path d="M12 2v7" />
  </Svg>
);

export const Wind = (props) => (
  <Svg {...props}>
    <path d="M4 8h9a2.5 2.5 0 1 0-2.5-2.5" />
    <path d="M2 13h13a2.5 2.5 0 1 1-2.5 2.5" />
    <path d="M6 18h7a2.5 2.5 0 1 1-2.5 2.5" />
  </Svg>
);
