import { forwardRef } from 'react'
import { Icon } from '../Icon/Icon.jsx'
import styles from './ErrorSummary.module.css'

// The box shown at the top of a form after a failed submit.
// It lists every problem as a link to its field. The page moves focus here
// (pass a ref) so keyboard and screen-reader users land on it.
// - title: e.g. "There is a problem"
// - errors: [{ id: 'field-id', message: 'Enter your email address.' }]
export const ErrorSummary = forwardRef(function ErrorSummary({ title, errors }, ref) {
  if (!errors.length) return null
  return (
    <div ref={ref} className={styles.summary} tabIndex={-1} role="alert">
      <h2 className={styles.title}>
        <Icon name="alert" size={20} />
        {title}
      </h2>
      <ul className={styles.list}>
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  )
})
