import { Switch } from '../../components/Switch/Switch.jsx'
import { Select } from '../../components/Select/Select.jsx'
import { categories, periods } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './FilterBank.module.css'

const t = en.archive

// The bank of hardware switches: categories (checkboxes with live counts),
// period (radio switches) and sort (a select). Used inline on wide screens
// and inside the bottom sheet on phones.
// - settings: { q, categories, period, sort }
// - counts: { [category]: number }
// - onChange(partialSettings)
// - idPrefix: keeps ids unique when the bank appears twice
export function FilterBank({ settings, counts, onChange, idPrefix = 'bank' }) {
  function toggleCategory(category) {
    const next = settings.categories.includes(category)
      ? settings.categories.filter((c) => c !== category)
      : [...settings.categories, category]
    onChange({ categories: next })
  }

  return (
    <div className={styles.bank}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{t.categories}</legend>
        <div className={styles.switches}>
          {categories.map((category) => (
            <Switch
              key={category}
              label={category}
              count={counts[category]}
              checked={settings.categories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{t.period}</legend>
        <div className={styles.switches}>
          <Switch
            type="radio"
            name={`${idPrefix}-period`}
            label={t.allPeriods}
            checked={!settings.period}
            onChange={() => onChange({ period: '' })}
          />
          {periods.map((period) => (
            <Switch
              key={period.id}
              type="radio"
              name={`${idPrefix}-period`}
              label={period.label}
              checked={settings.period === period.id}
              onChange={() => onChange({ period: period.id })}
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.sort}>
        <Select
          id={`${idPrefix}-sort`}
          label={t.sort}
          options={t.sortOptions}
          value={settings.sort}
          onChange={(sort) => onChange({ sort })}
        />
      </div>
    </div>
  )
}
