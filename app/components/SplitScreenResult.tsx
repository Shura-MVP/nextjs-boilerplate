"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Maximize2, Minimize2, LayoutPanelLeft } from "lucide-react";
import ExecutiveSummary from "./ExecutiveSummary";
import EvidencePanel from "./EvidencePanel";

interface SplitScreenResultProps {
  summaryText: string;
  citations: string[];
  reasoning: string[];
  gaps: string[];
  confidence?: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
  referenceNumber?: string;
  timestamp?: string;
}

// ============================================
// المكوّن الرئيسي — شاشة منقسمة
// ============================================
export default function SplitScreenResult({
  summaryText,
  citations,
  reasoning,
  gaps,
  confidence = 75,
  riskLevel = "medium",
  referenceNumber,
  timestamp,
}: SplitScreenResultProps) {
  const [focusMode, setFocusMode] = useState<"split" | "summary" | "evidence">(
    "split"
  );

  return (
    <div className="space-y-4">
      {/* ============================================
          شريط التحكم — أوضاع العرض
          ============================================ */}
      <ViewModeSwitcher
        mode={focusMode}
        onChange={setFocusMode}
      />

      {/* ============================================
          المحتوى المنقسم
          ============================================ */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`grid gap-4 ${
          focusMode === "split"
            ? "grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
            : "grid-cols-1"
        }`}
        style={{ minHeight: "70vh" }}
      >
        {/* ============================================
            الخلاصة الاستراتيجية (يمين)
            ============================================ */}
        {(focusMode === "split" || focusMode === "summary") && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <ExecutiveSummary
              text={summaryText}
              referenceNumber={referenceNumber}
              timestamp={timestamp}
            />
          </motion.div>
        )}

        {/* ============================================
            مركز الأدلة (يسار)
            ============================================ */}
        {(focusMode === "split" || focusMode === "evidence") && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <EvidencePanel
              citations={citations}
              reasoning={reasoning}
              gaps={gaps}
              confidence={confidence}
              riskLevel={riskLevel}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================
// مُبدِّل أوضاع العرض
// ============================================
function ViewModeSwitcher({
  mode,
  onChange,
}: {
  mode: "split" | "summary" | "evidence";
  onChange: (mode: "split" | "summary" | "evidence") => void;
}) {
  const modes = [
    {
      value: "split" as const,
      label: "عرض منقسم",
      labelEn: "Split View",
      icon: LayoutPanelLeft,
    },
    {
      value: "summary" as const,
      label: "تركيز على الخلاصة",
      labelEn: "Summary Focus",
      icon: Maximize2,
    },
    {
      value: "evidence" as const,
      label: "تركيز على الأدلة",
      labelEn: "Evidence Focus",
      icon: Minimize2,
    },
  ];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))]">
        <span className="h-1 w-1 rounded-full bg-[rgb(var(--gold-base))] animate-pulse-sovereign" />
        <span>المحرّك المعرفي السيادي</span>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 p-1 backdrop-blur-sm">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.value;

          return (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange(m.value)}
              className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "text-[rgb(var(--bg-primary))]"
                  : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]"
              }`}
              title={m.labelEn}
              aria-label={m.label}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="view-mode-indicator"
                  className="absolute inset-0 rounded-md bg-sovereign-gradient"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" strokeWidth={2} />
              <span className="relative hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
