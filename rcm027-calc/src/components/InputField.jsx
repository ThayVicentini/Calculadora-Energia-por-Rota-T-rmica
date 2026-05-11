import { useState } from 'react'
import styles from './InputField.module.css'

export default function InputField({ label, name, value, onChange, unit, hint, min, max, step }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <div className={styles.row}>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step ?? 'any'}
          className={`${styles.input} ${focused ? styles.focused : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span className={styles.unit}>{unit}</span>
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
