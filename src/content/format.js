// Picks the singular or plural form for a count, then fills {count}.
// countText({ one: '{count} object found', other: '{count} objects found' }, 1)
// → '1 object found'. Intl.PluralRules knows the rules of each language,
// so a French file only needs its own forms.
const rules = new Intl.PluralRules('en')

export function countText(forms, count, values = {}) {
  const form = forms[rules.select(count)] ?? forms.other
  return format(form, { count, ...values })
}

// Fills {placeholders} in a copy string.
// format('Show {count} objects', { count: 3 }) → 'Show 3 objects'
export function format(text, values = {}) {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match))
}
