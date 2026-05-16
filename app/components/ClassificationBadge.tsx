"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, EyeOff } from "lucide-react";

// ============================================
// أنواع مستويات السرية
// ============================================
export type ClassificationLevel =
  | "public"
  | "internal"
  | "confidential"
  | "secret"
  | "topsecret";

interface ClassificationConfig {
  label: string;
  labelEn: string;
  description: string;
  className: string;
  icon: React.ReactNode;
  dotColor: string;
}

// ============================================
// إعدادات كل مستوى
// ============================================
const CLASSIFICATIONS: Record<ClassificationLevel, ClassificationConfig> = {
  public: {
    label: "عــام",
    labelEn: "PUBLIC",
    description: "يُسمح بتداوله خارج المركز",
    className: "classification-public",
    icon: <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />,
    dotColor: "rgb(var(--classification-public))",
  },
  internal: {
    label: "للاستخدام الداخلي",
    labelEn: "INTERNAL USE",
    description: "محدود بمنسوبي المركز",
    className: "classification-internal",
    icon: <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />,
    dotColor: "rgb(var(--classification-internal))",
  },
  confidential: {
    label: "مُقيَّـد",
    labelEn: "CONFIDENTIAL",
    description: "محدود بأقسام محددة",
    className: "classification-confidential",
    icon: <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />,
    dotColor: "rgb(var(--classification-confidential))",
  },
  secret: {
    label: "ســـري",
    labelEn: "SECRET",
    description: "محدود بصلاحيات خاصة",
    className: "classification-secret",
    icon: <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />,
    dotColor: "rgb(var(--classification-secret))",
  },
  topsecret: {
    label: "ســري للغاية",
    labelEn: "TOP SECRET",
    description: "أعلى مستويات السرية",
    className: "classification-topsecret",
    icon: <EyeOff className="h-3.5 w-3.5" strokeWidth={2.5} />,
    dotColor: "rgb(var(--classification-secret))",
  },
};

// ============================================
// قائمة كل المستويات (للاختيار)
// ============================================
export const CLASSIFICATION_LEVELS: ClassificationLevel[] = [
  "public",
  "internal",
  "confidential",
  "secret",
  "topsecret",
];

export function getClassificationConfig(level: ClassificationLevel) {
  return CLASSIFICATIONS[level];
}

// ============================================
// المكوّن: شارة سرية للعرض فقط
// ============================================
interface ClassificationBadgeProps {
  level: ClassificationLevel;
  variant?: "compact" | "detailed" | "banner";
  pulsing?: boolean;
}

export function ClassificationBadge({
  level,
  variant = "compact",
  pulsing = false,
}: ClassificationBadgeProps) {
  const config = CLASSIFICATIONS[level];

  // ============================================
  // الإصدار المضغوط — افتراضي
  // ============================================
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`classification-badge ${config.className}`}
      >
        {pulsing && (
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: config.dotColor }}
          />
        )}
        {config.icon}
        <span>{config.label}</span>
      </motion.div>
    );
  }

  // ============================================
  // الإصدار التفصيلي
  // ============================================
  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center gap-3 rounded-lg border bg-[rgb(var(--bg-elevated))]/50 p-3 ${config.className}`}
        style={{
          borderColor: config.dotColor,
        }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{
            backgroundColor: `${config.dotColor}20`,
            color: config.dotColor,
          }}
        >
          {config.icon}
        </div>
        <div className="flex flex-col">
          <span
            className="font-mono text-xs font-bold uppercase tracking-wider"
            style={{ color: config.dotColor }}
          >
            {config.labelEn}
          </span>
          <span className="font-display text-sm font-medium text-[rgb(var(--text-primary))]">
            {config.label}
          </span>
          <span className="mt-0.5 text-[10px] text-[rgb(var(--text-muted))]">
            {config.description}
          </span>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // الإصدار شريط أعلى الصفحة (Banner)
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-lg border-2 border-dashed py-2 px-4"
      style={{
        borderColor: `${config.dotColor}60`,
        backgroundColor: `${config.dotColor}08`,
      }}
    >
      {/* خطوط قطرية للخلفية */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${config.dotColor} 0, ${config.dotColor} 1px, transparent 0, transparent 10px)`,
        }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {pulsing && (
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: config.dotColor }}
            />
          )}
          {config.icon}
          <span
            className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: config.dotColor }}
          >
            {config.labelEn}
          </span>
        </div>
        <span
          className="font-display text-sm font-semibold"
          style={{ color: config.dotColor }}
        >
          {config.label}
        </span>
      </div>
    </motion.div>
  );
}

// ============================================
// المكوّن: مُحدِّد السرية (اختيار)
// ============================================
interface ClassificationSelectorProps {
  selected: ClassificationLevel;
  onChange: (level: ClassificationLevel) => void;
}

export function ClassificationSelector({
  selected,
  onChange,
}: ClassificationSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="heading-bar">
          <h3 className="font-display text-sm font-semibold text-[rgb(var(--text-primary))]">
            مستوى التصنيف
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {CLASSIFICATION_LEVELS.map((level) => {
          const config = CLASSIFICATIONS[level];
          const isSelected = selected === level;

          return (
            <motion.button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-lg border p-3 text-right transition-all duration-300 ${
                isSelected
                  ? "border-[2px]"
                  : "border-[rgb(var(--border-subtle))]/15 hover:border-[rgb(var(--border-subtle))]/30"
              }`}
              style={{
                borderColor: isSelected ? config.dotColor : undefined,
                backgroundColor: isSelected
                  ? `${config.dotColor}10`
                  : "rgb(var(--bg-elevated) / 0.4)",
              }}
              aria-pressed={isSelected}
              aria-label={`تصنيف ${config.label}`}
            >
              {isSelected && (
                <motion.div
                  layoutId="classification-indicator"
                  className="absolute right-0 top-0 h-full w-1"
                  style={{ backgroundColor: config.dotColor }}
                />
              )}

              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: `${config.dotColor}20`,
                    color: config.dotColor,
                  }}
                >
                  {config.icon}
                </div>
              </div>

              <div className="mt-2 flex flex-col">
                <span
                  className="font-display text-xs font-bold"
                  style={{
                    color: isSelected
                      ? config.dotColor
                      : "rgb(var(--text-primary))",
                  }}
                >
                  {config.label}
                </span>
                <span
                  className="mt-0.5 font-mono text-[9px] uppercase tracking-wider opacity-60"
                  style={{
                    color: isSelected
                      ? config.dotColor
                      : "rgb(var(--text-muted))",
                  }}
                >
                  {config.labelEn}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
