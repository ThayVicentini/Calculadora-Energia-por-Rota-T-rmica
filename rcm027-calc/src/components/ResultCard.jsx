import styles from './ResultCard.module.css'

function fmt(n, dec = 3) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}

export default function ResultCard({ label, value, unit, formula, color, bg, highlight = false, decimals = 3 }) {
  const isNeg = typeof value === 'number' && value < 0
  const displayColor = isNeg ? '#E74C3C' : (color ?? '#1A2733')

  return (
    <div
      className={styles.card}
      style={{
        background: highlight ? (isNeg ? '#FDEDEC' : bg) : '#F7FAFC',
        borderColor: highlight ? (isNeg ? '#E74C3C' : color) : '#EEF2F6',
      }}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.row}>
        <span
          className={highlight ? styles.valueLg : styles.value}
          style={{ color: displayColor }}
        >
          {typeof value === 'number' ? fmt(value, decimals) : value}
        </span>
        <span className={styles.unit}>{unit}</span>
      </div>
      {formula && <div className={styles.formula}>{formula}</div>}
    </div>
  )
}
