import { memo } from 'react'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { en } from '../../content/en.js'
import styles from './WalkmanStory.module.css'

const t = en.home.story

// One chapter of the Walkman story: the text on the left, the photo window
// and its Dymo labels on the right. The data-* attributes mark the parts that
// useStoryMotion animates. memo: the chapter only re-renders when it becomes
// active or inactive, not on every frame of the tape counter.
export const StoryChapter = memo(function StoryChapter({ chapter, index, active }) {
  const eyebrow = `${index < 2 ? t.sideA : t.sideB}, ${chapter.track.split('·')[1].trim()}`
  return (
    <li data-chapter={index} className={styles.chapter} data-active={active || undefined}>
      <div className={styles.text}>
        {/* Screen readers read the plain copy; the hidden one types in letter by letter. */}
        <p className={styles.track}>
          <span className="visually-hidden">{eyebrow}</span>
          <span aria-hidden="true" data-eyebrow="">
            {eyebrow}
          </span>
        </p>
        <p className={styles.phase} data-fade="">
          <span>{chapter.phase}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>{chapter.years}</span>
        </p>
        <h3 className={styles.chapterTitle} data-title="">
          {chapter.title}
        </h3>
        <p className={styles.body} data-fade="">
          {chapter.text}
        </p>
      </div>

      <figure className={styles.figure}>
        <div className={styles.window} data-window="">
          {t.photos[index].map((src) => (
            <img
              key={src}
              src={`/images/${src}`}
              alt={en.objectAlt[src]}
              loading="lazy"
              decoding="async"
              className={src.startsWith('photographs/') ? styles.photo : styles.cutout}
            />
          ))}
        </div>
        <ul role="list" className={styles.notes}>
          {t.annotations[index].map((note, i) => (
            <li key={note} data-label="">
              <DymoLabel tilt={i % 2 ? 1 : -1}>{note}</DymoLabel>
            </li>
          ))}
        </ul>
      </figure>
    </li>
  )
})
