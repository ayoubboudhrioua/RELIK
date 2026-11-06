// The Decision Lab model: pure functions, no React, no storage.
// It scores six possible futures for an old device from four inputs.
// These are SAMPLE ASSUMPTIONS for teaching, not advice. The rules are fixed
// in CLAUDE.md ("Decision Lab model") and checked by model.test.js.
//
// Inputs are on a 1–5 scale:
//   f  does it work?        R  repairability
//   U  usefulness today     C  cultural interest

export const FUTURES = ['repair', 'reuse', 'donate', 'preserve', 'parts', 'recycle']

// Multipliers for each priority. Futures not listed keep ×1.
export const PRIORITIES = {
  balanced: {},
  working: { repair: 1.2, reuse: 1.25, donate: 1.15 },
  history: { repair: 1.05, donate: 1.1, preserve: 1.3 },
  materials: { parts: 1.35, recycle: 1.3 },
}

// 1 → 0, 3 → 0.5, 5 → 1
export function normalise(value) {
  return (value - 1) / 4
}

// Returns { repair, reuse, donate, preserve, parts, recycle }, each between 0 and 1.
export function scoreFutures(inputs, priority = 'balanced') {
  const f = normalise(inputs.f)
  const R = normalise(inputs.R)
  const U = normalise(inputs.U)
  const C = normalise(inputs.C)

  const raw = {
    repair: f < 1 ? 0.45 * R + 0.35 * (1 - f) + 0.2 * Math.max(U, C) : 0.15 * R,
    reuse: 0.55 * f + 0.45 * U,
    donate: 0.3 * f + 0.2 * U + 0.2 * R + 0.3 * C,
    preserve: 0.65 * C + 0.2 * (1 - U) + 0.15 * f,
    parts: (0.5 * (1 - f) + 0.3 * (1 - R) + 0.2 * (1 - U)) * (1 - 0.4 * C),
    recycle: (0.35 * (1 - f) + 0.35 * (1 - R) + 0.3 * (1 - U)) * (1 - 0.6 * C),
  }

  const multipliers = PRIORITIES[priority] ?? PRIORITIES.balanced
  const scores = {}
  for (const id of FUTURES) {
    const multiplied = raw[id] * (multipliers[id] ?? 1)
    scores[id] = Math.min(1, multiplied) // cap every score at 1
  }
  return scores
}

// 'strong' (≥ 0.65), 'possible' (≥ 0.45) or 'unlikely'
export function fitFor(score) {
  if (score >= 0.65) return 'strong'
  if (score >= 0.45) return 'possible'
  return 'unlikely'
}

// How many of the 10 meter segments to light.
export function segmentsFor(score) {
  return Math.round(score * 10)
}

// The six futures, best first, each with its rank, fit and segments.
// Ties keep the order of FUTURES so the result is always the same.
export function rankFutures(inputs, priority = 'balanced') {
  const scores = scoreFutures(inputs, priority)
  return FUTURES.map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score)
    .map((future, index) => ({
      ...future,
      rank: index + 1,
      fit: fitFor(future.score),
      segments: segmentsFor(future.score),
    }))
}
