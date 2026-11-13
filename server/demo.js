// The ready-made account visitors can try straight away.
// Same values as DEMO_ACCOUNT in src/services/auth.js.
import { hashPassword } from './passwords.js'

export const DEMO_ACCOUNT = {
  name: 'Demo visitor',
  email: 'demo@relik.example',
  password: 'relik-demo',
}

// Creates the demo account if the database does not have it yet.
export function ensureDemoAccount(db) {
  if (db.data.users[DEMO_ACCOUNT.email]) return
  db.data.users[DEMO_ACCOUNT.email] = {
    name: DEMO_ACCOUNT.name,
    email: DEMO_ACCOUNT.email,
    passwordHash: hashPassword(DEMO_ACCOUNT.password),
  }
  db.save()
}
