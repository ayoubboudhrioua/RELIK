import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field } from '../../components/Field/Field.jsx'
import { ErrorSummary } from '../../components/ErrorSummary/ErrorSummary.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useForm } from '../../hooks/useForm.js'
import { validateReset } from '../../services/validation.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { AuthLayout } from './AuthLayout.jsx'
import styles from './Auth.module.css'

const t = en.auth
const ids = { email: 'reset-email' }

// Forgotten password. The simulation never sends an email and never says
// whether the address has an account; it shows the "check your inbox" step.
export function ResetPassword() {
  const { requestPasswordReset } = useAuth()
  const [sentTo, setSentTo] = useState(null)

  const form = useForm({
    initial: { email: '' },
    validate: validateReset,
    messages: t.errors,
    async onSubmit(values) {
      const result = await requestPasswordReset(values)
      setSentTo(result.email)
    },
  })

  return (
    <AuthLayout
      title={sentTo ? t.reset.sentTitle : t.reset.title}
      prompt={t.reset.prompt}
      footer={
        sentTo ? null : (
          <p>
            <Link to="/signin">{t.reset.back}</Link>
          </p>
        )
      }
    >
      {sentTo ? (
        <div className={styles.sent} role="status">
          <p>{format(t.reset.sentText, { email: sentTo })}</p>
          <TransportKey to="/signin" variant="signal" icon="rewind">
            {t.reset.back}
          </TransportKey>
        </div>
      ) : (
        <form className={styles.form} onSubmit={form.submit} noValidate>
          <p className={styles.note}>{t.reset.text}</p>
          <ErrorSummary ref={form.summaryRef} title={t.errors.summary} errors={form.summary(ids)} />
          <Field id={ids.email} label={t.fields.email} type="email" autoComplete="email" {...form.fieldProps('email')} />
          <div className={styles.actions}>
            <TransportKey type="submit" variant="signal" icon="play" loading={form.submitting} loadingLabel={t.working}>
              {t.reset.submit}
            </TransportKey>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
