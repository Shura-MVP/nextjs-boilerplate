import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // الخلفيات السيادية — عميقة، مكتومة، احترافية
        // ============================================
        obsidian: {
          50: "#1A1D24",
          100: "#14171D",
          200: "#0F1216",
          300: "#0A0C0F",
          400: "#06070A",
          500: "#030405",
        },

        // ============================================
        // الذهبي السيادي — مكتوم، فاخر، بلا إشعاع
        // ============================================
        sovereign: {
          50: "#F5EFD9",
          100: "#E8DCAE",
          200: "#D4BE7E",
          300: "#BFA15A",
          400: "#A88A3F",
          500: "#8E7333",
          600: "#735B28",
          700: "#574420",
          800: "#3D2F18",
          900: "#241B0E",
        },

        // ============================================
        // الزيتوني العميق — هوية المركز
        // ============================================
        verdigris: {
          50: "#E8EDE5",
          100: "#C7D2C2",
          200: "#9DAE94",
          300: "#748867",
          400: "#536348",
          500: "#3F4B36",
          600: "#2F3828",
          700: "#22291D",
          800: "#161B13",
          900: "#0B0E09",
        },

        // ============================================
        // ألوان الحالات — مكتومة لا صارخة
        // ============================================
        critical: {
          DEFAULT: "#A04545",
          soft: "#732D2D",
          deep: "#3D1818",
        },
        warning: {
          DEFAULT: "#B58838",
          soft: "#8E6A2C",
          deep: "#4D3815",
        },
        info: {
          DEFAULT: "#4A6B7A",
          soft: "#385360",
          deep: "#1E2D33",
        },
        success: {
          DEFAULT: "#5A7A4F",
          soft: "#445C3D",
          deep: "#1F2A1B",
        },

        // ============================================
        // مستويات السرية
        // ============================================
        classification: {
          public: "#5A7A4F",
          internal: "#B58838",
          confidential: "#A86838",
          secret: "#A04545",
          topsecret: "#5A2D2D",
        },
      },

      fontFamily: {
        display: ["var(--font-reem-kufi)", "serif"],
        body: ["var(--font-tajawal)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },

      fontSize: {
        "display-2xl": [
          "clamp(3rem, 9vw, 6rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "display-xl": [
          "clamp(2.25rem, 7vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "display-lg": [
          "clamp(1.75rem, 5vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-md": [
          "clamp(1.375rem, 3.5vw, 2rem)",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "120": "30rem",
        "144": "36rem",
      },

      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "112rem",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },

      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-sovereign": "pulseSovereign 4s ease-in-out infinite",
        "shimmer-gold": "shimmerGold 3s linear infinite",
        "drift-slow": "driftSlow 20s ease-in-out infinite",
        "breathe": "breathe 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSovereign: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmerGold: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        driftSlow: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(2%, -2%)" },
          "66%": { transform: "translate(-2%, 2%)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.05)", opacity: "0.7" },
        },
      },

      backgroundImage: {
        "sovereign-gradient":
          "linear-gradient(135deg, #BFA15A 0%, #A88A3F 50%, #735B28 100%)",
        "obsidian-gradient":
          "linear-gradient(180deg, #0F1216 0%, #06070A 100%)",
        "verdigris-gradient":
          "linear-gradient(135deg, #3F4B36 0%, #22291D 100%)",
        "radial-glow":
          "radial-gradient(circle at center, rgba(191, 161, 90, 0.15) 0%, transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")",
      },

      boxShadow: {
        sovereign:
          "0 0 0 1px rgba(191, 161, 90, 0.1), 0 8px 32px -8px rgba(191, 161, 90, 0.2)",
        "sovereign-lg":
          "0 0 0 1px rgba(191, 161, 90, 0.15), 0 24px 64px -16px rgba(191, 161, 90, 0.3)",
        "inner-glow":
          "inset 0 1px 0 0 rgba(191, 161, 90, 0.1)",
        "depth":
          "0 1px 2px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)",
      },

      transitionTimingFunction: {
        "sovereign": "cubic-bezier(0.16, 1, 0.3, 1)",
        "executive": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
