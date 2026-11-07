import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Panel } from '../../components/Panel/Panel.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { Switch } from '../../components/Switch/Switch.jsx'
import { Field } from '../../components/Field/Field.jsx'
import { Dialog } from '../../components/Dialog/Dialog.jsx'
import { useToast } from '../../components/Toast/Toast.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCollection } from '../../hooks/useCollection.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { STATUSES } from '../../services/collection.js'
import { normalise } from '../../data/archiveQuery.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { ItemForm } from './ItemForm.jsx'
import styles from './Collection.module.css'

const t = en.collection
// J-card styles cycle by position; colour carries no meaning.
const SPINE_STYLES = ['graphite', 'paper', 'deep']

export function Collection() {
  usePageTitle(t.pageTitle)
  const { user } = useAuth()
  return user ? <Rack /> : <Gate />
}

// Signed out: a short explanation and the way in.
function Gate() {
  return (
    <div className={styles.page}>
      <div className={styles.gate}>
        <Panel title={t.gateTitle} titleAs="h1" titleId="page-title">
          <p className={styles.lead}>{t.gateText}</p>
          <div className={styles.keys}>
            <TransportKey to="/signin?next=/collection" variant="signal" icon="play">
              {t.gateCta}
            </TransportKey>
            <TransportKey to="/register" icon="record">
              {t.gateRegister}
            </TransportKey>
          </div>
        </Panel>
      </div>
    </div>
  )
}

// Signed in: overview, timeline, filters and the rack of spines.
function Rack() {
  const { items, addItem, updateItem, removeItem, canStore } = useCollection()
  const showToast = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, 'new' or an item
  const [removing, setRemoving] = useState(null)
  const rackHeading = useRef(null)

  const shown = useMemo(
    () =>
      items.filter(
        (item) =>
          (!status || item.status === status) &&
          (!query || normalise(`${item.name} ${item.maker} ${item.story} ${item.year ?? ''}`).includes(normalise(query))),
      ),
    [items, query, status],
  )

  const dated = [...items].filter((item) => item.year).sort((a, b) => a.year - b.year)

  function save(values) {
    if (editing === 'new') {
      addItem(values)
      showToast(t.added)
    } else {
      updateItem(editing.id, values)
      showToast(t.updated)
    }
    setEditing(null)
  }

  function confirmRemove() {
    removeItem(removing.id)
    showToast(t.removed)
    setRemoving(null)
    // Keyboard users continue from the rack heading, not the top of the page.
    requestAnimationFrame(() => rackHeading.current?.focus())
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lead}>{t.intro}</p>
        </div>
        <TransportKey variant="signal" icon="record" onClick={() => setEditing('new')}>
          {t.add}
        </TransportKey>
      </header>

      {!canStore && (
        <p className={styles.warning} role="note">
          {t.noStorage}
        </p>
      )}

      {items.length === 0 ? (
        <section className={styles.empty} aria-labelledby="empty-title">
          <h2 id="empty-title" className={styles.emptyTitle}>
            {t.emptyTitle}
          </h2>
          <p className={styles.lead}>{t.emptyText}</p>
          <div className={styles.keys}>
            <TransportKey to="/archive" icon="search">
              {t.emptyArchive}
            </TransportKey>
            <TransportKey variant="signal" icon="record" onClick={() => setEditing('new')}>
              {t.add}
            </TransportKey>
          </div>
        </section>
      ) : (
        <>
          {/* Overview: one counter per status */}
          <section className={styles.overview} aria-labelledby="overview-title" data-room="dark">
            <h2 id="overview-title" className="visually-hidden">
              {t.overview}
            </h2>
            <ul role="list" className={styles.counters}>
              <li>
                <TapeCounter value={items.length} digits={3} label={t.total} />
              </li>
              {STATUSES.map((s) => (
                <li key={s}>
                  <TapeCounter value={items.filter((item) => item.status === s).length} digits={3} label={s} />
                </li>
              ))}
            </ul>
          </section>

          {/* Timeline of owned objects by year */}
          <section className={styles.timelineRoom} aria-labelledby="timeline-title">
            <h2 id="timeline-title" className={styles.sectionTitle}>
              {t.timeline}
            </h2>
            {dated.length ? (
              <ol className={styles.timeline}>
                {dated.map((item) => (
                  <li key={item.id}>
                    <span className={styles.timelineYear}>{item.year}</span>
                    <span className={styles.timelineName}>{item.name}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.muted}>{t.timelineEmpty}</p>
            )}
          </section>

          {/* Search and status filter */}
          <section className={styles.rackRoom} aria-labelledby="rack-title">
            <h2 id="rack-title" className={styles.sectionTitle} tabIndex={-1} ref={rackHeading}>
              {t.rackLabel}
            </h2>
            <div className={styles.filters}>
              <Field
                id="collection-search"
                type="search"
                label={t.search}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={styles.search}
              />
              <fieldset className={styles.statusFilter}>
                <legend className={styles.legend}>{t.statusFilter}</legend>
                <div className={styles.statusSwitches}>
                  <Switch type="radio" name="status-filter" label={t.allStatuses} checked={!status} onChange={() => setStatus('')} />
                  {STATUSES.map((s) => (
                    <Switch key={s} type="radio" name="status-filter" label={s} checked={status === s} onChange={() => setStatus(s)} />
                  ))}
                </div>
              </fieldset>
            </div>

            <p className="visually-hidden" role="status" aria-live="polite">
              {shown.length} / {items.length}
            </p>

            {shown.length === 0 ? (
              <div className={styles.noMatch}>
                <p>{t.noMatch}</p>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => {
                    setQuery('')
                    setStatus('')
                  }}
                >
                  {t.clearSearch}
                </button>
              </div>
            ) : (
              <ul role="list" className={styles.spines} data-stagger="">
                {shown.map((item, index) => (
                  <li key={item.id} className={styles.spine} data-style={SPINE_STYLES[index % SPINE_STYLES.length]}>
                    <span className={styles.band} aria-hidden="true" />
                    <div className={styles.spineMain}>
                      <h3 className={styles.spineName}>{item.name}</h3>
                      <p className={styles.spineMeta}>
                        {[item.maker, item.year, item.category].filter(Boolean).join(', ')}
                      </p>
                      {(item.condition || item.story) && (
                        <p className={styles.spineNotes}>
                          {item.isSample && <DymoLabel tone="signal">{en.common.sample}</DymoLabel>}{' '}
                          {[item.condition, item.story].filter(Boolean).join('. ')}
                        </p>
                      )}
                    </div>
                    <p className={styles.spineStatus}>{item.status}</p>
                    <div className={styles.spineActions}>
                      {item.objectId && (
                        <Link
                          to={`/objects/${item.objectId}`}
                          className={styles.spineLink}
                          aria-label={`${t.openLogbook}: ${item.name}`}
                        >
                          {t.openLogbook}
                        </Link>
                      )}
                      <button
                        type="button"
                        className={styles.spineButton}
                        onClick={() => setEditing(item)}
                        aria-label={`${t.edit}: ${item.name}`}
                      >
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        className={`${styles.spineButton} ${styles.spineQuiet}`}
                        onClick={() => setRemoving(item)}
                        aria-label={`${t.remove}: ${item.name}`}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' || !editing ? t.addTitle : format(t.editTitle, { name: editing.name })}
      >
        {editing !== null && (
          <ItemForm
            key={editing === 'new' ? 'new' : editing.id}
            item={editing === 'new' ? null : editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Dialog>

      <Dialog open={removing !== null} onClose={() => setRemoving(null)} title={t.removeTitle}>
        {removing && (
          <div className={styles.confirm}>
            <p>{format(t.removeConfirm, { name: removing.name })}</p>
            <div className={styles.formActions}>
              <TransportKey variant="signal" icon="eject" onClick={confirmRemove}>
                {t.removeConfirmYes}
              </TransportKey>
              <button type="button" className={styles.textButton} onClick={() => setRemoving(null)} autoFocus>
                {en.common.cancel}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
