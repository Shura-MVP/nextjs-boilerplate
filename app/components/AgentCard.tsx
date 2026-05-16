"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================
// أنواع البيانات
// ============================================
export type AgentCategory = "substantive" | "adversarial" | "metacognitive";

export interface Agent {
  id: string;
  name: string;
  nameEn: string;
  category: AgentCategory;
  specialty: string;
  description: string;
  icon: LucideIcon;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onToggle: () => void;
  index?: number;
  disabled?: boolean;
}

// ============================================
// إعدادات الفئات
// ============================================
const CATEGORY_CONFIG = {
  substantive: {
    label: "موضوعي",
    labelEn: "SUBSTANTIVE",
    color: "rgb(var(--gold-base))",
    bgGradient: "from-[rgb(var(--gold-base))]/10 to-transparent",
    borderColor: "rgb(var(--gold-base))",
  },
  adversarial: {
    label: "عدائي",
    labelEn: "ADVERSARIAL",
    color: "rgb(var(--critical))",
    bgGradient: "from-[rgb(var(--critical))]/10 to-transparent",
    borderColor: "rgb(var(--critical))",
  },
  metacognitive: {
    label: "معرفي",
    labelEn: "METACOGNITIVE",
    color: "rgb(var(--info))",
    bgGradient: "from-[rgb(var(--info))]/10 to-transparent",
    borderColor: "rgb(var(--info))",
  },
};

// ============================================
// المكوّن الرئيسي
// ============================================
export default function AgentCard({
  agent,
  isSelected,
  onToggle,
  index = 0,
  disabled = false,
}: AgentCardProps) {
  const config = CATEGORY_CONFIG[agent.category];
  const Icon = agent.icon;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={!disabled ? { y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 text-right transition-all duration-400 ease-sovereign ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      style={{
        borderColor: isSelected
          ? config.borderColor
          : "rgb(var(--border-subtle) / 0.15)",
        backgroundColor: isSelected
          ? `${config.color}08`
          : "rgb(var(--bg-elevated) / 0.4)",
        boxShadow: isSelected
          ? `inset 0 0 0 1px ${config.color}40, 0 0 32px ${config.color}15`
          : "inset 0 1px 0 0 rgb(var(--gold-base) / 0.05)",
      }}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "إلغاء اختيار" : "اختيار"} ${agent.name}`}
    >
      {/* ============================================
          خلفية متدرجة عند الاختيار
          ============================================ */}
      <div
        className={`absolute inset-0 bg-gradient-to-bl ${config.bgGradient} opacity-0 transition-opacity duration-500 ${
          isSelected ? "opacity-100" : "group-hover:opacity-50"
        }`}
      />

      {/* ============================================
          خط ذهبي رأسي على اليمين عند الاختيار
          ============================================ */}
      {isSelected && (
        <motion.div
          layoutId={`agent-indicator-${agent.id}`}
          className="absolute right-0 top-0 h-full w-[2px]"
          style={{ backgroundColor: config.color }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {/* ============================================
          الصف العلوي: الأيقونة + شارة الاختيار
          ============================================ */}
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-400"
          style={{
            backgroundColor: isSelected
              ? `${config.color}20`
              : "rgb(var(--bg-tertiary))",
            color: isSelected ? config.color : "rgb(var(--text-secondary))",
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        {/* مؤشر الاختيار */}
        <motion.div
          className="flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-300"
          style={{
            borderColor: isSelected
              ? config.color
              : "rgb(var(--border-subtle) / 0.3)",
            backgroundColor: isSelected ? config.color : "transparent",
          }}
          animate={{ scale: isSelected ? 1 : 0.9 }}
        >
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Check
                className="h-4 w-4"
                strokeWidth={3}
                style={{ color: "rgb(var(--bg-primary))" }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ============================================
          المحتوى: الاسم + التخصص
          ============================================ */}
      <div className="relative flex flex-col gap-1">
        <h3
          className="font-display text-sm font-semibold leading-tight transition-colors duration-300"
          style={{
            color: isSelected ? config.color : "rgb(var(--text-primary))",
          }}
        >
          {agent.name}
        </h3>
        <p className="text-[11px] leading-relaxed text-[rgb(var(--text-muted))] line-clamp-2">
          {agent.specialty}
        </p>
      </div>

      {/* ============================================
          الصف السفلي: الفئة
          ============================================ */}
      <div className="relative mt-auto flex items-center justify-between border-t border-[rgb(var(--border-subtle))]/10 pt-2">
        <span
          className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: config.color, opacity: 0.7 }}
        >
          {config.labelEn}
        </span>
        <span
          className="text-[9px] font-medium"
          style={{ color: config.color, opacity: 0.6 }}
        >
          {config.label}
        </span>
      </div>

      {/* ============================================
          توهج خفيف عند الـ hover
          ============================================ */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.color}10 0%, transparent 60%)`,
        }}
      />
    </motion.button>
  );
}
