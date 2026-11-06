import ScrambledText from '../ReactBits/ScrambledText/ScrambledText.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import styles from './DecodeText.module.css'

// Terminal text that decodes into place once, the first time it is seen.
// Built on React Bits' ScrambledText (one of the site's two React Bits
// components). Pointer and click effects are turned off: the text must
// always be readable. Screen readers get the plain text, and with reduced
// motion the text simply appears.
// - text: a plain string
// - duration: seconds for the whole line to resolve
export function DecodeText({ text, duration = 0.6, className = '' }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <span className={className}>{text}</span>

  return (
    <ScrambledText
      className={`${styles.decode} ${className}`}
      duration={duration}
      speed={0.8}
      radius={1}
      clickBurst={false}
      scrambleChars="#%&$01<>/"
      intro
    >
      {text}
    </ScrambledText>
  )
}
