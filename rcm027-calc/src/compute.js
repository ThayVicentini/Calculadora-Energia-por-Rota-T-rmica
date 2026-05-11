/**
 * RCM027 — Cálculos Energéticos
 * Todas as fórmulas extraídas das notas de aula do Prof. Hugo Perazzini (UNIFEI)
 */

export const DEFAULT_INPUTS = {
  // Produtividade
  Ap: 1000,      // ha/ano  — Área agrícola
  P: 50,         // t/ha    — Produtividade média
  fr: 0.55,      // decimal — Fator residual
  top: 7008,     // h/ano   — Tempo operacional (80% de 8760 h)

  // Umidade
  Xi: 0.85,      // decimal — Umidade inicial (b.u.)
  Xf: 0.10,      // decimal — Umidade final após secagem (b.u.)

  // PCI e Densificação
  PCIs: 18.0,    // MJ/kg   — PCI da biomassa seca
  lambda: 2.5,   // MJ/kg   — Calor latente de vaporização da água a 0°C
  etaD: 0.94,    // decimal — Eficiência da densificação (briquetadeira/pelletizadora)

  // Eficiências de conversão termoquímica
  etaR: 0.30,      // decimal — Ciclo Rankine (Combustão) — IRENA, 2022
  etaGas: 0.80,    // decimal — Gaseificador leito fluidizado — Teixeira et al., 2013
  etaMot: 0.39,    // decimal — Motor a diesel (Gaseificação) — Echeverry, 2021
  etaGerBO: 0.536, // decimal — Gerador pirólise bio-óleo — Wang et al., 2025
  etaGerSG: 0.213, // decimal — Gerador pirólise syngas — Indrawan et al., 2017
  fc: 0.70,        // decimal — Fator de capacidade — IRENA 2022 / EPE 2020

  // Energia do pré-tratamento
  Psec: 50,   // kW      — Potência elétrica do secador e periféricos
  Pcom: 30,   // kW      — Potência elétrica da cominuição
  Ed: 0.04,   // kW/kg   — Consumo específico de densificação — Fabricante BIOMAX
  Qt: 100,    // kW      — Energia térmica total consumida pela secagem
}

/**
 * Executa todos os cálculos energéticos a partir dos parâmetros de entrada.
 * @param {typeof DEFAULT_INPUTS} i — Objeto com os parâmetros de entrada
 * @returns Objeto com todos os resultados intermediários e finais
 */
export function compute(i) {
  // ── 1. Produtividade e quantificação do resíduo ──────────────────────
  const mt  = i.Ap * i.P                              // t/ano  — ṁt = Ap × P
  const mr  = mt * i.fr                               // t/ano  — ṁr = ṁt × fr
  const mru = mr / i.top                              // t/h    — ṁru = ṁr / top
  const ms  = mru * (1 - i.Xi) / (1 - i.Xf)          // t/h    — ṁs = ṁru × (1−Xi)/(1−Xf)
  const eta = (ms * 8760) / mt                        // adim.  — η = (ṁs × 8760) / ṁt

  // ── 2. Poder calorífico inferior do briquete/pellet ──────────────────
  const PCIb = i.PCIs * (1 - i.Xf) - i.Xf * i.lambda // MJ/kg — PCIb = PCIs×(1−Xf) − Xf×λ

  // ── 3. Potência teórica disponível ───────────────────────────────────
  // ṁs [t/h] × 1000 [kg/t] × PCIb [MJ/kg] × 10⁶ [J/MJ] / 3600 [s/h] / 10⁶ [W/MW]
  // = ṁs × PCIb × 1000 / 3600
  const Pt = ms * i.etaD * PCIb * 1000 / 3600         // MW

  // ── 4. Potência elétrica por tecnologia ──────────────────────────────
  const Pe_comb    = Pt * i.etaR                       // MW — Combustão (Rankine)
  const Pe_gas     = Pt * i.etaGas * i.etaMot          // MW — Gaseificação
  const Pe_piro_bo = Pt * i.etaGerBO                   // MW — Pirólise bio-óleo
  const Pe_piro_sg = Pt * i.etaGerSG                   // MW — Pirólise syngas

  // ── 5. Energia elétrica total por tecnologia ─────────────────────────
  const Ee_comb    = Pe_comb    * i.top * i.fc          // MWh/ano
  const Ee_gas     = Pe_gas     * i.top * i.fc          // MWh/ano
  const Ee_piro_bo = Pe_piro_bo * i.top * i.fc          // MWh/ano
  const Ee_piro_sg = Pe_piro_sg * i.top * i.fc          // MWh/ano

  // ── 6. Energia consumida no pré-tratamento ───────────────────────────
  // mru [t/h] → mru × 1000 [kg/h] para Ed [kW/kg]
  // Econs [MWh/ano] = (Psec + Pcom + Ed×mru_kg/h + Qt) [kW] × top [h/ano] / 1000
  const Econs = (i.Psec + i.Pcom + i.Ed * mru * 1000 + i.Qt) * i.top / 1000

  // ── 7. Energia líquida comercializável ───────────────────────────────
  const El_comb    = Ee_comb    - Econs                 // MWh/ano
  const El_gas     = Ee_gas     - Econs                 // MWh/ano
  const El_piro_bo = Ee_piro_bo - Econs                 // MWh/ano
  const El_piro_sg = Ee_piro_sg - Econs                 // MWh/ano

  return {
    mt, mr, mru, ms, eta,
    PCIb, Pt,
    Pe_comb, Pe_gas, Pe_piro_bo, Pe_piro_sg,
    Ee_comb, Ee_gas, Ee_piro_bo, Ee_piro_sg,
    Econs,
    El_comb, El_gas, El_piro_bo, El_piro_sg,
  }
}
