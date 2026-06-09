/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cabinet Grotesk", "Georgia", "serif"],
        body: ["General Sans", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Surfaces
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "surface-off": "var(--color-surface-offset)",
        "surface-off-2": "var(--color-surface-offset-2)",
        "surface-dyn": "var(--color-surface-dynamic)",
        divider: "var(--color-divider)",
        border: "var(--color-border)",

        // Text
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-faint": "var(--color-text-faint)",
        "text-inv": "var(--color-text-inverse)",

        // Accents
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-active": "var(--color-primary-active)",
        "primary-highlight": "var(--color-primary-highlight)",

        success: "var(--color-success)",
        "success-highlight": "var(--color-success-highlight)",

        warning: "var(--color-warning)",
        "warning-highlight": "var(--color-warning-highlight)",

        error: "var(--color-error)",
        "error-highlight": "var(--color-error-highlight)",

        info: "var(--color-blue)",
        "info-highlight": "var(--color-blue-highlight)",

        orange: "var(--color-orange)",
        gold: "var(--color-gold)",
        purple: "var(--color-purple)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        32: "var(--space-32)",
      },
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "1.5" }],
        sm: ["var(--text-sm)", { lineHeight: "1.5" }],
        base: ["var(--text-base)", { lineHeight: "1.6" }],
        lg: ["var(--text-lg)", { lineHeight: "1.4" }],
        xl: ["var(--text-xl)", { lineHeight: "1.2" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "1.15" }],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        interactive: "180ms",
      },
    },
  },
  plugins: [],
};
