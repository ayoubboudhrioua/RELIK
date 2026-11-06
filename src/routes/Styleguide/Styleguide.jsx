import { useState } from 'react'
import { en } from '../../content/en.js'
import { useCrtEffects } from '../../hooks/useCrtEffects.jsx'
import { Panel } from '../../components/Panel/Panel.jsx'
import { SpecimenBay } from '../../components/SpecimenBay/SpecimenBay.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { Screen, ScreenLine, Cursor } from '../../components/Screen/Screen.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { Switch } from '../../components/Switch/Switch.jsx'
import { Fader } from '../../components/Fader/Fader.jsx'
import { LedMeter } from '../../components/LedMeter/LedMeter.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { Nav } from '../../components/Nav/Nav.jsx'
import { Field } from '../../components/Field/Field.jsx'
import { StateGrid } from './StateGrid.jsx'
import { swatchGroups, typeSpecimens, spaceScale, radii, demoObject, demoObjectDark } from './tokenData.js'
import styles from './Styleguide.module.css'

const t = en.styleguide
const s = t.states
const d = t.demo
const fWords = en.lab.inputs[0].words

// Development-only page: every token and component in each state.
export default function Styleguide() {
  const { crtOn, setCrtOn } = useCrtEffects()
  const [faderValue, setFaderValue] = useState(4)
  const [faderValue2, setFaderValue2] = useState(2)
  const [count, setCount] = useState(18)
  const [period, setPeriod] = useState('80s')

  const sections = [
    ['colour', t.sections.colour],
    ['type', t.sections.type],
    ['depth', t.sections.depth],
    ['components', t.sections.components],
  ]

  return (
    <div className={styles.page}>
      <header className={styles.masthead} data-room="dark">
        <div className={styles.mastInner}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.intro}>{t.intro}</p>
          <Switch
            label={`${en.crt.label}: ${crtOn ? en.crt.on : en.crt.off}`}
            checked={crtOn}
            onChange={(e) => setCrtOn(e.target.checked)}
          />
          <p className={styles.plate}>{t.plate}</p>
        </div>
        <nav aria-label={t.title} className={styles.contents}>
          <ol role="list">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* ---------- Colour ---------- */}
      <section id="colour" className={styles.section} aria-labelledby="colour-h">
        <h2 id="colour-h" className={styles.h2}>{t.sections.colour}</h2>
        <p className={styles.note}>{t.swatchNote}</p>
        {swatchGroups.map((group) => (
          <div key={group.name} className={styles.swatchGroup}>
            <h3 className={styles.h3}>{group.name}</h3>
            <ul role="list" className={styles.swatches}>
              {group.swatches.map((sw) => (
                <li key={sw.token} className={styles.swatch}>
                  <span className={styles.chip} style={{ background: sw.hex }} />
                  <code className={styles.token}>{sw.token}</code>
                  <span className={styles.hex}>{sw.hex}</span>
                  <span className={styles.role}>{sw.role}</span>
                  <span className={styles.ratio}>{sw.ratio}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ---------- Type ---------- */}
      <section id="type" className={styles.section} aria-labelledby="type-h">
        <h2 id="type-h" className={styles.h2}>{t.sections.type}</h2>
        <dl className={styles.typeList}>
          {typeSpecimens.map((spec) => (
            <div key={spec.token} className={styles.typeRow}>
              <dt>
                <code className={styles.token}>{spec.token}</code>
                <span className={styles.role}>{spec.face}</span>
              </dt>
              <dd>
                <TypeSample kind={spec.sample} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Space, radius, depth ---------- */}
      <section id="depth" className={styles.section} aria-labelledby="depth-h">
        <h2 id="depth-h" className={styles.h2}>{t.sections.depth}</h2>
        <div className={styles.depthGrid}>
          <ul role="list" className={styles.spaceList}>
            {spaceScale.map(([token, px]) => (
              <li key={token}>
                <code className={styles.token}>{token}</code>
                <span className={styles.spaceBar} style={{ width: px }} />
                <span className={styles.role}>{px}px</span>
              </li>
            ))}
          </ul>
          <ul role="list" className={styles.radiusList}>
            {radii.map(([token, value, use]) => (
              <li key={token}>
                <span className={styles.radiusChip} style={{ borderRadius: value }} />
                <code className={styles.token}>{token}</code>
                <span className={styles.role}>{value}: {use}</span>
              </li>
            ))}
          </ul>
          <ul role="list" className={styles.shadowList}>
            <li><span className={`${styles.shadowChip} ${styles.raised}`} />{d.raised}</li>
            <li><span className={`${styles.shadowChip} ${styles.inset}`} />{d.inset}</li>
            <li><span className={`${styles.shadowChip} ${styles.travel}`} />{d.keyTravel}</li>
          </ul>
        </div>
      </section>

      {/* ---------- Components ---------- */}
      <section id="components" className={styles.section} aria-labelledby="components-h">
        <h2 id="components-h" className={styles.h2}>{t.sections.components}</h2>

        <div className={styles.components}>
          <Demo name="Panel">
            <div className={styles.panelPair}>
              <Panel plate="RLK-200 · Archive" title={d.typeRoom} titleAs="h4">
                <p>{t.bodySample}</p>
              </Panel>
              <Panel tone="graphite" plate="RLK-300 · Lab" title={d.typePanel} titleAs="h4">
                <p>{t.bodySample}</p>
              </Panel>
            </div>
          </Demo>

          <Demo name="SpecimenBay">
            <StateGrid
              wide
              items={[
                [s.default, <SpecimenBay key="a" object={demoObject} to="/styleguide" headingAs="h4" />],
                [s.hover, <SpecimenBay key="b" object={demoObject} to="/styleguide" headingAs="h4" data-demo="hover" showStory={false} />],
                [s.focus, <SpecimenBay key="c" object={demoObject} to="/styleguide" headingAs="h4" data-demo="focus" showStory={false} />],
                [s.loading, <SpecimenBay key="d" object={demoObject} state="loading" />],
                [s.error, <SpecimenBay key="e" object={{ ...demoObject, image: 'objects/missing.webp' }} headingAs="h4" showStory={false} />],
                [d.dark, <SpecimenBay key="f" object={demoObjectDark} tone="graphite" to="/styleguide" headingAs="h4" showStory={false} />],
              ]}
            />
          </Demo>

          <Demo name="DymoLabel">
            <div className={styles.row}>
              <DymoLabel>RLK·1979·001</DymoLabel>
              <DymoLabel tilt={-1.5}>RLK·1990·002</DymoLabel>
              <DymoLabel tone="signal">{d.sampleTag}</DymoLabel>
            </div>
          </Demo>

          <Demo name="Screen" tone="graphite">
            <StateGrid
              wide
              items={[
                [s.on, (
                  <Screen key="a" label="Demo screen">
                    <ScreenLine dim size="sm">{d.screenBoot}</ScreenLine>
                    <ScreenLine>{d.screenReady}<Cursor /></ScreenLine>
                  </Screen>
                )],
                ['VFD', (
                  <Screen key="b" tone="vfd" label="Demo VFD">
                    <ScreenLine size="lg">0451</ScreenLine>
                    <ScreenLine dim size="sm">{d.counterLabel}</ScreenLine>
                  </Screen>
                )],
                [s.loading, (
                  <Screen key="c" state="loading" label="Demo screen loading">
                    <ScreenLine>{en.common.loading.toUpperCase()}<Cursor /></ScreenLine>
                  </Screen>
                )],
                [s.error, (
                  <Screen key="d" state="error" label="Demo screen error">
                    <ScreenLine>{d.screenError}</ScreenLine>
                  </Screen>
                )],
                [s.off, <Screen key="e" state="off" label="Demo screen off" />],
              ]}
            />
          </Demo>

          <Demo name="TransportKey">
            <KeyStates variant="signal" icon="play" label={d.explore} />
            <KeyStates variant="putty" icon="record" label={d.enterLab} />
          </Demo>
          <Demo name="TransportKey" tone="graphite" suffix={d.dark}>
            <KeyStates variant="graphite" icon="stop" label={d.stop} />
          </Demo>

          <Demo name="Switch">
            <StateGrid
              items={[
                [s.off, <Switch key="a" label={d.filterAudio} count={4} />],
                [s.on, <Switch key="b" label={d.filterComputing} count={3} defaultChecked />],
                [s.hover, <Switch key="c" label={d.filterGaming} count={2} data-demo="hover" />],
                [s.focus, <Switch key="d" label={d.filterGaming} count={2} data-demo="focus" />],
                [s.disabled, <Switch key="e" label={d.filterGaming} count={0} disabled />],
              ]}
            />
            <fieldset className={styles.radioGroup}>
              <legend>{d.periodLabel}</legend>
              {en.styleguide.periods.map((p) => (
                <Switch
                  key={p.id}
                  type="radio"
                  name="sg-period"
                  value={p.id}
                  label={p.label}
                  checked={period === p.id}
                  onChange={() => setPeriod(p.id)}
                />
              ))}
            </fieldset>
          </Demo>

          <Demo name="Fader" tone="graphite">
            <div className={styles.faderRow}>
              <FaderCell caption={s.default}>
                <Fader label={en.lab.inputs[0].label} words={fWords} value={faderValue} onChange={setFaderValue} />
              </FaderCell>
              <FaderCell caption={s.hover}>
                <Fader label={en.lab.inputs[1].label} words={en.lab.inputs[1].words} value={3} onChange={() => {}} data-demo="hover" />
              </FaderCell>
              <FaderCell caption={s.focus}>
                <Fader label={en.lab.inputs[2].label} words={en.lab.inputs[2].words} value={2} onChange={() => {}} data-demo="focus" />
              </FaderCell>
              <FaderCell caption={s.disabled}>
                <Fader label={en.lab.inputs[3].label} words={en.lab.inputs[3].words} value={1} onChange={() => {}} disabled />
              </FaderCell>
            </div>
            <div className={styles.faderHorizontal}>
              <Fader
                orientation="horizontal"
                label={en.lab.inputs[3].label}
                words={en.lab.inputs[3].words}
                value={faderValue2}
                onChange={setFaderValue2}
              />
            </div>
          </Demo>

          <Demo name="LedMeter" tone="graphite">
            <div className={styles.meterStack}>
              {d.meters.map((m) => (
                <LedMeter key={m.label} label={m.label} fit={m.fit} lit={m.lit} rank={m.rank} highlight={m.rank === 1} />
              ))}
            </div>
            <div className={styles.row}>
              {d.meters.map((m) => (
                <LedMeter key={m.label} orientation="vertical" label={m.label} fit={m.fit} lit={m.lit} highlight={m.rank === 1} />
              ))}
              <div className={styles.vu}>
                <LedMeter decorative lit={7} />
                <LedMeter decorative lit={5} />
              </div>
            </div>
          </Demo>

          <Demo name="TapeCounter">
            <div className={styles.row}>
              <TapeCounter value={count} label={d.counterLabel} size="lg" />
              <TapeCounter value={1979} label="Year" />
              <TapeCounter value={1} size="sm" />
              <TransportKey icon="rewind" onClick={() => setCount((c) => Math.max(0, c - 1))}>
                {d.minus}
              </TransportKey>
              <TransportKey icon="forward" onClick={() => setCount((c) => c + 7)}>
                {d.plus}
              </TransportKey>
            </div>
          </Demo>

          <Demo name="Field">
            <StateGrid
              wide
              items={[
                [s.default, <Field key="a" label={d.fieldLabel} hint={d.fieldHint} />],
                [s.hover, <Field key="b" label={d.fieldLabel} data-demo="hover" />],
                [s.focus, <Field key="c" label={d.fieldLabel} data-demo="focus" />],
                [s.error, <Field key="d" label={d.fieldLabel} error={d.fieldError} />],
                [s.disabled, <Field key="e" label={d.fieldLabel} disabled defaultValue="Walkman TPS-L2" />],
              ]}
            />
          </Demo>

          <Demo name="Nav">
            <p className={styles.note}>{d.signedOutNote}</p>
            <div className={styles.navFrame}>
              <Nav user={d.signedInUser} />
            </div>
          </Demo>
        </div>
      </section>
    </div>
  )
}

// One component's test bench: name, note, and the demo.
function Demo({ name, tone = 'putty', suffix, children }) {
  return (
    <article className={styles.demo} data-room={tone === 'graphite' ? 'dark' : undefined} data-tone={tone}>
      <header className={styles.demoHead}>
        <h3 className={styles.demoName}>
          <code>{name}</code>
          {suffix && <span className={styles.demoSuffix}>{suffix}</span>}
        </h3>
        {en.styleguide.notes[name] && !suffix && <p className={styles.note}>{en.styleguide.notes[name]}</p>}
      </header>
      {children}
    </article>
  )
}

function FaderCell({ caption, children }) {
  return (
    <div className={styles.stateCell}>
      <span className={styles.stateCaption}>{caption}</span>
      {children}
    </div>
  )
}

// A TransportKey in every state, side by side.
function KeyStates({ variant, icon, label }) {
  return (
    <StateGrid
      items={[
        [s.default, <TransportKey key="a" variant={variant} icon={icon}>{label}</TransportKey>],
        [s.hover, <TransportKey key="b" variant={variant} icon={icon} data-demo="hover">{label}</TransportKey>],
        [s.focus, <TransportKey key="c" variant={variant} icon={icon} data-demo="focus">{label}</TransportKey>],
        [s.active, <TransportKey key="d" variant={variant} icon={icon} data-demo="active">{label}</TransportKey>],
        [s.disabled, <TransportKey key="e" variant={variant} icon={icon} disabled>{label}</TransportKey>],
        [s.loading, <TransportKey key="f" variant={variant} icon={icon} loading loadingLabel={d.saving}>{label}</TransportKey>],
      ]}
    />
  )
}

function TypeSample({ kind }) {
  switch (kind) {
    case 'display':
      return <p className={styles.sDisplay}>{t.typeSample}</p>
    case 'room':
      return <p className={styles.sRoom}>{d.typeRoom}</p>
    case 'panel':
      return <p className={styles.sPanel}>{d.typePanel}</p>
    case 'card':
      return <p className={styles.sCard}>{d.typeCard}</p>
    case 'lead':
      return <p className={styles.sLead}>{d.typeLead}</p>
    case 'body':
      return <p className={styles.sBody}>{t.bodySample}</p>
    case 'label':
      return <p className={styles.sLabel}>{d.typeLabel}</p>
    case 'screen':
      return (
        <Screen label="Type sample screen">
          <ScreenLine>{d.typeScreen}</ScreenLine>
        </Screen>
      )
    default:
      return null
  }
}
