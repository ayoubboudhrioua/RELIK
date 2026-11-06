import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DymoLabel } from '../DymoLabel/DymoLabel.jsx'
import { en } from '../../content/en.js'
import { useRevealOnce } from '../../hooks/useRevealOnce.js'
import styles from './SpecimenBay.module.css'

// A recessed, lit bay holding one object photograph (a transparent cut-out),
// with its accession label and caption. The whole bay links to the passport.
// - object: { name, yearLabel, category, accession, image, alt, story }
// - to: link target, e.g. "/objects/walkman-tps-l2"
// - size: 's' | 'm' | 'l' (height of the bay)
// - tone: 'putty' | 'graphite'
// - state: 'ready' | 'loading' (skeleton while data arrives)
// - showStory: print the one-line story under the name
// - headingAs: heading level for the object name (h3 by default)
// - priority: load the photo straight away (use for the first screen only)
// - actions: extra buttons shown under the caption, outside the link (e.g. Quick look)
// - flipId: marks the photo for GSAP Flip transitions (Archive gallery/index)
export function SpecimenBay({
  object,
  to,
  size = 'm',
  tone = 'putty',
  state = 'ready',
  showStory = true,
  headingAs: Heading = 'h3',
  priority = false,
  actions,
  flipId,
  className = '',
  ...rest
}) {
  const [imageFailed, setImageFailed] = useState(false)
  // CRT power-on reveal the first time the bay scrolls into view.
  const wellRef = useRef(null)
  const reveal = useRevealOnce(wellRef)

  if (state === 'loading') {
    return (
      <div
        className={`${styles.bay} ${styles[size] ?? ''} ${styles[tone] ?? ''} ${styles.loading} ${className}`}
        aria-busy="true"
        {...rest}
      >
        <div className={styles.well}>
          <span className={styles.lamp} aria-hidden="true" />
          <span className={styles.skeletonObject} aria-hidden="true" />
        </div>
        <div className={styles.caption} aria-hidden="true">
          <span className={styles.skeletonLine} />
          <span className={`${styles.skeletonLine} ${styles.short}`} />
        </div>
        <span className="visually-hidden">{en.common.loadingObject}</span>
      </div>
    )
  }

  const Wrapper = to ? Link : 'div'

  return (
    <article
      className={`${styles.bay} ${styles[size] ?? ''} ${styles[tone] ?? ''} ${className}`}
      data-room={tone === 'graphite' ? 'dark' : undefined}
      {...rest}
    >
      <Wrapper to={to} className={styles.link}>
        <div className={styles.well} ref={wellRef} data-reveal={reveal}>
          <span className={styles.lamp} aria-hidden="true" />
          {imageFailed ? (
            <p className={styles.missing}>{en.common.photoUnavailable}</p>
          ) : (
            <img
              className={styles.photo}
              src={`/images/${object.image}`}
              alt={object.alt}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : undefined}
              decoding="async"
              onError={() => setImageFailed(true)}
              data-flip-id={flipId}
            />
          )}
          <span className={styles.floor} aria-hidden="true" />
        </div>

        <div className={styles.caption}>
          <DymoLabel className={styles.accession}>{object.accession}</DymoLabel>
          <Heading className={styles.name}>{object.name}</Heading>
          <p className={styles.meta}>
            <span>{object.yearLabel}</span>
            <span className={styles.metaRule} aria-hidden="true" />
            <span>{object.category}</span>
          </p>
          {showStory && object.story && <p className={styles.story}>{object.story}</p>}
        </div>
      </Wrapper>
      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  )
}
