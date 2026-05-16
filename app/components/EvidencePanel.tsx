"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Anchor,
  Scale,
  AlertTriangle,
  Shield,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

interface EvidenceItem {
  id: number;
  type: "cite" | "reasoning" | "gap";
  content: string;
  source?: string;
}

interface EvidencePanelProps {
  citations: string[];
  reasoning: string[];
  gaps: string[];
  confidence?: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
}

// ============================================
// إعدادات أنواع الأدلة
// ============================================
const EVIDENCE_CONFIG = {
  cite: {
    label: "استشهاد",
    labelEn: "Citation",
    icon: Anchor,
    color: "rgb(var(--gold-base))",
    colorBright: "rgb(var(--gold-bright))",
  },
  reasoning: {
    label: "تعليل",
    labelEn: "Reasoning",
    icon: Scale,
    color: "rgb(var(--info))",
    colorBright: "rgb(var(--info))",
  },
  gap: {
    label: "فجوة معرفية",
    labelEn: "Knowledge Gap",
    icon: AlertTriangle,
    color: "rgb(var(--warning))",
    colorBright: "rgb(var(--warning))",
  },
};

// ============================================
// إعدادات مستويات المخاطر
// ============================================
const RISK_CONFIG = {
  low: {
    label: "منخفضة",
    labelEn: "LOW",
    color: "rgb(var(--success))",
    percentage: 25,
  },
  medium: {
    label: "متوسطة",
    labelEn: "MEDIUM",
    color: "rgb(var(--warning))",
    percentage: 55,
  },
  high: {
    label: "مرتفعة",
    labelEn: "HIGH",
    color: "rgb(var(--critical))",
    percentage: 78,
  },
  critical: {
    label: "حرجة",
    labelEn: "CRITICAL",
    color: "rgb(var(--classification-topsecret))",
    percentage: 95,
  },
};

// ============================================
// المكوّن الرئيسي
// ============================================
export default function EvidencePanel({
  citations,
  reasoning,
  gaps,
  confidence = 0,
  riskLevel = "medium",
}: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<"cite" | "reasoning" | "gap">(
    "cite"
  );

  const counts = {
    cite: citations.length,
    reasoning: reasoning.length,
    gap: gaps.length,
  };

  const activeItems =
    activeTab === "cite"
      ? citations
      : activeTab === "reasoning"
      ? reasoning
      : gaps;

  return (
    <motion.section
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel-sovereign flex h-full flex-col overflow-hidden"
    >
      {/* ============================================
          رأس البطاقة
          ============================================ */}
      <header className="relative border-b border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--info))]/15 text-[rgb(var(--info))]">
            <Shield className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-base font-semibold text-[rgb(var(--text-primary))] sm:text-lg">
              مركز الأدلة والمستندات
            </h2>
            <p className="font-en text-[10px] italic tracking-wider text-[rgb(var(--text-muted))] sm:text-xs">
              Evidence Panel
            </p>
          </div>
        </div>
        <div className="gold-line absolute bottom-0 left-0 right-0" />
      </header>

      {/* ============================================
          مؤشرات سريعة: الدقة + المخاطرة
          ============================================ */}
      <div className="grid grid-cols-2 gap-3 border-b border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-primary))]/30 p-4">
        {/* الدقة */}
        <ConfidenceMeter value={confidence} />

        {/* المخاطرة */}
        <RiskIndicator level={riskLevel} />
      </div>

      {/* ============================================
          التبويبات: استشهادات / تعليلات / فجوات
          ============================================ */}
      <div className="flex border-b border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/20">
        {(["cite", "reasoning", "gap"] as const).map((tab) => {
          const config = EVIDENCE_CONFIG[tab];
          const Icon = config.icon;
          const isActive = activeTab === tab;
          const count = counts[tab];

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="group relative flex flex-1 flex-col items-center gap-1 px-3 py-3 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="evidence-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: config.color }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}

              <div className="flex items-center gap-1.5">
                <Icon
                  className="h-3.5 w-3.5 transition-colors"
                  strokeWidth={2}
                  style={{
                    color: isActive ? config.color : "rgb(var(--text-muted))",
                  }}
                />
                <span
                  className="font-display text-xs font-medium transition-colors"
                  style={{
                    color: isActive
                      ? config.colorBright
                      : "rgb(var(--text-secondary))",
                  }}
                >
                  {config.label}
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold transition-colors"
                  style={{
                    backgroundColor: isActive
                      ? `${config.color}20`
                      : "rgb(var(--bg-tertiary))",
                    color: isActive
                      ? config.colorBright
                      : "rgb(var(--text-muted))",
                  }}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ============================================
          قائمة الأدلة (محتوى التبويب النشط)
          ============================================ */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeItems.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {activeItems.map((item, idx) => (
              <EvidenceCard
                key={`${activeTab}-${idx}`}
                type={activeTab}
                content={item}
                index={idx + 1}
                delay={idx * 0.04}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

// ============================================
// مقياس الدقة
// ============================================
function ConfidenceMeter({ value }: { value: number }) {
  const percentage = Math.min(100, Math.max(0, value));
  const color =
    percentage >= 75
      ? "rgb(var(--success))"
      : percentage >= 50
      ? "rgb(var(--warning))"
      : "rgb(var(--critical))";

  const label =
    percentage >= 75 ? "عالية" : percentage >= 50 ? "متوسطة" : "محدودة";

  return (
    <div className="rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-[rgb(var(--text-muted))]" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[rgb(var(--text-muted))]">
            دقة التحليل
          </span>
        </div>
        <span
          className="font-mono text-xs font-bold"
          style={{ color }}
        >
          {percentage}%
        </span>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-[rgb(var(--bg-tertiary))]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="mt-1.5 text-[10px]" style={{ color }}>
        موثوقية {label}
      </div>
    </div>
  );
}

// ============================================
// مؤشر المخاطرة
// ============================================
function RiskIndicator({
  level,
}: {
  level: "low" | "medium" | "high" | "critical";
}) {
  const config = RISK_CONFIG[level];

  return (
    <div className="rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertTriangle
            className="h-3 w-3"
            style={{ color: config.color }}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[rgb(var(--text-muted))]">
            مستوى المخاطرة
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="font-display text-sm font-bold"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: config.color, opacity: 0.7 }}
        >
          {config.labelEn}
        </span>
      </div>

      {/* مؤشر بصري */}
      <div className="mt-1.5 flex gap-1">
        {[1, 2, 3, 4].map((bar) => {
          const isActive =
            (level === "low" && bar === 1) ||
            (level === "medium" && bar <= 2) ||
            (level === "high" && bar <= 3) ||
            level === "critical";

          return (
            <div
              key={bar}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: isActive
                  ? config.color
                  : "rgb(var(--bg-tertiary))",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// بطاقة دليل واحد
// ============================================
function EvidenceCard({
  type,
  content,
  index,
  delay,
}: {
  type: "cite" | "reasoning" | "gap";
  content: string;
  index: number;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = EVIDENCE_CONFIG[type];
  const Icon = config.icon;
  const isLong = content.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-lg border bg-[rgb(var(--bg-elevated))]/40 transition-all hover:bg-[rgb(var(--bg-elevated))]/70"
      style={{
        borderColor: `${config.color}25`,
      }}
    >
      <div className="flex gap-3 p-3">
        {/* الأيقونة + الرقم */}
        <div className="flex flex-shrink-0 flex-col items-center gap-1">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
            }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <span
            className="font-mono text-[9px] font-bold"
            style={{ color: config.color }}
          >
            #{index}
          </span>
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs leading-relaxed text-[rgb(var(--text-secondary))] ${
              !expanded && isLong ? "line-clamp-3" : ""
            }`}
          >
            {content}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium transition-colors hover:opacity-80"
              style={{ color: config.color }}
            >
              <span>{expanded ? "إخفاء" : "عرض كامل"}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>
          )}
        </div>
      </div>

      {/* خط جانبي ملوّن */}
      <div
        className="absolute right-0 top-0 h-full w-[2px]"
        style={{ backgroundColor: config.color, opacity: 0.4 }}
      />
    </motion.div>
  );
}

// ============================================
// حالة فارغة
// ============================================
function EmptyState({ type }: { type: "cite" | "reasoning" | "gap" }) {
  const config = EVIDENCE_CONFIG[type];
  const Icon = config.icon;

  const messages = {
    cite: "لم تُسجَّل استشهادات في هذا الموجز",
    reasoning: "لم تُسجَّل تعليلات منطقية",
    gap: "لم تُسجَّل فجوات معرفية",
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full opacity-30"
        style={{
          backgroundColor: `${config.color}15`,
          color: config.color,
        }}
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <p className="text-xs text-[rgb(var(--text-muted))]">{messages[type]}</p>
    </div>
  );
}
