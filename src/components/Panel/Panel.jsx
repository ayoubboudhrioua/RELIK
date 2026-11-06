import { Screw } from '../Screw/Screw.jsx'
import styles from './Panel.module.css'

// An equipment faceplate: the container for one section of a page.
// - tone: 'putty' (light casing) or 'graphite' (dark casing)
// - plate: optional engraved model plate, e.g. "RLK-200 · Archive"
// - title: the section heading; titleAs sets its level (h2 by default)
export function Panel({
  as: Tag = 'section',
  tone = 'putty',
  plate,
  title,
  titleAs: Title = 'h2',
  titleId,
  children,
  className = '',
  ...rest
}) {
  return (
    <Tag
      className={`${styles.panel} ${styles[tone] ?? ''} ${className}`}
      data-room={tone === 'graphite' ? 'dark' : undefined}
      aria-labelledby={title && titleId ? titleId : undefined}
      {...rest}
    >
      <Screw className={styles.screwTL} angle={18} />
      <Screw className={styles.screwTR} angle={-40} />
      <Screw className={styles.screwBL} angle={72} />
      <Screw className={styles.screwBR} angle={5} />

      {title && (
        <header className={styles.header}>
          <Title id={titleId} className={styles.title}>
            {title}
          </Title>
        </header>
      )}

      <div className={styles.body}>{children}</div>

      {/* The model plate sits in the bottom-right corner, like on real hardware. */}
      {plate && <p className={styles.plate}>{plate}</p>}
    </Tag>
  )
}
