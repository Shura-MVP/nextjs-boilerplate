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
        // الألوان الأساسية — هوية DSC
        olive: {
          50: "#F2F4F0",
          100: "#E0E6DD",
          200: "#C2CDBC",
          300: "#9DB094",
          400: "#7A9B6E",
          500: "#5C7A4F",
          600: "#3F5A40",
          700: "#2D4230",
          800: "#1A2419",
          900: "#0F1A10",
        },
        gold: {
          50: "#FAF5E8",
          100: "#F2E5C4",
          200: "#E5CB89",
          300: "#D4B265",
          400: "#C9A14A",
          500: "#B58838",
          600: "#9A6E2A",
          700: "#7A5520",
          800: "#5A3F18",
          900: "#3D2A10",
        },
        cream: {
          50: "#FAFAF7",
          100: "#F5F2E8",
          200: "#EDE8D6",
          300: "#E0D9BD",
        },
        // ألوان دلالية
        ink: {
          DEFAULT: "#1A2419",
          soft: "#2D4230",
        },
        paper: {
          DEFAULT: "#FAFAF7",
          soft: "#F5F2E8",
        },
      },
      fontFamily: {
        display: ["var(--font-reem-kufi)", "serif"],
        body: ["var(--font-tajawal)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 8vw, 5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 6vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 4vw, 2.25rem)", { lineHeight: "1.3" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A14A 0%, #B58838 50%, #9A6E2A 100%)",
        "olive-gradient": "linear-gradient(135deg, #5C7A4F 0%, #3F5A40 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
