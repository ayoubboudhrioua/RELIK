import { Dialog } from '../../components/Dialog/Dialog.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { useCollection } from '../../hooks/useCollection.jsx'
import { useToast } from '../../components/Toast/Toast.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { en } from '../../content/en.js'
import styles from './QuickLook.module.css'

const t = en.archive

// A quick look at one object without leaving the Archive:
// the photo, the facts on file, the sample condition, and two actions.
export function QuickLook({ object, onClose }) {
  const { user } = useAuth()
  const { isSaved, saveObject, unsaveObject } = useCollection()
  const showToast = useToast()
  if (!object) return <Dialog open={false} onClose={onClose} title="" />

  const saved = isSaved(object.id)

  async function toggleSave() {
    try {
      if (saved) {
        await unsaveObject(object.id)
        showToast(en.Logbook.removedToast)
      } else {
        await saveObject(object.id)
        showToast(user ? en.Logbook.savedToast : en.Logbook.savedGuestToast)
      }
    } catch {
      showToast(en.collection.actionFailed)
    }
  }

  return (
    <Dialog open onClose={onClose} title={object.name} size="lg">
      <div className={styles.layout}>
        <div className={styles.well}>
          <img src={`/images/${object.image}`} alt={object.alt} className={styles.photo} />
        </div>
        <div className={styles.facts}>
          <DymoLabel>{object.accession}</DymoLabel>
          <dl className={styles.sheet}>
            <div>
              <dt>{en.Logbook.year}</dt>
              <dd>{object.yearLabel}</dd>
            </div>
            <div>
              <dt>{t.makerLabel}</dt>
              <dd>{object.maker}</dd>
            </div>
            <div>
              <dt>{en.Logbook.category}</dt>
              <dd>{object.category}</dd>
            </div>
            <div>
              <dt>
                {t.conditionLabel} <DymoLabel tone="signal">{en.common.sample}</DymoLabel>
              </dt>
              <dd>{object.sampleCondition}</dd>
            </div>
          </dl>
          <p className={styles.story}>{object.story}</p>
          <div className={styles.actions}>
            <TransportKey to={`/objects/${object.id}`} variant="signal" icon="play">
              {t.openLogbook}
            </TransportKey>
            <TransportKey icon="record" pressed={saved} onClick={toggleSave}>
              {saved ? (user ? en.Logbook.saved : en.Logbook.savedGuest) : en.Logbook.save}
            </TransportKey>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
