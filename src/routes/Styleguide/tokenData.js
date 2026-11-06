// Data shown on /styleguide. Ratios were measured with the WCAG formula
// and are recorded in design-system/relik/MASTER.md.

export const swatchGroups = [
  {
    name: 'Casing',
    swatches: [
      { token: '--putty', hex: '#E4DCCB', role: 'Light casing, page ground', ratio: 'Graphite text 12.4:1' },
      { token: '--putty-light', hex: '#EFE9DC', role: 'Raised keys, fields', ratio: 'Graphite text 13.9:1' },
      { token: '--putty-deep', hex: '#CFC5B0', role: 'Bays, insets', ratio: 'Graphite text 9.9:1' },
      { token: '--graphite', hex: '#1C1D1F', role: 'Dark rooms, bezels, ink', ratio: 'Putty text 12.4:1', dark: true },
      { token: '--panel', hex: '#2A2B2E', role: 'Raised dark surfaces', ratio: 'Putty text 10.4:1', dark: true },
    ],
  },
  {
    name: 'Screens',
    swatches: [
      { token: '--crt', hex: '#0B0D0A', role: 'CRT and VFD glass', ratio: 'Amber text 10.7:1', dark: true },
      { token: '--amber', hex: '#FFB000', role: 'Phosphor, on screens only', ratio: 'On CRT 10.7:1' },
      { token: '--amber-dim', hex: '#C78A00', role: 'Secondary screen text', ratio: 'On CRT 6.6:1' },
      { token: '--vfd', hex: '#7FE3CF', role: 'VFD readouts, dark only', ratio: 'On CRT 12.8:1' },
    ],
  },
  {
    name: 'Signal and ink',
    swatches: [
      { token: '--signal', hex: '#FF5A1F', role: 'The one accent: a fill', ratio: 'Graphite text 5.4:1' },
      { token: '--ink-muted', hex: '#514B40', role: 'Secondary text on putty', ratio: 'On putty 6.3:1', dark: true },
      { token: '--line', hex: '#736B59', role: 'Control borders on putty', ratio: 'On putty 3.9:1', dark: true },
      { token: '--error', hex: '#843010', role: 'Error text, with the word', ratio: 'On putty 6.4:1', dark: true },
      { token: '--muted-on-dark', hex: '#A8A091', role: 'Secondary text on dark', ratio: 'On graphite 6.5:1' },
    ],
  },
]

export const typeSpecimens = [
  { token: '--text-display', face: 'Archivo, width 125, weight 800', sample: 'display' },
  { token: '--text-3xl', face: 'Archivo, width 125, weight 800', sample: 'room' },
  { token: '--text-2xl', face: 'Archivo, width 125, weight 800', sample: 'panel' },
  { token: '--text-xl', face: 'Archivo, width 125, weight 800', sample: 'card' },
  { token: '--text-lg', face: 'IBM Plex Sans, weight 400', sample: 'lead' },
  { token: '--text-base', face: 'IBM Plex Sans, weight 400', sample: 'body' },
  { token: '--text-sm', face: 'IBM Plex Mono, weight 500, uppercase labels', sample: 'label' },
  { token: '24px+', face: 'VT323, screens only, never paragraphs', sample: 'screen' },
]

export const spaceScale = [
  ['--space-1', 4],
  ['--space-2', 8],
  ['--space-3', 12],
  ['--space-4', 16],
  ['--space-5', 24],
  ['--space-6', 32],
  ['--space-7', 48],
  ['--space-8', 64],
  ['--space-9', 96],
  ['--space-10', 128],
]

export const radii = [
  ['--radius-plate', '2px', 'Dymo tape, plates, bays'],
  ['--radius-key', '4px', 'Keys, switches, fields'],
  ['--radius-case', '10px', 'Faceplates'],
  ['--radius-glass', '18px', 'CRT glass'],
]

// The demo object for SpecimenBay (facts from docs/relik-seed-data.json).
export const demoObject = {
  name: 'Walkman TPS-L2',
  yearLabel: '1979',
  category: 'Audio',
  accession: 'RLK·1979·001',
  image: 'objects/walkman.webp',
  alt: 'Sony Walkman TPS-L2: a blue and brushed-silver cassette player with an orange Hotline button and two headphone jacks marked A and B.',
  story: 'The first personal stereo. Two headphone jacks, because Sony assumed listening would be shared.',
}

export const demoObjectDark = {
  name: 'Game Boy (DMG-01)',
  yearLabel: '1989',
  category: 'Gaming',
  accession: 'RLK·1989·003',
  image: 'objects/gameboy.webp',
  alt: 'Nintendo Game Boy DMG-01: a grey handheld console with a green-tinted screen, a cross-shaped pad and two red buttons.',
  story: 'A monochrome screen that traded colour for battery life.',
}
