import { Screen, ScreenLine } from '../../components/Screen/Screen.jsx'
import { labOutcomes } from '../../data/objects.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import styles from './Lab.module.css'

// The amber CRT under the console: the top future, what it involves,
// and the four inputs in words. Always says "illustrative, sample assumptions".
export function Explanation({ top, values }) {
  const outcome = labOutcomes.find((o) => o.id === top.id)
  const words = Object.fromEntries(en.lab.inputs.map((input) => [input.id, input.words[values[input.id] - 1]]))

  return (
    <Screen className={styles.explanation} label={en.lab.whyTitle}>
      <ScreenLine size="sm" dim>
        {en.lab.topFuture}
      </ScreenLine>
      <ScreenLine size="lg">
        {outcome.name}: {en.lab.fit[top.fit]}
      </ScreenLine>
      <p className={styles.explanationText}>{outcome.involves}</p>
      <p className={styles.explanationInputs}>{format(en.lab.inputsSummary, words)}</p>
      <p className={styles.explanationNote}>{en.lab.disclaimer}</p>
    </Screen>
  )
}
