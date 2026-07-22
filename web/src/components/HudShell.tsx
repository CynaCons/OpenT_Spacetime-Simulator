import type { ReactNode } from 'react'
import { simulationStore, useSimulation } from '../state/simulationStore'
import styles from './HudShell.module.css'

/**
 * Lab console — the one shared chrome for every chapter's parameters.
 * Collapses to a slim pill so the 3D figure stays unobstructed.
 */
export function HudShell({
  lab,
  title,
  children,
}: {
  /** Chapter number shown in the eyebrow, e.g. "06" */
  lab: string
  title: string
  children: ReactNode
}) {
  const open = useSimulation((s) => s.hudOpen)

  return (
    <section className={open ? styles.shell : styles.shellClosed} aria-label={`${title} controls`}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        onClick={() => simulationStore.toggleHud()}
      >
        <span className={styles.eyebrow}>Lab {lab}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron} aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </section>
  )
}
