// A small set of authored SVG icons, drawn on a 24×24 grid.
// Transport legends (play, record, stop...) are filled like the symbols
// printed on cassette-deck keys. Interface icons use a 1.75 stroke.
// Icons are decorative: the button or link next to them carries the words.

const FILLED = {
  play: <path d="M7 4.5v15l12.5-7.5z" />,
  record: <circle cx="12" cy="12" r="6.5" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="1" />,
  pause: (
    <>
      <rect x="6" y="5" width="4.25" height="14" rx="0.75" />
      <rect x="13.75" y="5" width="4.25" height="14" rx="0.75" />
    </>
  ),
  forward: (
    <>
      <path d="M3 6v12l9-6z" />
      <path d="M12 6v12l9-6z" />
    </>
  ),
  rewind: (
    <>
      <path d="M21 6v12l-9-6z" />
      <path d="M12 6v12L3 12z" />
    </>
  ),
  eject: (
    <>
      <path d="M12 4.5 4.5 13.5h15z" />
      <rect x="4.5" y="16" width="15" height="3" rx="0.75" />
    </>
  ),
}

const STROKED = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.25v.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  // The return key legend (↵), drawn so it does not depend on a font.
  enter: <path d="M19 5v6.5a3 3 0 0 1-3 3H5.5m0 0 4-4m-4 4 4 4" />,
}

// A cassette reel, used for loading states (it turns).
const REEL = (
  <>
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 4.75v3.5M18.3 15.6l-3-1.75M5.7 15.6l3-1.75" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
  </>
)

export function Icon({ name, size = 20, className }) {
  const isStroked = name in STROKED
  const shape = name === 'reel' ? REEL : isStroked ? STROKED[name] : FILLED[name]

  if (!shape) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={isStroked ? 'none' : 'currentColor'}
      stroke={isStroked ? 'currentColor' : 'none'}
      strokeWidth={isStroked ? 1.75 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shape}
    </svg>
  )
}
