import { CHAPTERS } from '../content/chapters'
import { simulationStore, useSimulation } from '../state/simulationStore'
import styles from './ChapterRail.module.css'

/** Compact chapter progress strip — jump anywhere in the story arc. */
export function ChapterRail() {
  const chapterId = useSimulation((s) => s.chapterId)
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId)

  return (
    <nav className={styles.rail} aria-label="Chapter progress">
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${((idx + 0.5) / CHAPTERS.length) * 100}%` }}
        />
      </div>
      <div className={styles.dots}>
        {CHAPTERS.map((c, i) => {
          const active = c.id === chapterId
          const done = i < idx
          return (
            <button
              key={c.id}
              type="button"
              className={[
                styles.dot,
                active ? styles.dotActive : '',
                done ? styles.dotDone : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title={`${c.shortTitle} — ${c.title}`}
              aria-current={active ? 'step' : undefined}
              aria-label={`Chapter ${c.index}: ${c.title}`}
              onClick={() => simulationStore.setChapter(c.id)}
            >
              <span className={styles.num}>{c.index}</span>
              <span className={styles.label}>{c.shortTitle.replace(/^\d+\s*·\s*/, '')}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
