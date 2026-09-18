/**
 * MakeTab Tasarım Dili v2 — profesyonel eğitim SaaS sistemi.
 *
 * İlkeler:
 * - Tek marka mavisi (`brand` skalası): tüm birincil aksiyonlar, linkler, odaklar.
 * - Nötr zeminler (beyaz / slate): içerik kartları sade, gölge tek tip (`shadow-card`).
 * - Vurgu renkleri anlam taşır: amber = AI / makam, emerald = veli / başarı,
 *   rose = tehlike / çıkış, indigo = yaratıcı/AI ikincil.
 * - Roller: öğretmen = brand, veli = emerald, müdür = slate-950 + amber.
 * - Yarıçap: kart 1rem (rounded-2xl), hap rozet full, buton input ile eşleşir.
 * - Font: Plus Jakarta Sans (arayüz) + Outfit (sayı/başlık vurgusu).
 *
 * Tailwind v4 karşılığı `src/index.css` içindeki `@theme` bloğudur
 * (örn. `bg-brand-600`, `shadow-card`, `font-display`).
 */

export const maketabTheme = {
  font: {
    body: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    display: "'Outfit', 'Plus Jakarta Sans', sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, monospace",
  },
  color: {
    brand: {
      50: '#eef4ff',
      100: '#dbe6fe',
      200: '#bfd3fe',
      300: '#93b4fd',
      400: '#608dfa',
      500: '#3b6ef6',
      600: '#2456e6',
      700: '#1d44c8',
      800: '#1e3aa5',
      900: '#1e3682',
      950: '#17224f',
    },
    ink: '#0f172a',
    body: '#334155',
    muted: '#64748b',
    faint: '#94a3b8',
    surface: '#ffffff',
    canvas: '#f8fafc',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    ai: '#f59e0b',
    aiSoft: '#fcd34d',
    parent: '#059669',
    danger: '#e11d48',
    principal: '#020617',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    card: '1rem',
    lg: '1.25rem',
    pill: '9999px',
  },
  shadow: {
    card: '0 1px 2px rgb(15 23 42 / 0.05), 0 12px 32px -16px rgb(15 23 42 / 0.18)',
    pop: '0 12px 40px -12px rgb(15 23 42 / 0.35)',
  },
  role: {
    teacher: 'brand',
    parent: 'emerald',
    principal: 'amber-on-dark',
  },
} as const;

export type MaketabTheme = typeof maketabTheme;
