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
  const sizes = {
    sm: { icon: 36, textAr: "text-base", textEn: "text-[10px]" },
    md: { icon: 52, textAr: "text-xl", textEn: "text-xs" },
    lg: { icon: 72, textAr: "text-3xl", textEn: "text-sm" },
    xl: { icon: 108, textAr: "text-5xl", textEn: "text-base" },
  };

  const config = sizes[size];

  return (
    <div
      className={`flex items-center gap-3 ${
        variant === "stacked" ? "flex-col gap-2" : "flex-row"
      }`}
      role="img"
      aria-label="شعار شــورى — SHURA MAG"
    >
      {/* ============================================
          الأيقونة — السيفان والنخلة (الطراز السعودي)
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="logo-engraved relative"
        style={{ width: config.icon, height: config.icon }}
      >
        <svg
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5EFD9" />
              <stop offset="40%" stopColor="#E8DCAE" />
              <stop offset="70%" stopColor="#BFA15A" />
              <stop offset="100%" stopColor="#8E7333" />
            </linearGradient>

            <linearGradient id="palmGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#E8DCAE" />
              <stop offset="100%" stopColor="#8E7333" />
            </linearGradient>

            <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#735B28" />
              <stop offset="50%" stopColor="#A88A3F" />
              <stop offset="100%" stopColor="#735B28" />
            </linearGradient>

            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================
              السيفان المتقاطعان (في الأسفل)
              ============================================ */}
          <g filter="url(#softGlow)">
            {/* السيف الأول — يميل لليمين 45° */}
            <g transform="translate(60 85) rotate(45)">
              {/* النصل */}
              <path
                d="M -1.5 0 L 1.5 0 L 1.5 -38 L 0 -45 L -1.5 -38 Z"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
              />
              {/* خط منتصف النصل */}
              <line
                x1="0"
                y1="-3"
                x2="0"
                y2="-42"
                stroke="#8E7333"
                strokeWidth="0.3"
              />
              {/* الواقي الصليبي */}
              <rect
                x="-9"
                y="-1.4"
                width="18"
                height="2.8"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
                rx="0.5"
              />
              {/* المقبض */}
              <rect
                x="-1.8"
                y="1.4"
                width="3.6"
                height="11"
                fill="#574420"
                stroke="#3D2F18"
                strokeWidth="0.2"
                rx="0.5"
              />
              {/* خطوط الإمساك */}
              <line x1="-1.8" y1="4" x2="1.8" y2="4" stroke="#3D2F18" strokeWidth="0.3" />
              <line x1="-1.8" y1="7" x2="1.8" y2="7" stroke="#3D2F18" strokeWidth="0.3" />
              <line x1="-1.8" y1="10" x2="1.8" y2="10" stroke="#3D2F18" strokeWidth="0.3" />
              {/* تتويج المقبض */}
              <circle
                cx="0"
                cy="14.5"
                r="2.5"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
              />
            </g>

            {/* السيف الثاني — يميل لليسار -45° */}
            <g transform="translate(60 85) rotate(-45)">
              <path
                d="M -1.5 0 L 1.5 0 L 1.5 -38 L 0 -45 L -1.5 -38 Z"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
              />
              <line
                x1="0"
                y1="-3"
                x2="0"
                y2="-42"
                stroke="#8E7333"
                strokeWidth="0.3"
              />
              <rect
                x="-9"
                y="-1.4"
                width="18"
                height="2.8"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
                rx="0.5"
              />
              <rect
                x="-1.8"
                y="1.4"
                width="3.6"
                height="11"
                fill="#574420"
                stroke="#3D2F18"
                strokeWidth="0.2"
                rx="0.5"
              />
              <line x1="-1.8" y1="4" x2="1.8" y2="4" stroke="#3D2F18" strokeWidth="0.3" />
              <line x1="-1.8" y1="7" x2="1.8" y2="7" stroke="#3D2F18" strokeWidth="0.3" />
              <line x1="-1.8" y1="10" x2="1.8" y2="10" stroke="#3D2F18" strokeWidth="0.3" />
              <circle
                cx="0"
                cy="14.5"
                r="2.5"
                fill="url(#goldGradient)"
                stroke="#735B28"
                strokeWidth="0.25"
              />
            </g>
          </g>

          {/* ============================================
              النخلة (تنمو فوق نقطة التقاء السيفين)
              ============================================ */}
          <g filter="url(#softGlow)">
            {/* جذع النخلة */}
            <rect
              x="57.5"
              y="42"
              width="5"
              height="38"
              fill="url(#trunkGradient)"
              stroke="#574420"
              strokeWidth="0.25"
              rx="0.5"
            />

            {/* خطوط الجذع الأفقية (نمط جذع النخلة) */}
            <line x1="57.5" y1="48" x2="62.5" y2="48" stroke="#574420" strokeWidth="0.35" />
            <line x1="57.5" y1="54" x2="62.5" y2="54" stroke="#574420" strokeWidth="0.35" />
            <line x1="57.5" y1="60" x2="62.5" y2="60" stroke="#574420" strokeWidth="0.35" />
            <line x1="57.5" y1="66" x2="62.5" y2="66" stroke="#574420" strokeWidth="0.35" />
            <line x1="57.5" y1="72" x2="62.5" y2="72" stroke="#574420" strokeWidth="0.35" />

            {/* تاج الجذع — قاعدة السعفات */}
            <ellipse
              cx="60"
              cy="42"
              rx="4.5"
              ry="2.2"
              fill="url(#goldGradient)"
              stroke="#735B28"
              strokeWidth="0.25"
            />

            {/* ============================================
                السعفات — 9 سعفات منتشرة كمروحة
                ============================================ */}

            {/* السعفة الوسطى العلوية */}
            <path
              d="M 60 42 Q 60 25 60 8"
              stroke="url(#palmGradient)"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة عليا يمنى */}
            <path
              d="M 60 42 Q 72 28 84 14"
              stroke="url(#palmGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة عليا يسرى */}
            <path
              d="M 60 42 Q 48 28 36 14"
              stroke="url(#palmGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة وسطى يمنى */}
            <path
              d="M 60 42 Q 78 34 94 28"
              stroke="url(#palmGradient)"
              strokeWidth="2.3"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة وسطى يسرى */}
            <path
              d="M 60 42 Q 42 34 26 28"
              stroke="url(#palmGradient)"
              strokeWidth="2.3"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة سفلى يمنى */}
            <path
              d="M 60 44 Q 76 44 92 42"
              stroke="url(#palmGradient)"
              strokeWidth="2.1"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة سفلى يسرى */}
            <path
              d="M 60 44 Q 44 44 28 42"
              stroke="url(#palmGradient)"
              strokeWidth="2.1"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة منخفضة يمنى */}
            <path
              d="M 60 45 Q 74 50 86 54"
              stroke="url(#palmGradient)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />

            {/* سعفة منخفضة يسرى */}
            <path
              d="M 60 45 Q 46 50 34 54"
              stroke="url(#palmGradient)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />

            {/* ============================================
                عناقيد التمر (تحت السعفات)
                ============================================ */}
            <g>
              <circle cx="54" cy="46" r="1.3" fill="#A88A3F" />
              <circle cx="56" cy="48.5" r="1.3" fill="#A88A3F" />
              <circle cx="55" cy="51" r="1.1" fill="#735B28" />
            </g>
            <g>
              <circle cx="66" cy="46" r="1.3" fill="#A88A3F" />
              <circle cx="64" cy="48.5" r="1.3" fill="#A88A3F" />
              <circle cx="65" cy="51" r="1.1" fill="#735B28" />
            </g>
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
