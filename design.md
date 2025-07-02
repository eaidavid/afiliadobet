
# 🎨 AfiliadosBet Design System
### Sistema de Design Completo e Padronizado

---

## 📋 **ÍNDICE**
1. [Visão Geral](#visão-geral)
2. [Tipografia](#tipografia)
3. [Paleta de Cores](#paleta-de-cores)
4. [Espaçamento](#espaçamento)
5. [Componentes](#componentes)
6. [Layout e Grid](#layout-e-grid)
7. [Responsividade](#responsividade)
8. [Animações](#animações)
9. [Estados e Interações](#estados-e-interações)
10. [Acessibilidade](#acessibilidade)

---

## 🎯 **VISÃO GERAL**

### Identidade Visual
O AfiliadosBet utiliza um design **moderno, profissional e confiável** com foco em:
- **Dark Theme**: Interface escura para reduzir fadiga visual
- **Gradientes Elegantes**: Emerald + Blue para destacar elementos importantes
- **Minimalismo Funcional**: Cada elemento tem propósito claro
- **Alta Legibilidade**: Contraste otimizado para melhor experiência

### Princípios de Design
1. **Consistência**: Mesmos padrões em todas as páginas
2. **Hierarquia Clara**: Informações organizadas por importância
3. **Feedback Visual**: Estados claros para todas as interações
4. **Performance**: Animações suaves sem comprometer velocidade

---

## 🔤 **TIPOGRAFIA**

### Fonte Principal
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Por que Inter?**
- ✅ Excelente legibilidade em telas
- ✅ Suporte completo a acentos portugueses
- ✅ Variações de peso otimizadas
- ✅ Carregamento rápido via Google Fonts

### Hierarquia de Texto

#### Headlines (Títulos Principais)
```css
.heading-1 {
  font-size: 2.5rem;    /* 40px */
  font-weight: 700;     /* Bold */
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.heading-2 {
  font-size: 2rem;      /* 32px */
  font-weight: 600;     /* Semibold */
  line-height: 1.3;
}

.heading-3 {
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
  line-height: 1.4;
}
```

#### Body Text (Texto Corpo)
```css
.body-large {
  font-size: 1.125rem;  /* 18px */
  font-weight: 400;
  line-height: 1.6;
}

.body-regular {
  font-size: 1rem;      /* 16px */
  font-weight: 400;
  line-height: 1.5;
}

.body-small {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
  line-height: 1.4;
}
```

#### Elementos Especiais
```css
.caption {
  font-size: 0.75rem;   /* 12px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
```

---

## 🎨 **PALETA DE CORES**

### Cores Primárias

#### Emerald (Cor Principal)
```css
--emerald-50:  #ecfdf5;
--emerald-100: #d1fae5;
--emerald-400: #34d399;   /* Links e elementos secundários */
--emerald-500: #10b981;   /* Cor principal - botões, highlights */
--emerald-600: #059669;   /* Hover states */
--emerald-700: #047857;   /* Active states */
--emerald-900: #064e3b;   /* Dark accents */
```

#### Blue (Cor Secundária)
```css
--blue-50:  #eff6ff;
--blue-100: #dbeafe;
--blue-400: #60a5fa;     /* Links alternativos */
--blue-500: #3b82f6;     /* Gradientes, elementos destacados */
--blue-600: #2563eb;     /* Hover */
--blue-700: #1d4ed8;     /* Active */
--blue-900: #1e3a8a;     /* Dark accents */
```

### Cores de Apoio

#### Grays (Tons de Cinza)
```css
--slate-50:  #f8fafc;    /* Texto em backgrounds escuros */
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;    /* Texto secundário */
--slate-400: #94a3b8;    /* Placeholders, disabled */
--slate-500: #64748b;
--slate-600: #475569;    /* Bordas */
--slate-700: #334155;    /* Bordas escuras */
--slate-800: #1e293b;    /* Backgrounds secundários */
--slate-900: #0f172a;    /* Backgrounds de cards */
--slate-950: #020617;    /* Background principal */
```

#### Status Colors (Cores de Estado)
```css
/* Success */
--success-light: #dcfce7;
--success-main:  #16a34a;
--success-dark:  #14532d;

/* Warning */
--warning-light: #fef3c7;
--warning-main:  #f59e0b;
--warning-dark:  #92400e;

/* Error */
--error-light: #fee2e2;
--error-main:  #dc2626;
--error-dark:  #7f1d1d;

/* Info */
--info-light: #dbeafe;
--info-main:  #2563eb;
--info-dark:  #1e3a8a;
```

### Aplicação das Cores

#### Backgrounds
```css
.bg-primary     { background: hsl(240 10% 3.9%); }    /* Slate-950 */
.bg-secondary   { background: hsl(240 5.9% 10%); }    /* Slate-900 */
.bg-card        { background: hsl(240 3.7% 15.9%); }  /* Slate-800 */
```

#### Text Colors
```css
.text-primary   { color: hsl(0 0% 98%); }         /* Branco quase puro */
.text-secondary { color: hsl(240 5% 64.9%); }     /* Slate-400 */
.text-muted     { color: hsl(240 3.7% 15.9%); }   /* Slate-700 */
```

---

## 📏 **ESPAÇAMENTO**

### Sistema de Espaçamento (8px Base)
```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Aplicação do Espaçamento

#### Padding Interno
```css
.card-padding     { padding: var(--space-6); }      /* 24px */
.button-padding   { padding: var(--space-3) var(--space-6); } /* 12px 24px */
.input-padding    { padding: var(--space-3) var(--space-4); } /* 12px 16px */
```

#### Margins e Gaps
```css
.section-gap     { gap: var(--space-8); }          /* 32px */
.component-gap   { gap: var(--space-4); }          /* 16px */
.element-gap     { gap: var(--space-2); }          /* 8px */
```

---

## 🧩 **COMPONENTES**

### Botões

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: #334155;
  color: white;
  border: 1px solid #475569;
}

.btn-secondary:hover {
  background: #475569;
  border-color: #64748b;
}
```

#### Danger Button
```css
.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
```

### Cards

#### Standard Card
```css
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
```

#### Stats Card
```css
.stats-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid rgba(16, 185, 129, 0.1);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
}
```

### Inputs

#### Text Input
```css
.input {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.input::placeholder {
  color: #64748b;
}
```

### Navigation

#### Sidebar Item
```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.sidebar-item.active {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.sidebar-item:not(.active) {
  color: #cbd5e1;
}

.sidebar-item:not(.active):hover {
  background: #334155;
  color: white;
}
```

---

## 📱 **LAYOUT E GRID**

### Container System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.container-fluid {
  width: 100%;
  padding: 0 16px;
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
.grid-responsive {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Layout Padrões

#### Dashboard Layout
```css
.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: #020617;
}

.sidebar {
  background: #0f172a;
  border-right: 1px solid #334155;
}

.main-content {
  padding: 24px;
  overflow-x: hidden;
}
```

#### Admin Layout
```css
.admin-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.admin-header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #334155;
  padding: 16px 24px;
}
```

---

## 📲 **RESPONSIVIDADE**

### Breakpoints
```css
/* Mobile First Approach */
.mobile    { /* 0px - 767px */ }
.tablet    { @media (min-width: 768px) }
.desktop   { @media (min-width: 1024px) }
.large     { @media (min-width: 1280px) }
.xl        { @media (min-width: 1536px) }
```

### Mobile Optimizations

#### Touch Targets
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
}
```

#### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0f172a;
  border-top: 1px solid #334155;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

#### Responsive Text
```css
.responsive-heading {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .responsive-heading {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .responsive-heading {
    font-size: 2.5rem;
  }
}
```

---

## ✨ **ANIMAÇÕES**

### Transições Padrão
```css
.smooth-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slow-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animações de Loading
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-fade-in { animation: fade-in 0.5s ease-out; }
```

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

---

## 🎮 **ESTADOS E INTERAÇÕES**

### Estados de Botão
```css
.button {
  /* Default state */
  opacity: 1;
  cursor: pointer;
}

.button:hover {
  /* Hover state */
  transform: translateY(-1px);
}

.button:active {
  /* Active state */
  transform: translateY(0);
}

.button:disabled {
  /* Disabled state */
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button:focus {
  /* Focus state */
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
```

### Estados de Input
```css
.input-state-default {
  border-color: #475569;
}

.input-state-focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-state-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-state-success {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
```

### Feedback Visual
```css
.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 12px 16px;
  border-radius: 8px;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 12px 16px;
  border-radius: 8px;
}

.warning-message {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  padding: 12px 16px;
  border-radius: 8px;
}
```

---

## ♿ **ACESSIBILIDADE**

### Contraste de Cores
```css
/* Garantir contraste mínimo WCAG AA (4.5:1) */
.high-contrast-text {
  color: #ffffff; /* Contraste 21:1 com background escuro */
}

.medium-contrast-text {
  color: #cbd5e1; /* Contraste 12:1 com background escuro */
}

.low-contrast-text {
  color: #94a3b8; /* Contraste 7:1 com background escuro */
}
```

### Focus Management
```css
.focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #10b981;
  color: white;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 🛠️ **IMPLEMENTAÇÃO E MANUTENÇÃO**

### CSS Custom Properties (Variáveis)
```css
:root {
  /* Colors */
  --color-primary: #10b981;
  --color-secondary: #3b82f6;
  --color-background: #020617;
  --color-surface: #1e293b;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cbd5e1;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-primary: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Border Radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

### Utility Classes
```css
/* Display */
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Flexbox */
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Spacing */
.p-4 { padding: 1rem; }
.m-4 { margin: 1rem; }
.gap-4 { gap: 1rem; }

/* Colors */
.text-white { color: white; }
.text-emerald-400 { color: #34d399; }
.bg-slate-800 { background-color: #1e293b; }

/* Border Radius */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }

/* Shadows */
.shadow-lg { box-shadow: var(--shadow-lg); }

/* Transitions */
.transition-all { transition: all 0.2s ease; }
```

---

## 📝 **GUIDELINES DE USO**

### ✅ **FAÇA**
- Use a fonte Inter em todos os textos
- Mantenha contraste mínimo de 4.5:1 para textos
- Use a paleta de cores definida
- Implemente estados de hover/focus em elementos interativos
- Use espaçamento consistente baseado em múltiplos de 8px
- Teste em dispositivos móveis
- Inclua fallbacks para animações

### ❌ **NÃO FAÇA**
- Misture diferentes famílias de fonte
- Use cores fora da paleta definida
- Ignore estados de acessibilidade
- Crie componentes sem responsividade
- Use animações muito longas (>300ms)
- Esqueça de testar em modo escuro

### 🎯 **CHECKLIST DE QUALIDADE**
- [ ] Componente é responsivo?
- [ ] Estados de hover/focus implementados?
- [ ] Contraste de cores adequado?
- [ ] Animações suaves?
- [ ] Acessível via teclado?
- [ ] Testado em mobile?
- [ ] Usa variáveis CSS?
- [ ] Segue padrão de nomenclatura?

---

## 🚀 **IMPLEMENTAÇÃO PRÁTICA**

### Exemplo de Componente Completo
```tsx
const Card = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = `
    bg-slate-800 border border-slate-700 rounded-xl p-6
    transition-all duration-200 ease-in-out
    hover:transform hover:-translate-y-1
    hover:shadow-xl hover:shadow-emerald-500/10
    focus-within:ring-2 focus-within:ring-emerald-500/20
  `;

  const variants = {
    default: 'hover:border-slate-600',
    highlighted: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
```

---

## 📖 **RECURSOS ADICIONAIS**

### Ferramentas Recomendadas
- **Figma**: Para prototipagem e design
- **Accessibility Insights**: Para testes de acessibilidade
- **Lighthouse**: Para performance e qualidade
- **Coolors.co**: Para explorar paletas de cores
- **Type Scale**: Para escalas tipográficas

### Links Úteis
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📄 **CHANGELOG**

### v1.0.0 (2025-01-XX)
- ✅ Documentação inicial completa
- ✅ Paleta de cores definida
- ✅ Sistema de tipografia estabelecido
- ✅ Componentes base documentados
- ✅ Guidelines de responsividade
- ✅ Padrões de acessibilidade

---

**🎨 Design System AfiliadosBet v1.0**  
*Criado para garantir consistência, qualidade e excelente experiência do usuário*
