import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Field } from '../../components/Field/Field.jsx'
import { ErrorSummary } from '../../components/ErrorSummary/ErrorSummary.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { useToast } from '../../components/Toast/Toast.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useForm } from '../../hooks/useForm.js'
import { validateSignIn } from '../../services/validation.js'
import { DEMO_ACCOUNT } from '../../services/auth.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { AuthLayout } from './AuthLayout.jsx'
import styles from './Auth.module.css'

const t = en.auth
const ids = { email: 'signin-email', password: 'signin-password' }

// Only same-site paths are accepted as "next" (no redirect to other sites).
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/collection'
}

export function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const showToast = useToast()

  const form = useForm({
    initial: { email: '', password: '' },
    validate: validateSignIn,
    messages: t.errors,
    async onSubmit(values) {
      const session = await signIn(values)
      showToast(format(t.signedInToast, { name: session.name }))
      navigate(safeNext(params.get('next')))
    },
  })

  function signInWithDemo() {
    const demo = { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password }
    form.setValues(demo)
    form.submit(null, demo)
  }

  return (
    <AuthLayout
      title={t.signIn.title}
      prompt={t.signIn.prompt}
      footer={
        <p>
          {t.signIn.noAccount} <Link to="/register">{t.signIn.register}</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={form.submit} noValidate>
        <ErrorSummary ref={form.summaryRef} title={t.errors.summary} errors={form.summary(ids)} />
        <Field id={ids.email} label={t.fields.email} type="email" autoComplete="email" {...form.fieldProps('email')} />
        <Field
          id={ids.password}
          label={t.fields.password}
          type="password"
          autoComplete="current-password"
          {...form.fieldProps('password')}
        />
        <div className={styles.actions}>
          <TransportKey type="submit" variant="signal" icon="play" loading={form.submitting} loadingLabel={t.working}>
            {t.signIn.submit}
          </TransportKey>
          <Link to="/reset" className={styles.link}>
            {t.signIn.forgot}
          </Link>
        </div>
      </form>

      <div className={styles.demo}>
        <TransportKey icon="eject" onClick={signInWithDemo} disabled={form.submitting}>
          {t.signIn.demo}
        </TransportKey>
        <p className={styles.demoHint}>{t.signIn.demoHint}</p>
      </div>
    </AuthLayout>
  )
}
