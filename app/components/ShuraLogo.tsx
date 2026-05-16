"use client";

import { motion } from "framer-motion";

interface ShuraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "horizontal" | "stacked" | "icon-only";
}

export default function ShuraLogo({
  size = "md",
  showText = true,
  variant = "horizontal",
}: ShuraLogoProps) {
  // ============================================
  // أبعاد الشعار حسب الحجم
  // ============================================
  const sizes = {
    sm: { icon: 32, textAr: "text-base", textEn: "text-[10px]" },
    md: { icon: 44, textAr: "text-xl", textEn: "text-xs" },
    lg: { icon: 64, textAr: "text-3xl", textEn: "text-sm" },
    xl: { icon: 96, textAr: "text-5xl", textEn: "text-base" },
  };

  const config = sizes[size];

  return (
    <div
      className={`flex items-center gap-3 ${
        variant === "stacked" ? "flex-col gap-2" : "flex-row"
      }`}
      role="img"
      aria-label="شعار شــورى"
    >
      {/* ============================================
          الأيقونة — السيفان والنخلة
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="logo-engraved relative"
        style={{ width: config.icon, height: config.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            {/* تدرج ذهبي فاخر للسيوف */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(232, 220, 174)" />
              <stop offset="50%" stopColor="rgb(191, 161, 90)" />
              <stop offset="100%" stopColor="rgb(142, 115, 51)" />
            </linearGradient>

            {/* تدرج للنخلة */}
            <linearGradient id="palmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(116, 136, 103)" />
              <stop offset="100%" stopColor="rgb(83, 99, 72)" />
            </linearGradient>

            {/* فلتر التوهج الناعم */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* السيف الأول — مائل لليمين */}
          <g filter="url(#softGlow)">
            {/* النصل */}
            <path
              d="M 30 18 L 35 13 L 52 60 L 47 65 Z"
              fill="url(#goldGradient)"
              stroke="rgb(232, 220, 174)"
              strokeWidth="0.4"
            />
            {/* المقبض */}
            <rect
              x="48"
              y="63"
              width="6"
              height="14"
              fill="rgb(87, 68, 32)"
              transform="rotate(20 51 70)"
              rx="0.5"
            />
            {/* الواقي الصليبي */}
            <line
              x1="42"
              y1="64"
              x2="60"
              y2="58"
              stroke="rgb(191, 161, 90)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* السيف الثاني — مائل لليسار (انعكاس) */}
          <g filter="url(#softGlow)">
            {/* النصل */}
            <path
              d="M 70 18 L 65 13 L 48 60 L 53 65 Z"
              fill="url(#goldGradient)"
              stroke="rgb(232, 220, 174)"
              strokeWidth="0.4"
            />
            {/* المقبض */}
            <rect
              x="46"
              y="63"
              width="6"
              height="14"
              fill="rgb(87, 68, 32)"
              transform="rotate(-20 49 70)"
              rx="0.5"
            />
            {/* الواقي الصليبي */}
            <line
              x1="40"
              y1="58"
              x2="58"
              y2="64"
              stroke="rgb(191, 161, 90)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* نقطة التقاء السيفين — حلية ذهبية */}
          <circle
            cx="50"
            cy="62"
            r="3"
            fill="rgb(232, 220, 174)"
            stroke="rgb(87, 68, 32)"
            strokeWidth="0.5"
          />

          {/* ============================================
              النخلة — أسفل السيفين
              ============================================ */}
          <g filter="url(#softGlow)">
            {/* جذع النخلة */}
            <rect
              x="48.5"
              y="78"
              width="3"
              height="14"
              fill="url(#palmGradient)"
              rx="0.5"
            />

            {/* السعفات — 7 سعفات متناسقة */}
            {/* سعفة وسطى عليا */}
            <path
              d="M 50 78 Q 50 70 50 67"
              stroke="url(#palmGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفتان جانبيتان عليا */}
            <path
              d="M 50 78 Q 45 73 41 69"
              stroke="url(#palmGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 50 78 Q 55 73 59 69"
              stroke="url(#palmGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفتان جانبيتان وسطى */}
            <path
              d="M 50 78 Q 42 78 37 75"
              stroke="url(#palmGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 50 78 Q 58 78 63 75"
              stroke="url(#palmGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفتان جانبيتان سفلى */}
            <path
              d="M 50 80 Q 43 82 39 81"
              stroke="url(#palmGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 50 80 Q 57 82 61 81"
              stroke="url(#palmGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* ثمار صغيرة ذهبية */}
            <circle cx="46" cy="79" r="0.8" fill="rgb(191, 161, 90)" />
            <circle cx="48" cy="80" r="0.8" fill="rgb(191, 161, 90)" />
            <circle cx="52" cy="80" r="0.8" fill="rgb(191, 161, 90)" />
            <circle cx="54" cy="79" r="0.8" fill="rgb(191, 161, 90)" />
          </g>
        </svg>
      </motion.div>

      {/* ============================================
          النص — شـــورى + SHURA MAG
          ============================================ */}
      {showText && variant !== "icon-only" && (
        <motion.div
          initial={{ opacity: 0, x: variant === "stacked" ? 0 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col ${
            variant === "stacked" ? "items-center" : "items-start"
          } leading-tight`}
        >
          <span
            className={`font-display font-bold tracking-tight text-gold ${config.textAr}`}
          >
            شــــورى
          </span>
          <span
            className={`font-en italic tracking-[0.25em] text-[rgb(var(--gold-deep))] ${config.textEn}`}
          >
            SHURA MAG
          </span>
        </motion.div>
      )}
    </div>
  );
}
