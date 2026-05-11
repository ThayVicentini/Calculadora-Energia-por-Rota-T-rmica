import { useState, useMemo } from 'react'
import { compute, DEFAULT_INPUTS } from './compute.js'
import { TECHS, INPUT_SECTIONS, COLORS } from './constants.js'
import InputField from './components/InputField.jsx'
import ResultCard from './components/ResultCard.jsx'
import TechPanel from './components/TechPanel.jsx'
import styles from './App.module.css'

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [activeTab, setActiveTab] = useState('inputs')

  const res = useMemo(() => compute(inputs), [inputs])

  const handle = (e) => {
    const v = parseFloat(e.target.value)
    setInputs((prev) => ({ ...prev, [e.target.name]: isNaN(v) ? 0 : v }))
  }

  const reset = () => setInputs(DEFAULT_INPUTS)

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.badge}>RCM027 · Pré-tratamento de Biomassa · UNIFEI</div>
        <h1 className={styles.title}>Calculadora Energética</h1>
        <p className={styles.subtitle}>Prof. Hugo Perazzini · Mestrado em Engenharia de Energia</p>
      </header>

      {/* ── Tab bar ── */}
      <nav className={styles.tabBar}>
        <div className={styles.tabGroup}>
          {[
            { id: 'inputs',  label: '⚙️ Parâmetros' },
            { id: 'results', label: '📊 Resultados'  },
            { id: 'compare', label: '⚡ Comparar'    },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className={styles.content}>

        {/* ════ INPUTS ════ */}
        {activeTab === 'inputs' && (
          <div className={styles.grid}>
            {INPUT_SECTIONS.map(({ title, icon, fields }) => (
              <div key={title} className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>{icon}</span>
                  <span>{title}</span>
                </div>
                {fields.map((f) => (
                  <InputField
                    key={f.name}
                    {...f}
                    value={inputs[f.name]}
                    onChange={handle}
                  />
                ))}
              </div>
            ))}
            <div className={styles.resetRow}>
              <button className={styles.resetBtn} onClick={reset}>
                ↺ Restaurar valores padrão
              </button>
            </div>
          </div>
        )}

        {/* ════ RESULTS ════ */}
        {activeTab === 'results' && (
          <div className={styles.grid}>

            <div className={styles.card}>
              <div className={styles.sectionTitle}><span>🌾</span><span>Produtividade e Resíduo</span></div>
              <ResultCard label="Commodity produzida (ṁₜ)"         value={res.mt}  unit="t/ano"  formula="ṁₜ = Aₚ × P"                           decimals={0} />
              <ResultCard label="Resíduo úmido total (ṁᵣ)"         value={res.mr}  unit="t/ano"  formula="ṁᵣ = ṁₜ × fᵣ"                          decimals={0} />
              <ResultCard label="Vazão resíduo úmido (ṁᵣᵤ)"        value={res.mru} unit="t/h"    formula="ṁᵣᵤ = ṁᵣ / tₒₚ"                        highlight color={COLORS.accent} bg="#E8F9FD" />
              <ResultCard label="Vazão resíduo seco (ṁₛ)"          value={res.ms}  unit="t/h"    formula="ṁₛ = ṁᵣᵤ × (1−Xᵢ) / (1−Xf)"           highlight color={COLORS.accent} bg="#E8F9FD" />
              <ResultCard label="Razão resíduo seco / produtiv. (η)" value={res.eta} unit="adim." formula="η = (ṁₛ × 8760) / ṁₜ"                   decimals={4} />
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitle}><span>🔥</span><span>PCI e Potência Teórica</span></div>
              <ResultCard label="PCI do briquete/pellet (PCIᵦ)"    value={res.PCIb} unit="MJ/kg" formula="PCIᵦ = PCIₛ×(1−Xf) − Xf×λ"           highlight color="#FF6B35" bg="#FFF0EB" />
              <ResultCard label="Potência teórica disponível (Pₜ)" value={res.Pt}   unit="MW"    formula="Pₜ = ṁₛ × η_d × PCIᵦ × 1000 / 3600"  highlight color="#FF6B35" bg="#FFF0EB" />

              <div className={styles.sectionTitle} style={{ marginTop: 20 }}><span>⚡</span><span>Potência Elétrica por Tecnologia</span></div>
              {TECHS.map((t) => (
                <ResultCard key={t.key} label={t.label} value={res[t.peKey]} unit="MW" formula={t.formula} color={t.color} bg={t.light} highlight />
              ))}
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitle}><span>🏭</span><span>Energia Pré-tratamento</span></div>
              <ResultCard
                label="Energia consumida (E_cons)"
                value={res.Econs}
                unit="MWh/ano"
                formula="(P_sec + P_com + E_d×ṁᵣᵤ_kg/h + Q_t) × tₒₚ / 1000"
                highlight color={COLORS.danger} bg="#FDEDEC"
                decimals={0}
              />

              <div className={styles.sectionTitle} style={{ marginTop: 20 }}><span>💚</span><span>Energia Líquida Comercializável</span></div>
              {TECHS.map((t) => (
                <ResultCard key={t.key} label={t.label} value={res[t.elKey]} unit="MWh/ano" formula={`Eₑ_${t.key} − E_cons`} color={t.color} bg={t.light} highlight decimals={0} />
              ))}
            </div>

          </div>
        )}

        {/* ════ COMPARE ════ */}
        {activeTab === 'compare' && (
          <div>
            <div className={styles.techGrid}>
              {TECHS.map((t) => (
                <TechPanel
                  key={t.key}
                  label={t.label}
                  icon={t.icon}
                  color={t.color}
                  light={t.light}
                  Pe={res[t.peKey]}
                  Ee={res[t.eeKey]}
                  El={res[t.elKey]}
                />
              ))}
            </div>

            {/* Bar chart */}
            <div className={styles.card} style={{ marginTop: 16 }}>
              <div className={styles.sectionTitle}><span>📊</span><span>Energia Líquida Comercializável (MWh/ano)</span></div>
              {(() => {
                const maxVal = Math.max(...TECHS.map((t) => res[t.elKey]), 1)
                return TECHS.map((t) => {
                  const val = res[t.elKey]
                  const pct = Math.max(0, (val / maxVal) * 100)
                  return (
                    <div key={t.key} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{t.icon} {t.label}</span>
                        <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: val < 0 ? COLORS.danger : t.color }}>
                          {val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} MWh/ano
                        </span>
                      </div>
                      <div style={{ background: '#EEF2F6', borderRadius: 8, height: 14, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: val < 0 ? COLORS.danger : t.color, borderRadius: 8, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })
              })()}

              {/* Econs reference line */}
              <div style={{ marginTop: 20, padding: '14px 16px', background: '#F7FAFC', borderRadius: 10, borderLeft: `4px solid ${COLORS.danger}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.label, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Energia consumida no pré-tratamento (E_cons)
                </div>
                <div style={{ fontSize: 22, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: COLORS.danger }}>
                  {res.Econs.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  <span style={{ fontSize: 12, fontWeight: 400, color: COLORS.muted, marginLeft: 6 }}>MWh/ano</span>
                </div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                  (P_sec + P_com + E_d × ṁᵣᵤ_kg/h + Q_t) × tₒₚ / 1000
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        RCM027 – Pré-tratamento de Biomassa · UNIFEI · Prof. Hugo Perazzini
      </footer>
    </div>
  )
}
