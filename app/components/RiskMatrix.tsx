"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Grid3x3, Info } from "lucide-react";

// ============================================
// أنواع البيانات
// ============================================
export interface RiskItem {
  id: string;
  label: string;
  probability: 1 | 2 | 3 | 4 | 5; // 1 = نادر، 5 = شبه مؤكد
  impact: 1 | 2 | 3 | 4 | 5; // 1 = ضئيل، 5 = كارثي
  category?: string;
  notes?: string;
}

interface RiskMatrixProps {
  risks: RiskItem[];
  title?: string;
}

// ============================================
// تصنيفات الخطورة
// ============================================
const RISK_LEVELS = {
  negligible: {
    label: "ضئيلة",
    color: "rgb(var(--success))",
    range: [1, 4],
  },
  low: {
    label: "منخفضة",
    color: "rgb(var(--info))",
    range: [5, 8],
  },
  moderate: {
    label: "متوسطة",
    color: "rgb(var(--warning))",
    range: [9, 14],
  },
  high: {
    label: "مرتفعة",
    color: "rgb(var(--critical))",
    range: [15, 19],
  },
  critical: {
    label: "حرجة",
    color: "rgb(var(--classification-topsecret))",
    range: [20, 25],
  },
};

// ============================================
// المكوّن الرئيسي
// ============================================
export default function RiskMatrix({
  risks,
  title = "مصفوفة المخاطر",
}: RiskMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

  // ============================================
  // تحديد مستوى الخطورة من الدرجة
  // ============================================
  const getRiskLevel = (score: number) => {
    if (score <= 4) return RISK_LEVELS.negligible;
    if (score <= 8) return RISK_LEVELS.low;
    if (score <= 14) return RISK_LEVELS.moderate;
    if (score <= 19) return RISK_LEVELS.high;
    return RISK_LEVELS.critical;
  };

  // ============================================
  // تجميع المخاطر حسب الخلايا
  // ============================================
  const getRisksInCell = (probability: number, impact: number) => {
    return risks.filter(
      (r) => r.probability === probability && r.impact === impact
    );
  };

  // ============================================
  // تسميات المحاور
  // ============================================
  const probabilityLabels = [
    "نادر",
    "غير محتمل",
    "محتمل",
    "مرجّح",
    "شبه مؤكد",
  ];

  const impactLabels = ["ضئيل", "ثانوي", "معتدل", "كبير", "كارثي"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel-sovereign overflow-hidden"
    >
      {/* ============================================
          الرأس
          ============================================ */}
      <header className="border-b border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--critical))]/15 text-[rgb(var(--critical))]">
              <Grid3x3 className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-display text-base font-semibold text-[rgb(var(--text-primary))] sm:text-lg">
                {title}
              </h2>
              <p className="font-en text-[10px] italic tracking-wider text-[rgb(var(--text-muted))] sm:text-xs">
                Risk Assessment Matrix
              </p>
            </div>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))]">
            {risks.length} {risks.length === 1 ? "خطر" : "مخاطر"}
          </span>
        </div>
      </header>

      {/* ============================================
          المصفوفة 5x5
          ============================================ */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="flex">
              {/* عمود تسميات الاحتمال (يمين) */}
              <div className="flex flex-col">
                {/* فراغ زاوية */}
                <div className="h-10" />

                {/* تسمية المحور العمودي */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute -right-2 top-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap font-display text-xs font-semibold text-[rgb(var(--text-secondary))]">
                    الاحتمال →
                  </span>
                </div>

                {[5, 4, 3, 2, 1].map((p) => (
                  <div
                    key={`p-label-${p}`}
                    className="flex h-16 w-20 items-center justify-end pl-2 pr-4 text-[10px]"
                  >
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono font-bold text-[rgb(var(--gold-bright))]">
                        {p}
                      </span>
                      <span className="text-[9px] text-[rgb(var(--text-muted))]">
                        {probabilityLabels[p - 1]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* جسم المصفوفة */}
              <div className="flex-1">
                {/* العنوان العلوي (الأثر) */}
                <div className="mb-2 text-center">
                  <span className="font-display text-xs font-semibold text-[rgb(var(--text-secondary))]">
                    ← الأثر
                  </span>
                </div>

                {/* الصفوف من 5 إلى 1 */}
                {[5, 4, 3, 2, 1].map((probability) => (
                  <div key={`row-${probability}`} className="flex">
                    {[1, 2, 3, 4, 5].map((impact) => {
                      const score = probability * impact;
                      const level = getRiskLevel(score);
                      const cellRisks = getRisksInCell(probability, impact);
                      const cellId = `${probability}-${impact}`;
                      const isHovered = hoveredCell === cellId;

                      return (
                        <button
                          key={cellId}
                          type="button"
                          onMouseEnter={() => setHoveredCell(cellId)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => {
                            if (cellRisks.length > 0) {
                              setSelectedRisk(cellRisks[0]);
                            }
                          }}
                          className={`relative flex h-16 flex-1 items-center justify-center border border-[rgb(var(--bg-primary))] transition-all duration-300 ${
                            cellRisks.length > 0
                              ? "cursor-pointer"
                              : "cursor-default"
                          }`}
                          style={{
                            backgroundColor: `${level.color}${
                              isHovered ? "40" : "25"
                            }`,
                          }}
                          aria-label={`خلية ${cellId} — ${cellRisks.length} مخاطرة`}
                        >
                          {/* عدد المخاطر في الخلية */}
                          {cellRisks.length > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.1 * (probability + impact),
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="relative flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold"
                              style={{
                                backgroundColor: level.color,
                                color: "rgb(var(--bg-primary))",
                                boxShadow: `0 0 16px ${level.color}80`,
                              }}
                            >
                              {cellRisks.length}
                            </motion.div>
                          )}

                          {/* درجة الخلية في الزاوية */}
                          <span className="absolute bottom-1 left-1 font-mono text-[9px] opacity-40">
                            {score}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* تسميات الأثر (الأسفل) */}
                <div className="mt-1 flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={`i-label-${i}`}
                      className="flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px]"
                    >
                      <span className="font-mono font-bold text-[rgb(var(--gold-bright))]">
                        {i}
                      </span>
                      <span className="text-[9px] text-[rgb(var(--text-muted))]">
                        {impactLabels[i - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            مفتاح الألوان
            ============================================ */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Object.entries(RISK_LEVELS).map(([key, level]) => (
            <div
              key={key}
              className="flex items-center gap-2 rounded-md border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/30 px-2.5 py-1.5"
            >
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                style={{ backgroundColor: level.color }}
              />
              <span className="text-[10px] text-[rgb(var(--text-secondary))]">
                {level.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          قائمة المخاطر المسجّلة
          ============================================ */}
      {risks.length > 0 && (
        <div className="border-t border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-primary))]/30 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[rgb(var(--warning))]" />
            <h3 className="font-display text-sm font-semibold text-[rgb(var(--text-primary))]">
              المخاطر المسجّلة ({risks.length})
            </h3>
          </div>

          <div className="space-y-2">
            {risks.map((risk, idx) => {
              const score = risk.probability * risk.impact;
              const level = getRiskLevel(score);

              return (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedRisk(risk)}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/40 p-3 transition-all hover:border-[rgb(var(--border-subtle))]/25 hover:bg-[rgb(var(--bg-elevated))]/70"
                >
                  {/* مؤشر الخطورة */}
                  <div
                    className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-md font-mono"
                    style={{
                      backgroundColor: `${level.color}20`,
                      color: level.color,
                    }}
                  >
                    <span className="text-sm font-bold">{score}</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-70">
                      {level.label}
                    </span>
                  </div>

                  {/* التفاصيل */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-[rgb(var(--text-primary))] line-clamp-1">
                      {risk.label}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-[rgb(var(--text-muted))]">
                      <span>
                        احتمال:{" "}
                        <span className="text-[rgb(var(--text-secondary))]">
                          {probabilityLabels[risk.probability - 1]}
                        </span>
                      </span>
                      <span className="opacity-50">•</span>
                      <span>
                        أثر:{" "}
                        <span className="text-[rgb(var(--text-secondary))]">
                          {impactLabels[risk.impact - 1]}
                        </span>
                      </span>
                      {risk.category && (
                        <>
                          <span className="opacity-50">•</span>
                          <span className="text-[rgb(var(--gold-base))]">
                            {risk.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {risk.notes && (
                    <Info className="h-4 w-4 flex-shrink-0 text-[rgb(var(--text-muted))] opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================
          تفاصيل الخطر المحدد (Modal بسيط)
          ============================================ */}
      {selectedRisk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedRisk(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--bg-primary))]/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="panel-elevated max-w-md w-full p-6"
          >
            <h3 className="mb-3 font-display text-lg font-semibold text-[rgb(var(--gold-bright))]">
              {selectedRisk.label}
            </h3>

            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  الاحتمال
                </p>
                <p className="mt-1 font-display text-base font-semibold text-[rgb(var(--text-primary))]">
                  {probabilityLabels[selectedRisk.probability - 1]}
                </p>
              </div>
              <div className="rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  الأثر
                </p>
                <p className="mt-1 font-display text-base font-semibold text-[rgb(var(--text-primary))]">
                  {impactLabels[selectedRisk.impact - 1]}
                </p>
              </div>
            </div>

            {selectedRisk.notes && (
              <p className="mb-4 text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
                {selectedRisk.notes}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelectedRisk(null)}
              className="btn-ghost w-full"
            >
              إغلاق
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
