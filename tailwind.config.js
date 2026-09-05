/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        primary: "#2B1B17",
        secondary: "#4A2F27",
        accent: "#D6B49A",
        "accent-hover": "#C59F82",
        "accent-light": "#EADBCE",
        background: "#120B09",
        surface: "#1A110E",
        "surface-card": "#201511",
        "surface-elevated": "#261915",
        "surface-border": "rgba(214, 180, 154, 0.12)",
        ink: "#F8F4F1",
        "ink-dim": "#D8CFC8",
        muted: "#C7B8B0",
        "muted-dark": "#8C7A70",
        success: "#4CAF50",
        "success-bg": "rgba(76, 175, 80, 0.12)",
        error: "#EF4444",
        "error-bg": "rgba(239, 68, 68, 0.12)",
        sage: "#8D9B6A",
        ivory: "#F3E7DA",
        charcoal: "#171414"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        alt: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      letterSpacing: {
        luxury: "0.2em",
        editorial: "0.15em",
        tightest: "-0.04em"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0, 0, 0, 0.35)",
        luxury: "0 10px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(214, 180, 154, 0.15)",
        "luxury-hover": "0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(214, 180, 154, 0.35)",
        glow: "0 0 30px rgba(214, 180, 154, 0.22)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(25px, -30px) scale(1.08)" }
        },
        "float-reverse": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-25px, 20px) scale(0.92)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "fade-in": "fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in": "slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "float-reverse": "float-reverse 11s ease-in-out infinite",
        marquee: "marquee 32s linear infinite"
      }
    }
  },
  plugins: []
};
