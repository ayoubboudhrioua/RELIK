import { Link, useNavigate } from 'react-router-dom'
import { Field } from '../../components/Field/Field.jsx'
import { ErrorSummary } from '../../components/ErrorSummary/ErrorSummary.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { useToast } from '../../components/Toast/Toast.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useForm } from '../../hooks/useForm.js'
import { validateRegister } from '../../services/validation.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { AuthLayout } from './AuthLayout.jsx'
import styles from './Auth.module.css'

const t = en.auth
const ids = { name: 'register-name', email: 'register-email', password: 'register-password' }

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const form = useForm({
    initial: { name: '', email: '', password: '' },
    validate: validateRegister,
    messages: t.errors,
    async onSubmit(values) {
      const session = await register(values)
      showToast(format(t.registeredToast, { name: session.name }))
      navigate('/collection')
    },
  })

  return (
    <AuthLayout
      title={t.register.title}
      prompt={t.register.prompt}
      footer={
        <p>
          {t.register.haveAccount} <Link to="/signin">{t.register.signIn}</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={form.submit} noValidate>
        <ErrorSummary ref={form.summaryRef} title={t.errors.summary} errors={form.summary(ids)} />
        <Field id={ids.name} label={t.fields.name} autoComplete="name" {...form.fieldProps('name')} />
        <Field id={ids.email} label={t.fields.email} type="email" autoComplete="email" {...form.fieldProps('email')} />
        <Field
          id={ids.password}
          label={t.fields.password}
          hint={t.fields.passwordHint}
          type="password"
          autoComplete="new-password"
          {...form.fieldProps('password')}
        />
        <div className={styles.actions}>
          <TransportKey type="submit" variant="signal" icon="record" loading={form.submitting} loadingLabel={t.working}>
            {t.register.submit}
          </TransportKey>
        </div>
      </form>
    </AuthLayout>
  )
}
