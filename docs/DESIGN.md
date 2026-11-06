---
name: RELIK
description: Technology never truly disappears. An archive terminal and a rack of hardware in a museum store room.
colors:
  putty: "#e4dccb"
  putty-light: "#efe9dc"
  putty-deep: "#cfc5b0"
  graphite: "#1c1d1f"
  panel: "#2a2b2e"
  sunken-dark: "#151618"
  crt: "#0b0d0a"
  amber: "#ffb000"
  amber-dim: "#c78a00"
  vfd: "#7fe3cf"
  signal: "#ff5a1f"
  signal-edge: "#b8400f"
  ink: "#1c1d1f"
  ink-muted: "#514b40"
  line: "#736b59"
  hairline: "#b9ae96"
  paper-on-dark: "#e4dccb"
  muted-on-dark: "#a8a091"
  line-on-dark: "#808185"
  error: "#843010"
  dymo-tape: "#141414"
  dymo-ink: "#f2efe8"
typography:
  display:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  title-sm:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.4rem, 1.2rem + 0.8vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  lead:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.08em"
  label-xs:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.08em"
  screen:
    fontFamily: "VT323, 'IBM Plex Mono', monospace"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.02em"
rounded:
  plate: "2px"
  key: "4px"
  case: "10px"
  glass: "18px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  "9": "96px"
  "10": "128px"
  gutter: "clamp(16px, 4vw, 56px)"
  page-max: "1360px"
components:
  transport-key-putty:
    backgroundColor: "{colors.putty-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.key}"
    padding: "12px 24px 12px 16px"
    height: "52px"
  transport-key-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.key}"
    padding: "12px 24px 12px 16px"
    height: "52px"
  transport-key-graphite:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.key}"
    padding: "12px 24px 12px 16px"
    height: "52px"
  transport-key-lg:
    rounded: "{rounded.key}"
    padding: "16px 32px 16px 24px"
    height: "64px"
  field:
    backgroundColor: "{colors.putty-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.key}"
    padding: "12px 16px"
    height: "48px"
  field-disabled:
    backgroundColor: "{colors.putty-deep}"
    textColor: "{colors.ink-muted}"
  panel-putty:
    backgroundColor: "{colors.putty}"
    textColor: "{colors.ink}"
    rounded: "{rounded.case}"
    padding: "clamp(24px, 3vw, 48px)"
  panel-graphite:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper-on-dark}"
    rounded: "{rounded.case}"
    padding: "clamp(24px, 3vw, 48px)"
  model-plate:
    backgroundColor: "{colors.putty-deep}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-xs}"
    rounded: "{rounded.plate}"
    padding: "3px 8px"
  dymo-label:
    backgroundColor: "{colors.dymo-tape}"
    textColor: "{colors.dymo-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
  dymo-label-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
  screen-glass:
    backgroundColor: "{colors.crt}"
    textColor: "{colors.amber}"
    typography: "{typography.screen}"
    rounded: "{rounded.glass}"
    padding: "clamp(16px, 2.4vw, 32px)"
  screen-glass-vfd:
    backgroundColor: "{colors.crt}"
    textColor: "{colors.vfd}"
    typography: "{typography.screen}"
    rounded: "{rounded.glass}"
  nav-bar:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper-on-dark}"
    typography: "{typography.body}"
    height: "68px"
  nav-link:
    textColor: "{colors.paper-on-dark}"
    rounded: "{rounded.key}"
    padding: "0 12px"
    height: "44px"
  switch-housing:
    backgroundColor: "{colors.putty-deep}"
    rounded: "{rounded.key}"
    width: "46px"
    height: "24px"
---

# Design System: RELIK

## Overview

**Creative North Star: "The Archive Terminal in the Store Room"**

RELIK is built as a rack of museum hardware. Every section of a page is a piece of equipment: a putty or graphite faceplate held by four screws. Every object is a specimen in a recessed bay with a lamp above it and a floor shadow under it. Every control is a physical part, such as a transport key with travel and an LED, a slide switch, a mixing-desk fader, a segmented LED meter, or a mechanical tape counter. The visitor operates the archive; they are not reading a brochure about it.

The palette is restrained and material-led. Putty and graphite casings take over whole rooms (`data-room="dark"` flips every semantic token). One signal orange appears as a fill or a lit LED, never as text. Amber phosphor and VFD cyan-green live only behind screen glass. Depth always comes from one light source above: raised faceplates catch a top highlight, bays and screen wells fall into shadow, and keys press down 3px. The effects are quiet. Scanlines (8%) and phosphor glow appear only when the visitor turns "CRT effects" on, and reduced motion keeps the whole page calm and complete.

The mood is precise, warm, tactile and slightly nostalgic: late-70s hi-fi decks, Braun putty plastics, monochrome terminals and service-manual typography, all at the standard of a credible museum. Confirmed rejections: synthwave sunsets, neon grids, chrome lettering, purple or blue gradients, glassmorphism, glitch overload, pixel-art game UI, and the generic SaaS hero.

**Key Characteristics:**
- Whole rooms in putty or graphite casing, switched with `data-room="dark"`, which remaps the semantic tokens (`--surface`, `--text`, `--text-muted`, `--control-line`, `--focus`).
- Light from above: raised faceplates, recessed bays and wells, keys with 4px of travel.
- Each component is named for real hardware and backed by a real HTML control.
- One orange signal, used as a fill or LED only; phosphor colours only on screen glass.
- Words carry every meaning. LEDs, segments and colours repeat the meaning and never replace it.

## Colors

The palette is two casing materials, one orange indicator and two phosphors that stay behind glass.

### Primary
- **Signal Orange** (signal): The only accent. It appears as the primary transport-key fill, lit LEDs (active nav link, switch on, key hover or pressed, power lamp), the top-ranked LED meter, orange Dymo tape, the skip link and `::selection`. Text on it is always graphite (5.41:1).
- **Signal Edge** (signal-edge): The darker orange used for the travel edge and border of the signal key and for the putty caret colour. It is never a text colour.

### Secondary
- **Amber Phosphor** (amber): Screen text on CRT glass (10.65:1), lit LED-meter segments, and the focus ring in dark rooms. **Dim Amber** (amber-dim) is secondary screen text (6.56:1).

### Tertiary
- **VFD Cyan-Green** (vfd): Vacuum-fluorescent readouts on dark glass only: fader readouts and `tone="vfd"` screens (12.81:1 on crt).

### Neutral
- **Putty Casing** (putty): The page ground and light faceplates.
- **Raised Putty** (putty-light): Key tops and form-field wells.
- **Deep Putty** (putty-deep): Specimen bays, engraved plates and switch housings in light rooms.
- **Graphite Bezel** (graphite): Dark rooms, the nav rack unit, and the colour of primary text on putty (`ink` shares this value, 12.37:1).
- **Raised Panel** (panel): Raised dark surfaces and the screen bezel body.
- **Dark Sunken** (sunken-dark): The recessed surface in dark rooms (`--surface-sunken` under `data-room="dark"`), dark model plates and dark bays.
- **CRT Glass** (crt): Screens, LED-meter channels and VFD readout windows.
- **Muted Ink** (ink-muted): Secondary text on putty (6.34:1, and 5.05:1 on putty-deep).
- **Control Line** (line): Control borders on putty (3.87:1). **Hairline** (hairline) is for decorative dividers only and must never be used as a control border.
- **Paper on Dark / Muted on Dark / Line on Dark** (paper-on-dark, muted-on-dark, line-on-dark): Text, secondary text and control borders in graphite rooms.
- **Error Rust** (error): Error text and the 2px invalid-field border on putty (6.39:1). It is always shown with the word "Error" and an alert icon.
- **Dymo Tape / Dymo Ink** (dymo-tape, dymo-ink): Black label tape with embossed off-white letters.
- **Channel** (channel, #222326): Lab channel strips and the Out module. **LED Off Dark** (led-off-dark, #4b4c50): an unlit LED on a dark panel.
- **LED Lit** (led-lit): a signal lens gradient with a hot spot; its halo (led-halo) only exists under `html[data-crt="on"]`.

### Named Rules
**The Fill-Only Signal Rule.** Signal orange is a fill or a light, never text or a border on putty (2.29:1 fails). If something orange carries words, the words are graphite.

**The Behind-Glass Rule.** Amber and VFD cyan-green appear only on crt or dark surfaces. Amber is the dark-room focus ring; outside that one use, phosphor never touches putty.

**The Two-Room Rule.** A room is either putty or graphite. Components read only the semantic tokens, so the same part works in both rooms without a variant.

**The Words-First Rule.** No state depends on colour alone. An active filter has a lit LED, a moved knob and a heavier label. A fit level has a word and a rank as well as its segments. An error shows the word "Error" and an icon. Never pair red and green to mean good and bad.

## Typography

**Display Font:** Archivo variable at width 125 (with Arial Narrow)
**Body Font:** IBM Plex Sans (with system-ui)
**Label/Mono Font:** IBM Plex Mono 400/500/600 (with ui-monospace)
**Screen Font:** VT323 (with IBM Plex Mono)

**Character:** A wide, heavy 70s-hardware grotesk stamped on the faceplates, over a computing-heritage sans that stays legible at length. Mono handles the service-manual data, and VT323 is reserved for phosphor. All four families are self-hosted woff2 files in `site/public/fonts/` with `font-display: swap`.

### Hierarchy
- **Display** (900, clamp 2.75rem→6rem, 1.05, −0.03em): Hero and masthead headlines. Sentence case.
- **Headline** (800, clamp 2.25rem→3.75rem, 1.25, −0.015em): Room titles (h2 of a page section).
- **Title** (800, clamp 1.75rem→2.5rem): Panel titles. **Title-sm** (800, clamp 1.4rem→1.75rem) is for specimen names and card titles.
- **Lead** (400, 1.3125rem, 1.55): Intro paragraphs, max 52–56ch.
- **Body** (400, 1.0625rem / 17px, 1.55): Running text, max 68ch (`--measure`). Labels on controls use 500–600.
- **Label** (Plex Mono 500, 0.875rem or 0.75rem, +0.08em, UPPERCASE): Plates, captions, scale words, counts. This is the only place uppercase appears apart from screens and Dymo tape.
- **Screen** (VT323 400, 1.25rem / 1.5rem / 2rem, 1.15, +0.02em, UPPERCASE): Short CRT and VFD readouts only.

Every h1–h4 sets Archivo through `font-stretch: 125%` with `text-wrap: balance`. Paragraphs use `text-wrap: pretty`. Tables and `.tabular` use tabular numbers.

### Named Rules
**The 20px Phosphor Rule.** VT323 is never set below 1.25rem (20px) and never sets a paragraph. Use it for short readouts only.

**The Uppercase-Is-Equipment Rule.** Uppercase is limited to mono labels, Dymo tape and screen text. Headings and body stay in sentence case.

**The Banned Faces Rule.** Never use Orbitron, Audiowide, Michroma, Press Start 2P, Inter, Space Grotesk or a system display face. Archivo's width axis covers the logotype (wght 900, +0.04em).

## Layout

Content sits in a centred column, max 1360px (`--page-max`), with a fluid page gutter of clamp(16px, 4vw, 56px). Spacing follows a 4px base scale from 4px to 128px. Sections are separated by 96px (`--space-9`). Panels pad with clamp(24px, 3vw, 48px) and leave 32px under their header. Headings get more space above than below. Collections use auto-fill grids with minimums (190–300px) that wrap, not a fixed three-column grid. LED meters use fixed columns (rank 2.5rem · label 6–9rem · bar · fit 7.5rem) so that stacked meters line up.

Responsive changes are redesigns rather than scaling. Below 820px the nav hides its links, session control and model plate, and shows a 48px menu key that opens a full-screen graphite `<dialog>` with display-size links. Below 560px an LED meter moves its bar onto a second row under the rank, label and fit word. The full-width stacked layout is verified at 390px.

**The 44px Rule.** Every hit target is at least 44px: nav links 44px, switches 44px (the invisible input covers the whole label), fields 48px, keys 52px, large keys 64px, mobile menu links 64px.

## Elevation & Depth

Depth is physical and has one light source above. Raised surfaces get an inset white top highlight, a 1px dark edge and a soft drop below. Recessed surfaces get an inner shadow from the top. Floor shadows under objects are blurred ellipse elements, never masks. Light rooms tint their shadows warm (rgb 40 30 10). Dark rooms use pure black.

### Shadow Vocabulary
- **Raised** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.45), 0 1px 0 rgb(0 0 0 / 0.12), 0 6px 12px -4px rgb(40 30 10 / 0.28)`): Putty faceplates, plus a `0 0 0 1px rgb(115 107 89 / 0.35)` case seam.
- **Raised dark** (`inset 0 1px 0 rgb(255 255 255 / 0.08), 0 1px 0 rgb(0 0 0 / 0.5), 0 8px 16px -6px rgb(0 0 0 / 0.6)`): Graphite faceplates.
- **Inset** (`inset 0 8px 16px -6px rgb(40 30 10 / 0.35), inset 0 1px 2px rgb(40 30 10 / 0.25)`): Specimen bays and screen wells. **Inset dark** is the black equivalent.
- **Key travel** (`0 4px 0 <key edge>, 0 7px 12px -3px rgb(0 0 0 / 0.35)`): Transport keys only. When pressed, the key moves down 3px and the edge shrinks to 1px.
- **Engraved** (`inset 0 1px 2px rgb(40 30 10 / 0.3), 0 1px 0 rgb(255 255 255 / 0.5)`): Model plates, key legend windows, tape-counter housings.
- **LED glow** (`--led-halo`, `0 0 6px 1px rgb(255 90 31 / 0.55)`): Lit signal LEDs only, and only when CRT effects are on. With CRT effects off a lit LED is a lens gradient with no halo.

### Named Rules
**The Lamp-Above Rule.** Highlights sit on top edges and shadows fall downward. Never light a surface from the side or from below.

**The Travel-Is-For-Keys Rule.** The solid 4px offset edge exists because a transport key has physical travel. Don't use it on any other surface. Cards, panels and labels never get a hard offset shadow.

## Shapes

Radius follows the physical object, not one global value: plate 2px (Dymo tape, model plates, bays, LED channels, tape counters), key 4px (transport keys, switches, fields, nav links), case 10px (faceplates), glass 18px (CRT glass, with the bezel at glass + 8px). Round shapes are reserved for LEDs, screws and floor shadows. Borders are 1px control lines; only the invalid field uses 2px, and disabled controls switch to a dashed border. Four 11px slotted screws sit 12px in from each faceplate corner. Each slot is drawn at its own angle, and the screws are decorative and `aria-hidden`.

## Components

Every component lives in `site/src/components/<Name>/` with `Name.jsx` and `Name.module.css`, and wraps a real element. **Styleguide convention:** each stateful component accepts a dev-only `data-demo` attribute (`hover`, `focus`, `active`, `on`) that freezes that state in CSS so `/styleguide` can show every state side by side. The CSS selectors pair each real pseudo-class with its `[data-demo]` twin. Use it only on `/styleguide`, never in product routes.

### Buttons: TransportKey
Feels like a cassette-deck key: chunky, with travel and a status LED.
- **Shape:** keys (4px), min-height 52px (64px for `lg`), 1px control-line border, top-to-bottom gradient from key top to key base.
- **Legend:** an optional 28px recessed window holding an authored SVG transport symbol (play, record, stop, pause, forward, rewind, eject) next to a real text label. A key never shows an icon alone.
- **Variants:** putty (default), graphite (dark rooms), signal (the one primary action per view; graphite legend).
- **Sizes:** sm (44px, compact actions such as Quick look), md (52px), lg (64px).
- **Current step:** `current` sets `aria-current="step"` (used by the Walkman track keys): pressed position, lit LED and a signal-filled legend window.
- **States:** hover brightens by 4% and lights the 6px corner LED in signal (pale cream on the signal key). Active or `aria-pressed="true"` moves the key 3px down and removes its travel edge. Focus shows a 2px `--focus` ring at 4px offset. Disabled is pressed flat, desaturated and shows a not-allowed cursor. Loading (`aria-busy`) shows a turning reel icon (1.6s), which stops under reduced motion.

### Chips: DymoLabel
Black embossed tape with off-white mono letters (600, 0.875rem, +0.14em, uppercase). A glossy gradient and an embossed text-shadow give the relief. It carries accession numbers (`RLK·1979·001`) and tags as real text. The orange-tape variant uses graphite letters and marks invented content ("Sample") and the Lab disclaimer. Short labels sit on one line; long translated labels wrap inside the tape instead of leaving the screen.

### Cards / Containers: Panel
- **Corner Style:** case (10px).
- **Background:** putty or graphite. The graphite tone sets `data-room="dark"` on the section.
- **Shadow Strategy:** raised or raised dark, plus a 1px case seam.
- **Furniture:** four screws, and an optional engraved model plate (mono xs, putty-deep or sunken-dark well) in the bottom-right corner that identifies the unit, for example "RLK-100 Archive console". It is never placed above a heading.
- **Internal Padding:** clamp(24px, 3vw, 48px). The header column is capped at 68ch.

### Signature: SpecimenBay
The object card is an `a` wrapping a `figure`. It contains a recessed bay (sizes s/m/l: 200/260/380px) lit by a radial lamp from above, a cut-out photograph with a soft drop shadow, and a blurred 62% floor ellipse. Hover or focus lifts the photo 8px and tightens the floor shadow to 82% (600ms, ease-out). The caption holds a Dymo accession number, the name in Title-sm, and mono year and category separated by a 1px hairline rule. Loading shows an empty bay pulsing at 0.5 Hz. A missing image shows a mono "photograph unavailable" message in the bay. The graphite variant has a dark well and a faint lamp.

### Signature: Screen
A moulded graphite bezel around curved CRT glass with a radial vignette and a top-left reflection. Phosphor is amber by default or VFD with `tone="vfd"`. Text uses ScreenLine in VT323 at sm/md/lg/xl (20/24/32/36–56px), uppercase, with an optional dim colour. `contentClassName` lays out the content area (the hero and Archive screens hold real search forms). `powerOn` plays the power-on reveal; `backdrop` accepts a decorative layer under the text (currently unused). States: off (dark glass, visually hidden "Screen off"), loading (`aria-busy`, 1 Hz block cursor), and error (inner phosphor-dim outline). Live screens use `role="status"`. Scanlines (8%) and a 6px phosphor glow appear only under `html[data-crt="on"]`.

### Inputs / Fields: Field
- **Style:** a recessed putty-light well with a 1px control-line border, keys radius, min-height 48px and a warm inner top shadow, like the label window on a cassette case. The label (600) sits above, with an optional muted hint.
- **Focus:** 2px `--focus` outline at 2px offset; the border turns ink. On hover the border turns ink.
- **Error / Disabled:** error shows a 2px error-rust border and a message row with an alert icon, a bold "Error" word and the message in rust. Disabled shows a dashed border on putty-deep with muted ink.

### Switch
A real checkbox or radio stretched invisibly over the whole label. It shows a 46×24 recessed housing with a ridged knob, an 8px LED and the text. When on, the knob slides 22px, the LED lights signal and the label goes to 600, so three cues carry the state. An optional mono count is right-aligned; a switch with a count fills its grid cell so the number never overprints the label. On hover the housing border turns the text colour. The focus ring goes around the housing. Disabled shows a dashed housing and muted text.

### Fader
A native `input type="range"` styled as a mixing-desk fader: a 6px dark slot, and a 22×40 graphite cap with a putty index line that turns signal on hover. A VFD readout window shows the current word, and a mono uppercase 1–5 scale of words (the current word is bold, with a 2px tick). `aria-valuetext` carries the word. Vertical orientation rotates the input, so the low end sits at the bottom. The focus ring goes around the cap.

### LedMeter
Ten `aria-hidden` segments in a crt channel: amber when lit, signal for the top-ranked meter. The rank (`#1`), label and mono fit word ("Strong fit", "Possible", "Unlikely") carry the meaning. Segments light in a 25ms stagger. A vertical channel-strip variant and small decorative VU meters (hero only) also exist.

### TapeCounter
Mechanical digit wheels in a dark housing with drum shading. A wheel rolls to its digit over 520ms with ease-out. The plain number is read from visually hidden text. A mono caption sits under the wheels.

### Navigation: Nav
A 19-inch rack unit: a graphite gradient bar, at least 68px tall, with a black bottom edge. The logotype pairs a lit signal power lamp with an Archivo 900 wordmark at 125% width. Each link (Plex Sans 500, 44px) has an LED. The current page lights the LED signal, raises the weight to 600 and draws a 2px paper bar under the label. Link hover is a 5% white wash. The session control is an outlined key (line-on-dark border). Below 820px a 48px menu key opens a full-screen graphite dialog with display-size links of at least 64px.

### Added after the first style guide
- **Footer:** the bottom rack unit with links, credits, course details and the "CRT effects: on/off" switch.
- **Select:** a labelled native select in a key-radius window with a drawn chevron.
- **Dialog:** a native `<dialog>` on a putty faceplate with two screws, a title and a 44px close key; a bottom sheet on phones. Its panel rises 12px into place (280ms; opacity only with reduced motion).
- **Toast:** a dark status strip with a lit LED, bottom centre, inside one always-present `role="status"` region.
- **ErrorSummary:** a 2px rust-bordered box listing every problem as a link to its field; it takes focus after a failed submit.
- **DecodeText:** terminal text that decodes into place once, built on React Bits' ScrambledText (vendored in `components/ReactBits/`, pointer and click effects off). It is the site's only React Bits component.
- **Rooms:** `data-room="light"` restores putty tokens inside a dark room (the sign-in form).

### Focus and motion (shared)
The focus ring is `outline: 2px solid var(--focus)` with a 3px offset everywhere: graphite in putty rooms, amber in dark rooms. Easing is `cubic-bezier(0.16, 1, 0.3, 1)` with durations of 90ms for press, 180ms for hover, 260ms for state and 600ms for reveal. Nothing blinks faster than 1 Hz.

Authored motion, all respecting `useReducedMotion()`:
- **Hero boot** (first visit per session): the CRT opens from a bright horizontal line (520ms), then four readout lines decode in 220ms apart; about 1.2s in total, skippable by key or button.
- **Power-on reveal:** specimen photographs below the fold open from a bright line the first time they scroll into view; nothing already on screen is hidden.
- **Walkman deck:** pinned with ScrollTrigger scrub and snap on wide screens; reels turn and the tape counter rolls. Stacked chapters on phones or with reduced motion.
- **Archive Gallery ⇄ Index:** GSAP Flip morphs each photo between its bay and its index thumbnail.
- **Feedback:** key travel, LED segment stagger, tape-counter wheels, cable colour fades, toast rise.

Reduced motion is handled in each component's own CSS and in every GSAP use; there is no global kill switch (it made focus outlines transition). CRT effects default to off under reduced motion, and the choice persists in `relik:crt`.

## Do's and Don'ts

### Do:
- **Do** build every section as a Panel in putty or graphite, and switch rooms with `data-room="dark"` instead of hand-picking colours.
- **Do** read semantic tokens (`--surface`, `--text`, `--text-muted`, `--control-line`, `--focus`) inside components, so the same part works in both rooms.
- **Do** put graphite text on any orange fill (5.41:1). Keep one signal-orange key per view.
- **Do** carry every state in words or position as well as colour: LED, knob position, weight, fit word, rank, and the word "Error".
- **Do** present devices as cut-out photographs in a lit SpecimenBay with a floor-shadow ellipse. Never recolour or distort them.
- **Do** gate scanlines (max 8%) and glow behind `html[data-crt="on"]`, and keep every blink at 1 Hz or slower.
- **Do** keep hit targets at 44px or more, and use real `button`, `a`, `input` and `label` elements under every metaphor.
- **Do** use `data-demo` only on `/styleguide` to freeze states.

### Don't:
- **Don't** use signal orange as text or a border on putty (2.29:1).
- **Don't** let amber or VFD cyan-green leave dark glass, except amber as the dark-room focus ring.
- **Don't** set VT323 below 20px or use it for paragraphs.
- **Don't** use a hard offset shadow on anything except a TransportKey's travel edge.
- **Don't** put a mono label above a heading as a topic kicker. A model plate identifies the unit; it does not introduce the section.
- **Don't** add a second React Bits component without removing one: the budget is three, and the WebGL CRT background was tried and removed because it washed out the readout.
- **Don't** use Unicode glyphs or emoji as icons. Use the authored 24px SVG set (filled transport symbols, interface icons with a 1.75 stroke), always next to words.
- **Don't** use synthwave sunsets, neon grids, chrome lettering, purple or blue gradients, glassmorphism, glitch overload, pixel-art UI, gradient text, or a SaaS hero with text left and a card right.
- **Don't** pair red and green to mean good and bad. Don't use the hairline colour as a control border.
