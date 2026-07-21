import { CHAPTERS, getChapter } from '../content/chapters'
import { earthLabStore, useEarthLab } from '../state/earthLabStore'
import { simulationStore, useSimulation } from '../state/simulationStore'
import styles from './ChapterPanel.module.css'

export function ChapterPanel() {
  const chapterId = useSimulation((s) => s.chapterId)
  const chapter = getChapter(chapterId) ?? CHAPTERS[0]
  const subDemo = useEarthLab((s) => s.subDemo)
  const shapeModel = useEarthLab((s) => s.shapeModel)

  const idx = CHAPTERS.findIndex((c) => c.id === chapter.id)
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null
  const isEarth = chapter.id === 'earth-not-flat'

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <span className="tag">
          Chapter {chapter.index} / {CHAPTERS.length}
        </span>
        <h2>{chapter.title}</h2>
        <p className={styles.model}>Model: {chapter.model}</p>
      </header>

      <section className={styles.section}>
        <p>{chapter.summary}</p>
      </section>

      {isEarth && (
        <section className={styles.section}>
          <h3>Live lab</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Sub-demo: <strong>{subDemo === 'rocket' ? 'Rocket ascent' : 'Ship / horizon'}</strong>
            {' · '}
            Shape:{' '}
            <strong>{shapeModel === 'sphere' ? 'Sphere' : 'Flat disk'}</strong>
          </p>
          <div className={styles.chipRow}>
            <button
              type="button"
              className={subDemo === 'rocket' ? styles.chipActive : styles.chip}
              onClick={() => earthLabStore.setSubDemo('rocket')}
            >
              Rocket
            </button>
            <button
              type="button"
              className={subDemo === 'ship' ? styles.chipActive : styles.chip}
              onClick={() => earthLabStore.setSubDemo('ship')}
            >
              Ship
            </button>
            <button
              type="button"
              className={shapeModel === 'sphere' ? styles.chipActive : styles.chip}
              onClick={() => earthLabStore.setShapeModel('sphere')}
            >
              Sphere
            </button>
            <button
              type="button"
              className={shapeModel === 'flat' ? styles.chipWarn : styles.chip}
              onClick={() => earthLabStore.setShapeModel('flat')}
            >
              Flat
            </button>
          </div>
        </section>
      )}

      {chapter.howToExplore && (
        <section className={styles.section}>
          <h3>How to explore</h3>
          <ol className={styles.steps}>
            {chapter.howToExplore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      <section className={styles.section}>
        <h3>What we show</h3>
        <ul>
          {chapter.whatWeShow.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Equations</h3>
        {chapter.equations.map((eq) => (
          <div key={eq} className="equation">
            {eq}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h3>What was verified</h3>
        <p className="muted">{chapter.verified}</p>
      </section>

      {chapter.honestyNote && (
        <section className={styles.note}>
          <strong>Honesty note.</strong> {chapter.honestyNote}
        </section>
      )}

      {chapter.status !== 'available' && (
        <section className={styles.scaffold}>
          Demo status: <strong>{chapter.status}</strong>. Solar system viewport is live;
          chapter-specific interactions arrive in later iterations (see PLAN.md).
        </section>
      )}

      {isEarth && chapter.status === 'available' && (
        <section className={styles.ready}>
          Chapter 1 lab is interactive — use the bottom HUD on the viewport.
        </section>
      )}

      <nav className={styles.nav}>
        <button
          type="button"
          disabled={!prev}
          onClick={() => prev && simulationStore.setChapter(prev.id)}
        >
          ← Prev
        </button>
        <button
          type="button"
          disabled={!next}
          onClick={() => next && simulationStore.setChapter(next.id)}
        >
          Next →
        </button>
      </nav>
    </aside>
  )
}
