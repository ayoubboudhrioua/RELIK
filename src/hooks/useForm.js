import { useRef, useState } from 'react'
import { hasErrors } from '../services/validation.js'

// A small form helper shared by the sign-in, register, reset and collection forms.
// - initial: starting values, e.g. { email: '', password: '' }
// - validate(values): returns { field: 'errorKey' } (see services/validation.js)
// - onSubmit(values): async; may throw an error with `fields` and/or `code`
// - messages: maps error keys to sentences (e.g. en.auth.errors)
//
// Errors appear for a field after it loses focus (blur), and for every field
// after a failed submit, when focus also moves to the error summary.
export function useForm({ initial, validate, onSubmit, messages }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const summaryRef = useRef(null)

  function change(name, value) {
    const next = { ...values, [name]: value }
    setValues(next)
    // Once a field has shown an error, re-check it as the visitor types.
    if (touched[name]) setErrors(validate(next))
  }

  function blur(name) {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  async function submit(event, override) {
    event?.preventDefault()
    const data = override ?? values
    const found = validate(data)
    setTouched(Object.fromEntries(Object.keys(data).map((key) => [key, true])))
    setErrors(found)
    setFormError('')
    if (hasErrors(found)) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      if (error.fields && hasErrors(error.fields)) setErrors(error.fields)
      if (error.code && messages[error.code]) setFormError(messages[error.code])
      requestAnimationFrame(() => summaryRef.current?.focus())
    } finally {
      setSubmitting(false)
    }
  }

  // The message shown under a field (only once the field was touched).
  function errorFor(name) {
    return touched[name] && errors[name] ? messages[errors[name]] : undefined
  }

  // Items for <ErrorSummary>: one per invalid field, plus a form-wide error.
  function summary(ids) {
    const items = Object.keys(errors)
      .filter((name) => touched[name] && messages[errors[name]])
      .map((name) => ({ id: ids[name], message: messages[errors[name]] }))
    if (formError) items.unshift({ id: ids[Object.keys(ids)[0]], message: formError })
    return items
  }

  // Spread on a <Field>: value, onChange, onBlur and the error.
  function fieldProps(name) {
    return {
      name,
      value: values[name] ?? '',
      onChange: (event) => change(name, event.target.value),
      onBlur: () => blur(name),
      error: errorFor(name),
    }
  }

  return { values, setValues, submit, submitting, summary, summaryRef, fieldProps, formError }
}
