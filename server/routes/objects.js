// /api/objects: the archive, read-only.
// Uses the same search function as the Archive page (src/data/archiveQuery.js).
import { Router } from 'express'
import { filterObjects, SORTS } from '../../src/data/archiveQuery.js'
import { objects, categories, periodIds, getObject } from '../seed.js'
import { sendError } from '../http.js'

export function objectsRouter() {
  const router = Router()

  // GET /api/objects?q=sony&cat=Audio&cat=Photography&period=80s&sort=name
  router.get('/', (req, res) => {
    const cats = [req.query.cat ?? []].flat()
    const settings = {
      q: typeof req.query.q === 'string' ? req.query.q : '',
      categories: cats.filter((c) => categories.includes(c)),
      period: periodIds.includes(req.query.period) ? req.query.period : '',
      sort: SORTS.includes(req.query.sort) ? req.query.sort : 'year-asc',
    }
    res.json(filterObjects(objects, settings))
  })

  // GET /api/objects/:id
  router.get('/:id', (req, res) => {
    const object = getObject(req.params.id)
    if (!object) return sendError(res, 404, 'notFound')
    res.json(object)
  })

  return router
}
