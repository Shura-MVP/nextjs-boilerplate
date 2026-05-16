"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  Sparkles,
  FileDown,
  RotateCcw,
} from "lucide-react";
import AmbientBackground from "../components/AmbientBackground";
import ShuraLogo from "../components/ShuraLogo";
import {
  ClassificationBadge,
  type ClassificationLevel,
} from "../components/ClassificationBadge";
import SplitScreenResult from "../components/SplitScreenResult";
import PrintLayout from "../components/PrintLayout";
import {
  generatePDF,
  generateReferenceNumber,
  type PDFData,
} from "../components/PDFExport";

// ============================================
// أنواع البيانات
// ============================================
interface DeliberationPayload {
  query: string;
  classification: ClassificationLevel;
  agentIds: string[];
  timestamp: string;
}

interface DeliberationResult {
  success: boolean;
  timestamp: string;
  query: string;
  classification: ClassificationLevel;
  synthesis: {
    text: string;
    confidence: number;
    riskLevel: "low" | "medium" | "high" | "critical";
  };
  evidence: {
    citations: string[];
    reasoning: string[];
    gaps: string[];
  };
  stats: {
    agentsInvoked: number;
    substantiveCount: number;
    adversarialCount: number;
    metacognitiveCount: number;
    totalCitations: number;
    totalReasoning: number;
    totalGaps: number;
    validation: {
      valid: boolean;
      unmarkedClaims: number;
      totalSentences: number;
      confidence: number;
    };
  };
}

// ============================================
// رسائل مراحل المداولة
// ============================================
const PROGRESS_STAGES = [
  { label: "استقبال السؤال", duration: 3000 },
  { label: "تحليل متعدد الأبعاد", duration: 12000 },
  { label: "مراجعة الأدلة والمصادر", duration: 8000 },
  { label: "اختبار الافتراضات", duration: 8000 },
  { label: "موازنة وجهات النظر", duration: 6000 },
  { label: "تأليف الموجز النهائي", duration: 10000 },
];

// ============================================
// المكوّن الرئيسي
// ============================================
export default function DeliberatePage() {
  const router = useRouter();

  const [payload, setPayload] = useState<DeliberationPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<DeliberationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [referenceNumber] = useState(() => generateReferenceNumber());
  const [isExporting, setIsExporting] = useState(false);

  // ============================================
  // جلب البيانات من sessionStorage
  // ============================================
  useEffect(() => {
    const stored = sessionStorage.getItem("shura-deliberation");

    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const parsed: DeliberationPayload = JSON.parse(stored);
      setPayload(parsed);
    } catch {
      router.push("/");
    }
  }, [router]);

  // ============================================
  // تشغيل مراحل التقدّم
  // ============================================
  useEffect(() => {
    if (!isLoading) return;

    let currentIdx = 0;
    const advance = () => {
      currentIdx = (currentIdx + 1) % PROGRESS_STAGES.length;
      setStageIndex(currentIdx);
    };

    const interval = setInterval(advance, 6500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // ============================================
  // استدعاء API المداولة
  // ============================================
  useEffect(() => {
    if (!payload) return;

    const runDeliberation = async () => {
      try {
        const response = await fetch("/api/deliberate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: payload.query,
            classification: payload.classification,
            agentIds: payload.agentIds,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "فشلت المداولة");
        }

        const data: DeliberationResult = await response.json();
        setResult(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    runDeliberation();
  }, [payload]);

  // ============================================
  // مداولة جديدة
  // ============================================
  const handleNewDeliberation = () => {
    sessionStorage.removeItem("shura-deliberation");
    router.push("/");
  };

  // ============================================
  // تصدير PDF
  // ============================================
  const handleExportPDF = async () => {
    if (!result || !payload) return;

    setIsExporting(true);
    try {
      const pdfData: PDFData = {
        referenceNumber,
        timestamp: result.timestamp,
        classification: payload.classification,
        question: payload.query,
        summaryText: result.synthesis.text,
        citations: result.evidence.citations,
        reasoning: result.evidence.reasoning,
        gaps: result.evidence.gaps,
        confidence: result.synthesis.confidence,
        riskLevel: result.synthesis.riskLevel,
        agentsInvoked: result.stats.agentsInvoked,
      };

      await generatePDF(pdfData);
    } catch (err) {
      console.error(err);
      alert("تعذّر توليد التقرير. حاول مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <AmbientBackground />

      <main className="relative z-10 min-h-screen">
        {/* ============================================
            الترويسة العلوية
            ============================================ */}
        <header className="sticky top-0 z-40 border-b border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-primary))]/85 backdrop-blur-xl no-print">
          <div className="container-wide flex h-20 items-center justify-between sm:h-24">
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewDeliberation}
                className="group flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 px-3 py-2 text-sm text-[rgb(var(--text-secondary))] backdrop-blur-sm transition-all hover:border-[rgb(var(--gold-base))]/40 hover:text-[rgb(var(--gold-bright))]"
                aria-label="مداولة جديدة"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  strokeWidth={2}
                />
                <span className="hidden sm:inline">عودة</span>
              </button>

              <div className="h-8 w-px bg-[rgb(var(--border-subtle))]/20" />

              <ShuraLogo size="sm" />
            </div>

            {payload && (
              <ClassificationBadge
                level={payload.classification}
                variant="compact"
              />
            )}
          </div>
        </header>

        {/* ============================================
            القسم الرئيسي
            ============================================ */}
        <div className="container-wide py-8 sm:py-12">
          {/* ============================================
              عرض السؤال
              ============================================ */}
          {payload && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 sm:mb-12"
            >
              <div className="heading-bar mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--gold-base))]">
                  السؤال الاستراتيجي
                </span>
              </div>
              <h1 className="font-display text-xl leading-relaxed text-[rgb(var(--text-primary))] sm:text-2xl lg:text-3xl">
                {payload.query}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[rgb(var(--text-muted))]">
                <span className="font-mono">{referenceNumber}</span>
                <span className="opacity-50">•</span>
                <span>{formatTime(payload.timestamp)}</span>
                <span className="opacity-50">•</span>
                <span>
                  {payload.agentIds.length} وكيل مُستدعى
                </span>
              </div>
            </motion.section>
          )}

          {/* ============================================
              حالة التحميل
              ============================================ */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="panel-sovereign p-8 sm:p-12 lg:p-16"
              >
                <div className="mx-auto max-w-2xl space-y-8 text-center">
                  {/* الأيقونة المتحركة */}
                  <div className="relative mx-auto h-20 w-20">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[rgb(var(--gold-base))]/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-[rgb(var(--gold-base))]"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-[rgb(var(--gold-bright))] animate-pulse-sovereign" />
                    </div>
                  </div>

                  {/* رسالة المرحلة */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stageIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-2"
                    >
                      <p className="font-display text-xl text-[rgb(var(--text-primary))] sm:text-2xl">
                        {PROGRESS_STAGES[stageIndex].label}
                      </p>
                      <p className="font-en text-sm italic text-[rgb(var(--gold-base))]">
                        Strategic Deliberation in Progress...
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* شريط مراحل */}
                  <div className="flex items-center justify-center gap-1.5">
                    {PROGRESS_STAGES.map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="h-1 rounded-full bg-[rgb(var(--gold-base))]"
                        animate={{
                          width: idx === stageIndex ? 32 : 8,
                          opacity: idx <= stageIndex ? 1 : 0.2,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    هذه المداولة تستغرق عادةً بين دقيقة إلى ثلاث دقائق
                  </p>
                </div>
              </motion.div>
            )}

            {/* ============================================
                حالة الخطأ
                ============================================ */}
            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="panel-sovereign p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--critical))]/15">
                  <AlertCircle
                    className="h-7 w-7 text-[rgb(var(--critical))]"
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="mb-2 font-display text-lg font-semibold text-[rgb(var(--text-primary))]">
                  تعذّرت إتمام المداولة
                </h2>
                <p className="mb-6 text-sm text-[rgb(var(--text-muted))]">
                  {error}
                </p>
                <button
                  onClick={handleNewDeliberation}
                  className="btn-sovereign"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                  <span>المحاولة مرة أخرى</span>
                </button>
              </motion.div>
            )}

            {/* ============================================
                عرض النتائج
                ============================================ */}
            {result && payload && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* الشاشة المنقسمة */}
                <SplitScreenResult
                  summaryText={result.synthesis.text}
                  citations={result.evidence.citations}
                  reasoning={result.evidence.reasoning}
                  gaps={result.evidence.gaps}
                  confidence={result.synthesis.confidence}
                  riskLevel={result.synthesis.riskLevel}
                  referenceNumber={referenceNumber}
                  timestamp={result.timestamp}
                />

                {/* أزرار الإجراءات */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="no-print flex flex-col items-center justify-center gap-3 border-t border-[rgb(var(--border-subtle))]/10 pt-8 sm:flex-row"
                >
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="btn-sovereign w-full sm:w-auto"
                  >
                    {isExporting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        <span>جارٍ التوليد</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4" strokeWidth={2} />
                        <span>تصدير PDF</span>
                      </>
                    )}
                  </button>

                  <PrintLayout
                    referenceNumber={referenceNumber}
                    timestamp={result.timestamp}
                    classification={payload.classification}
                    question={payload.query}
                    summaryText={result.synthesis.text}
                    citations={result.evidence.citations}
                    reasoning={result.evidence.reasoning}
                    gaps={result.evidence.gaps}
                    confidence={result.synthesis.confidence}
                    agentsInvoked={result.stats.agentsInvoked}
                  />

                  <button
                    onClick={handleNewDeliberation}
                    className="btn-ghost w-full sm:w-auto"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={2} />
                    <span>مداولة جديدة</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================
            التذييل
            ============================================ */}
        <footer className="no-print relative mt-auto border-t border-[rgb(var(--border-subtle))]/10 py-6">
          <div className="container-wide">
            <p className="text-center font-display text-xs text-[rgb(var(--text-muted))]">
              نموذج أوّلي قابل للتجربة لـ مركز دعم اتخاذ القرار
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

// ============================================
// تنسيق التاريخ
// ============================================
function formatTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
