// Form validation shared by the auth pages and the collection form.
// Each function returns an object of errors: { fieldName: 'errorKey' }.
// The keys match en.auth.errors / en.collection.errors so the page can show
// the right sentence. An empty object means the form is valid.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim())
}

function checkEmail(email, errors) {
  if (!email || !email.trim()) errors.email = 'emailRequired'
  else if (!isEmail(email)) errors.email = 'emailInvalid'
}

export function validateSignIn({ email, password }) {
  const errors = {}
  checkEmail(email, errors)
  if (!password) errors.password = 'passwordRequired'
  return errors
}

export function validateRegister({ name, email, password }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = 'nameRequired'
  checkEmail(email, errors)
  if (!password) errors.password = 'passwordRequired'
  else if (password.length < 8) errors.password = 'passwordShort'
  return errors
}

export function validateReset({ email }) {
  const errors = {}
  checkEmail(email, errors)
  return errors
}

const CURRENT_YEAR = new Date().getFullYear()

export function validateItem({ name, year, status }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = 'nameRequired'
  if (year !== '' && year !== undefined && year !== null) {
    const n = Number(year)
    if (!Number.isInteger(n) || n < 1850 || n > CURRENT_YEAR) errors.year = 'yearInvalid'
  }
  if (!status) errors.status = 'statusRequired'
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
