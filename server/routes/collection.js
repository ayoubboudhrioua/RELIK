// /api/collection: the signed-in visitor's own objects ("My collection").
// Every route needs a signed-in user.
import { Router } from 'express'
import { validateItem, hasErrors } from '../../src/services/validation.js'
import { getObject } from '../seed.js'
import { DEMO_ACCOUNT } from '../demo.js'
import { itemFromObject, newItem, editItem, sampleItems } from '../items.js'
import { requireUser } from './auth.js'
import { sendError } from '../http.js'

export function collectionRouter(db) {
  const router = Router()
  router.use(requireUser(db))

  // The list for this user. The demo account gets the sample collection the first time.
  function itemsOf(email) {
    if (!db.data.collections[email]) {
      db.data.collections[email] = email === DEMO_ACCOUNT.email ? sampleItems() : []
      db.save()
    }
    return db.data.collections[email]
  }

  function setItems(email, items) {
    db.data.collections[email] = items
    db.save()
  }

  // GET /api/collection
  router.get('/', (req, res) => {
    res.json(itemsOf(req.user.email))
  })

  // POST /api/collection
  // - { objectId } alone: save an archive object (saving twice keeps one copy)
  // - { name, maker, year, category, status, condition, story }: add a device by hand
  router.post('/', (req, res) => {
    const body = req.body ?? {}
    const email = req.user.email
    const items = itemsOf(email)

    if (body.objectId && !body.name) {
      const object = getObject(body.objectId)
      if (!object) return sendError(res, 404, 'unknownObject')
      const existing = items.find((item) => item.objectId === object.id)
      if (existing) return res.json(existing)
      const item = itemFromObject(object)
      setItems(email, [item, ...items])
      return res.status(201).json(item)
    }

    const fields = validateItem({ name: body.name, year: body.year ?? '', status: body.status })
    if (hasErrors(fields)) return sendError(res, 400, 'invalid', fields)
    const item = newItem(body)
    setItems(email, [item, ...items])
    res.status(201).json(item)
  })

  // PATCH /api/collection/:id  { any editable fields }
  router.patch('/:id', (req, res) => {
    const email = req.user.email
    const items = itemsOf(email)
    const current = items.find((item) => item.id === req.params.id)
    if (!current) return sendError(res, 404, 'notFound')

    const merged = { ...current, ...(req.body ?? {}) }
    const fields = validateItem({ name: merged.name, year: merged.year ?? '', status: merged.status })
    if (hasErrors(fields)) return sendError(res, 400, 'invalid', fields)

    const updated = editItem(current, req.body ?? {})
    setItems(email, items.map((item) => (item.id === current.id ? updated : item)))
    res.json(updated)
  })

  // DELETE /api/collection/:id
  router.delete('/:id', (req, res) => {
    const email = req.user.email
    const items = itemsOf(email)
    if (!items.some((item) => item.id === req.params.id)) return sendError(res, 404, 'notFound')
    setItems(email, items.filter((item) => item.id !== req.params.id))
    res.status(204).end()
  })

  // DELETE /api/collection/objects/:objectId  (the "Saved" button pressed again)
  router.delete('/objects/:objectId', (req, res) => {
    const email = req.user.email
    setItems(email, itemsOf(email).filter((item) => item.objectId !== req.params.objectId))
    res.status(204).end()
  })

  return router
}
