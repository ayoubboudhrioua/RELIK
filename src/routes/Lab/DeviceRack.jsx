import { labPresets } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Lab.module.css'

// Step A: the device rack. Each device is a real radio button dressed as a
// rack unit with a small photo, its name and its sample condition.
export function DeviceRack({ deviceId, onChange }) {
  return (
    <fieldset className={styles.rack}>
      <legend className="visually-hidden">{en.lab.steps.device}</legend>
      {labPresets.map((preset) => (
        <label key={preset.objectId} className={styles.unit}>
          <input
            type="radio"
            name="lab-device"
            className={styles.unitInput}
            value={preset.objectId}
            checked={deviceId === preset.objectId}
            onChange={() => onChange(preset.objectId)}
          />
          <span className={styles.unitLed} aria-hidden="true" />
          <span className={styles.unitThumb} aria-hidden="true">
            <img src={`/images/${preset.object.image}`} alt="" loading="lazy" />
          </span>
          <span className={styles.unitText}>
            <span className={styles.unitName}>{preset.object.name}</span>
            <span className={styles.unitNote}>
              {en.lab.presetNote}: {preset.note}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
