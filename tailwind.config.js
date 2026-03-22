/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-base)',
        surface: 'var(--color-bg-surface)',
        overlay: 'var(--color-bg-overlay)',
        card: 'var(--color-bg-card)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          blue: 'var(--color-accent-blue)',
          yellow: 'var(--color-accent-yellow)',
        },
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
          pink: 'var(--color-text-pink)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'], // Playful bold font
        drama: ['Cabinet Grotesk', 'sans-serif'], // Playful display font
        data: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
