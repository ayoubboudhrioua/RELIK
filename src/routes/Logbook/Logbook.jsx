import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { Link, useParams } from 'react-router-dom'
import { SpecimenBay } from '../../components/SpecimenBay/SpecimenBay.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { Panel } from '../../components/Panel/Panel.jsx'
import { useToast } from '../../components/Toast/Toast.jsx'
import { useCollection } from '../../hooks/useCollection.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { getObject, getLogbook, objects, walkmanStory, periods, labPresets } from '../../data/objects.js'
import { creditFor } from '../../data/credits.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { LogbookSection } from './LogbookSection.jsx'
import styles from './Logbook.module.css'

const t = en.Logbook

// The Device Logbook: one object's documented identity, laid out like a
// service manual. Only the Walkman has a complete sample Logbook; other
// objects show what the seed data has.
export function Logbook() {
  const { id } = useParams()
  const object = getObject(id)
  usePageTitle(object ? `${object.name} · ${t.pageTitleSuffix}` : t.notFoundTitle)

  if (!object) return <LogbookNotFound />

  const Logbook = getLogbook(id)
  return Logbook ? <FullLogbook object={object} Logbook={Logbook} /> : <PartialLogbook object={object} />
}

// ---------- Title band, shared by both versions ----------
function TitleBand({ object }) {
  const { user } = useAuth()
  const { isSaved, saveObject, unsaveObject } = useCollection()
  const showToast = useToast()
  const saved = isSaved(object.id)
  const period = periods.find((p) => p.id === object.period)

  function toggleSave() {
    if (saved) {
      unsaveObject(object.id)
      showToast(t.removedToast)
    } else {
      saveObject(object.id)
      showToast(user ? t.savedToast : t.savedGuestToast)
    }
  }

  const saveKey = (
    <TransportKey variant="signal" icon="record" pressed={saved} onClick={toggleSave}>
      {saved ? (user ? t.saved : t.savedGuest) : t.save}
    </TransportKey>
  )

  return (
    <section className={styles.band} data-room="dark" aria-labelledby="page-title">
      <Backdrop />
      <div className={styles.bandInner}>
        <SpecimenBay object={object} tone="graphite" size="l" showStory={false} headingAs="p" priority className={styles.bay} data-parallax="" />
        <div className={styles.identity}>
          <Link to="/archive" className={styles.back}>
            {t.backToArchive}
          </Link>
          <DymoLabel>{object.accession}</DymoLabel>
          <h1 id="page-title" className={styles.name}>
            {object.name}
          </h1>
          <dl className={styles.readouts}>
            <div>
              <dt>{t.year}</dt>
              <dd>{object.yearLabel}</dd>
            </div>
            <div>
              <dt>{en.archive.period}</dt>
              <dd>{period?.label}</dd>
            </div>
            <div>
              <dt>{t.maker}</dt>
              <dd>{object.maker}</dd>
            </div>
            <div>
              <dt>{t.category}</dt>
              <dd>{object.category}</dd>
            </div>
          </dl>
          <div className={styles.saveWide}>{saveKey}</div>
        </div>
      </div>
      {/* Phones: the save key stays at the bottom of the screen. */}
      <div className={styles.saveBar}>{saveKey}</div>
    </section>
  )
}

// ---------- A figure with its caption and credit ----------
function Figure({ src, n, caption, wide = false }) {
  const credit = creditFor(src)
  return (
    <figure className={`${styles.figure} ${wide ? styles.figureWide : ''}`}>
      <div className={src.startsWith('photographs/') ? styles.photoPlate : styles.cutoutPlate}>
        <img src={`/images/${src}`} alt={en.objectAlt[src]} loading="lazy" decoding="async" />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.fig}>{format(t.fig, { n })}</span> {caption}
        {credit && (
          <span className={styles.credit}>
            {' '}
            {format(t.photoCredit, { author: credit.author, licence: credit.licence })}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

// ---------- Closing band: what next for this object ----------
function NextSteps({ object }) {
  const hasPreset = labPresets.some((p) => p.objectId === object.id)
  return (
    <section className={styles.next} data-room="dark" aria-labelledby="next-title">
      <div>
        <h2 id="next-title" className={styles.nextTitle}>
          {t.nextTitle}
        </h2>
        <p className={styles.nextText}>{hasPreset ? t.nextText : t.nextTextNoPreset}</p>
      </div>
      <TransportKey to={hasPreset ? `/lab?device=${object.id}` : '/lab'} variant="signal" icon="record">
        {t.openLab}
      </TransportKey>
    </section>
  )
}

// ---------- Contents list (desktop) ----------
function Contents({ sections }) {
  return (
    <nav className={styles.contents} aria-label={t.contents}>
      <p className={styles.contentsTitle}>{t.contents}</p>
      <ol>
        {sections.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Related({ number, items }) {
  return (
    <LogbookSection id="related" number={number} title={t.related}>
      <ul role="list" className={styles.related}>
        {items.map((item) => (
          <li key={item.id}>
            <SpecimenBay object={item} to={`/objects/${item.id}`} size="s" showStory={false} />
          </li>
        ))}
      </ul>
    </LogbookSection>
  )
}

// ---------- The complete Walkman Logbook ----------
function FullLogbook({ object, Logbook }) {
  const sample = Logbook.sample
  const sections = [
    ['specifications', t.specifications],
    ['context', t.context],
    ['uses', t.originalUses],
    ['condition', t.condition],
    ['preservation', t.preservation],
    ['repairs', t.repairLog],
    ['timeline', t.timeline],
    ['memory', t.memory],
    ['related', t.related],
  ]

  return (
    <div className={styles.page}>
      <TitleBand object={object} />
      <div className={styles.manual}>
        <Contents sections={sections} />
        <div className={styles.pages}>
          <LogbookSection id="specifications" number={1} title={t.specifications}>
            <div className={styles.split}>
              <dl className={styles.sheet} data-tick="">
                {Logbook.specifications.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <Figure src={object.altImage} n={1} caption={object.name} />
            </div>
          </LogbookSection>

          <LogbookSection id="context" number={2} title={t.context}>
            <ol role="list" className={styles.chapters}>
              {walkmanStory.slice(0, 3).map((chapter) => (
                <li key={chapter.chapter}>
                  <p className={styles.chapterMeta}>
                    <span>{chapter.phase}</span>
                    <span className={styles.rule} aria-hidden="true" />
                    <span>{chapter.years}</span>
                  </p>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                  <p className={styles.prose}>{chapter.text}</p>
                </li>
              ))}
            </ol>
          </LogbookSection>

          <LogbookSection id="uses" number={3} title={t.originalUses}>
            <dl className={styles.uses}>
              {Logbook.originalUses.map(([title, text]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </LogbookSection>

          <LogbookSection id="condition" number={4} title={t.condition} sample>
            <div className={styles.condition}>
              <p className={styles.conditionLevel}>
                <span className={styles.conditionLabel}>{t.conditionLevel}</span>
                <span className={styles.conditionWord}>{sample.condition.word}</span>
                <span className={styles.pips} aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} data-on={n <= sample.condition.level || undefined} />
                  ))}
                </span>
                <span className="visually-hidden">{sample.condition.level} / 5</span>
              </p>
              <dl className={styles.sheet}>
                {sample.condition.notes.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </LogbookSection>

          <LogbookSection id="preservation" number={5} title={t.preservation}>
            <div className={styles.split}>
              <dl className={styles.uses}>
                {Logbook.preservation.map(([title, text]) => (
                  <div key={title}>
                    <dt>{title}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <Figure src="photographs/walkman-teardown.webp" n={2} caption={walkmanStory[3].title} />
            </div>
          </LogbookSection>

          <LogbookSection id="repairs" number={6} title={t.repairLog} sample>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">{t.repairHeaders.date}</th>
                    <th scope="col">{t.repairHeaders.work}</th>
                    <th scope="col">{t.repairHeaders.by}</th>
                  </tr>
                </thead>
                <tbody>
                  {sample.repairLog.map(([date, work, by]) => (
                    <tr key={date}>
                      <td className={styles.mono}>{date}</td>
                      <td>{work}</td>
                      <td>{by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LogbookSection>

          <LogbookSection id="timeline" number={7} title={t.timeline}>
            <div className={styles.timelines}>
              <Timeline title={t.modelTimeline} entries={Logbook.modelTimeline} />
              <Timeline title={t.objectTimeline} entries={sample.objectTimeline} sample />
            </div>
          </LogbookSection>

          <LogbookSection id="memory" number={8} title={t.memory} sample>
            <blockquote className={styles.memory}>
              <p>{sample.memory}</p>
            </blockquote>
          </LogbookSection>

          <Related number={9} items={Logbook.related} />
          <NextSteps object={object} />
        </div>
      </div>
    </div>
  )
}

function Timeline({ title, entries, sample = false }) {
  return (
    <div className={styles.timeline}>
      <h3 className={styles.timelineTitle}>
        {title}
        {sample && <DymoLabel tone="signal">{en.common.sample}</DymoLabel>}
      </h3>
      <ol role="list">
        {entries.map(([year, text]) => (
          <li key={year + text}>
            <span className={styles.year}>{year}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ---------- Objects without a full Logbook ----------
function PartialLogbook({ object }) {
  const related = objects.filter((o) => o.category === object.category && o.id !== object.id).slice(0, 4)
  const sections = [
    ['story', t.story],
    ['specifications', t.specifications],
    ['condition', t.condition],
    ...(related.length ? [['related', t.related]] : []),
  ]

  return (
    <div className={styles.page}>
      <TitleBand object={object} />
      <div className={styles.manual}>
        <Contents sections={sections} />
        <div className={styles.pages}>
          <p className={styles.note}>{t.partialNote}</p>

          <LogbookSection id="story" number={1} title={t.story}>
            <p className={styles.lead}>{object.story}</p>
          </LogbookSection>

          <LogbookSection id="specifications" number={2} title={t.specifications}>
            <dl className={styles.sheet} data-tick="">
              <div>
                <dt>{t.accession}</dt>
                <dd>{object.accession}</dd>
              </div>
              <div>
                <dt>{t.maker}</dt>
                <dd>{object.maker}</dd>
              </div>
              <div>
                <dt>{t.year}</dt>
                <dd>{object.yearLabel}</dd>
              </div>
              <div>
                <dt>{t.category}</dt>
                <dd>{object.category}</dd>
              </div>
            </dl>
          </LogbookSection>

          <LogbookSection id="condition" number={3} title={t.condition} sample>
            <p className={styles.lead}>{object.sampleCondition}</p>
          </LogbookSection>

          {related.length > 0 && <Related number={4} items={related} />}
          <NextSteps object={object} />
        </div>
      </div>
    </div>
  )
}

function LogbookNotFound() {
  return (
    <div className={styles.notFound}>
      <Panel title={t.notFoundTitle} titleAs="h1" titleId="page-title">
        <p className={styles.lead}>{t.notFoundText}</p>
        <TransportKey to="/archive" variant="signal" icon="search" className={styles.notFoundKey}>
          {t.backToArchive}
        </TransportKey>
      </Panel>
    </div>
  )
}
