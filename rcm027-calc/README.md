# 🌿 Calculadora Energética — RCM027

Calculadora interativa de cálculos energéticos para pré-tratamento de biomassa, desenvolvida para a disciplina **RCM027 – Pré-tratamento de Biomassa** do Mestrado em Engenharia de Energia da UNIFEI.

**Prof. Hugo Perazzini**

---

## Fórmulas implementadas

| # | Variável | Equação |
|---|----------|---------|
| R1 | Commodity produzida (ṁₜ) | ṁₜ = Aₚ × P |
| R2 | Resíduo úmido total (ṁᵣ) | ṁᵣ = ṁₜ × fᵣ |
| R3 | Vazão resíduo úmido (ṁᵣᵤ) | ṁᵣᵤ = ṁᵣ / tₒₚ |
| R4 | Vazão resíduo seco (ṁₛ) | ṁₛ = ṁᵣᵤ × (1−Xᵢ) / (1−Xf) |
| R5 | Razão resíduo seco / produtividade (η) | η = (ṁₛ × 8760) / ṁₜ |
| R6 | PCI do briquete/pellet (PCIᵦ) | PCIᵦ = PCIₛ×(1−Xf) − Xf×λ |
| R7 | Potência teórica disponível (Pₜ) | Pₜ = ṁₛ × η_d × PCIᵦ × 1000 / 3600 |
| R8 | Potência elétrica — Combustão | Pₑ = Pₜ × η_Rankine |
| R9 | Potência elétrica — Gaseificação | Pₑ = Pₜ × η_gas × η_mot |
| R10 | Potência elétrica — Pirólise bio-óleo | Pₑ = Pₜ × η_ger_bo |
| R11 | Potência elétrica — Pirólise syngas | Pₑ = Pₜ × η_ger_sg |
| R12–R15 | Energia elétrica total (por tecnologia) | Eₑ = Pₑ × tₒₚ × fc |
| R16 | Energia consumida no pré-tratamento | E_cons = (P_sec + P_com + E_d×ṁᵣᵤ_kg/h + Q_t) × tₒₚ / 1000 |
| R17–R20 | Energia líquida comercializável | Eₗ = Eₑ − E_cons |

---

## 🚀 Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## 📦 Deploy no GitHub Pages

### 1. Ajuste o `vite.config.js`

Substitua `'./'` pelo nome do seu repositório:

```js
export default defineConfig({
  plugins: [react()],
  base: '/NOME-DO-SEU-REPO/',
})
```

### 2. Instale o pacote de deploy

```bash
npm install --save-dev gh-pages
```

### 3. Adicione os scripts no `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### 4. Faça o deploy

```bash
npm run deploy
```

Acesse em: `https://SEU-USUARIO.github.io/NOME-DO-SEU-REPO/`

---

## ☁️ Deploy no Vercel (alternativa mais simples)

1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Clique em **Deploy** — o Vercel detecta o Vite automaticamente

> **Nenhuma configuração extra necessária** para o Vercel. O `base: './'` do `vite.config.js` já é compatível.

---

## 📁 Estrutura do projeto

```
rcm027-calc/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx          # Entry point React
    ├── App.jsx           # Layout principal e tabs
    ├── App.module.css    # Estilos do layout
    ├── index.css         # Reset global e fontes
    ├── compute.js        # Todas as fórmulas energéticas
    ├── constants.js      # Tokens de design e configuração estática
    └── components/
        ├── InputField.jsx         # Campo de entrada numérica
        ├── InputField.module.css
        ├── ResultCard.jsx         # Card de resultado individual
        ├── ResultCard.module.css
        ├── TechPanel.jsx          # Painel comparativo por tecnologia
        └── TechPanel.module.css
```

---

## Referências bibliográficas

- BAASEL, W.D. (1976). *Preliminary Chemical Engineering Plant Design*.
- BORGNAKKE, C. et al. (2013). *Fundamentals of Thermodynamics*.
- CORTEZ, L.A.B. et al. (2014). *Biomassa para Energia*.
- ECHEVERRY, C.A. (2021). Eficiência de motores a diesel para gaseificação.
- EPE – Empresa de Pesquisa Energética (2020). *Plano Nacional de Energia 2050*.
- INDRAWAN, N. et al. (2017). *Engine performance and emissions...* Applied Energy.
- IRENA – International Renewable Energy Agency (2022). *Bioenergy Power Generation*.
- SOKHANSANJ, S.; WEBB, E. (2016). *Biomass Supply Logistics*. CRC Press.
- SOUZA, G.M. et al. (2021). *Bioenergy & Sustainability*.
- TEIXEIRA, F.N. et al. (2013). *Gasification efficiency...* Biomass & Bioenergy.
- TOWLER, G.; SINNOTT, R. (2021). *Chemical Engineering Design*. Elsevier.
- WANG, Y. et al. (2025). *Pyrolysis bio-oil generator efficiency*. Energy Conversion.
