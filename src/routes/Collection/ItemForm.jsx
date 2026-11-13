import { Field } from '../../components/Field/Field.jsx'
import { Select } from '../../components/Select/Select.jsx'
import { Switch } from '../../components/Switch/Switch.jsx'
import { ErrorSummary } from '../../components/ErrorSummary/ErrorSummary.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { useForm } from '../../hooks/useForm.js'
import { validateItem } from '../../services/validation.js'
import { STATUSES } from '../../services/collection.js'
import { categories } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Collection.module.css'

const t = en.collection
const ids = {
  name: 'item-name',
  maker: 'item-maker',
  year: 'item-year',
  status: 'item-status',
  condition: 'item-condition',
  story: 'item-story',
}

// The Logbook form, used both to add a device and to edit one.
// - item: the item to edit, or null to add a new one
// - onSave(values): called with valid values; async, may throw an ApiError
export function ItemForm({ item, onSave, onCancel }) {
  const form = useForm({
    initial: {
      name: item?.name ?? '',
      maker: item?.maker ?? '',
      year: item?.year ? String(item.year) : '',
      category: item?.category ?? 'Other electronics',
      status: item?.status ?? 'Stored',
      condition: item?.condition ?? '',
      story: item?.story ?? '',
    },
    validate: validateItem,
    messages: t.errors,
    async onSubmit(values) {
      await onSave(values)
    },
  })

  return (
    <form className={styles.form} onSubmit={form.submit} noValidate>
      <ErrorSummary ref={form.summaryRef} title={t.errors.summary} errors={form.summary(ids)} />

      <Field id={ids.name} label={t.fields.name} hint={t.fields.nameHint} required {...form.fieldProps('name')} />

      <div className={styles.formRow}>
        <Field id={ids.maker} label={t.fields.maker} {...form.fieldProps('maker')} />
        <Field
          id={ids.year}
          label={t.fields.year}
          hint={t.fields.yearHint}
          inputMode="numeric"
          maxLength={4}
          {...form.fieldProps('year')}
        />
      </div>

      <Select
        label={t.fields.category}
        options={categories.map((c) => ({ id: c, label: c }))}
        value={form.values.category}
        onChange={(value) => form.setValues({ ...form.values, category: value })}
      />

      <fieldset className={styles.statusGroup} id={ids.status}>
        <legend className={styles.legend}>{t.fields.status}</legend>
        <div className={styles.statusSwitches}>
          {STATUSES.map((status) => (
            <Switch
              key={status}
              type="radio"
              name="item-status"
              label={status}
              checked={form.values.status === status}
              onChange={() => form.setValues({ ...form.values, status })}
            />
          ))}
        </div>
      </fieldset>

      <Field id={ids.condition} label={t.fields.condition} hint={t.fields.conditionHint} {...form.fieldProps('condition')} />
      <Field
        id={ids.story}
        as="textarea"
        label={t.fields.story}
        hint={t.fields.storyHint}
        rows={4}
        {...form.fieldProps('story')}
      />

      <div className={styles.formActions}>
        <TransportKey type="submit" variant="signal" icon="record">
          {item ? t.saveEdit : t.saveNew}
        </TransportKey>
        <button type="button" className={styles.textButton} onClick={onCancel}>
          {en.common.cancel}
        </button>
      </div>
    </form>
  )
}
