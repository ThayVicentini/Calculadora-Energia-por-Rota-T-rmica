import styles from './TechPanel.module.css'

function fmt(n, dec = 3) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

export default function TechPanel({ label, icon, color, light, Pe, Ee, El }) {
  const elNeg = El < 0

  return (
    <div className={styles.panel} style={{ background: light, borderColor: color }}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title} style={{ color }}>{label}</span>
      </div>

      <div className={styles.block}>
        <div className={styles.sublabel} style={{ color }}>Potência elétrica</div>
        <div className={styles.bigNum} style={{ color }}>
          {fmt(Pe)} <span className={styles.bigUnit}>MW</span>
        </div>
      </div>

      <div className={styles.block} style={{ borderTopColor: color + '30' }}>
        <div className={styles.sublabel} style={{ color }}>Energia total</div>
        <div className={styles.medNum} style={{ color }}>
          {fmt(Ee, 0)} <span className={styles.medUnit}>MWh/ano</span>
        </div>
      </div>

      <div className={styles.block} style={{ borderTopColor: color + '30' }}>
        <div className={styles.sublabel} style={{ color: elNeg ? '#E74C3C' : color }}>
          Energia líquida ★
        </div>
        <div className={styles.medNum} style={{ color: elNeg ? '#E74C3C' : color, fontWeight: 800 }}>
          {fmt(El, 0)} <span className={styles.medUnit}>MWh/ano</span>
        </div>
      </div>
    </div>
  )
}
