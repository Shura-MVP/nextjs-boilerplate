"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import KnowledgeFlow from "../components/KnowledgeFlow";

// ============================================
// أنواع البيانات
// ============================================
interface DeliberationResult {
  success: boolean;
  timestamp: string;
  query: string;
  synthesis: {
    text: string;
    citations: string[];
    gaps: string[];
    validation: {
      valid: boolean;
      unmarkedClaims: number;
      totalSentences: number;
    };
  };
  stats: {
    agentsInvoked: number;
    totalCitations: number;
    identifiedGaps: number;
  };
}

// ============================================
// رسائل التقدّم (لا تكشف عن الأسرار الداخلية)
// ============================================
const PROGRESS_MESSAGES = [
  "جارٍ استقبال السؤال...",
  "تحليل متعدد الأبعاد...",
  "مراجعة الأدلة والمصادر...",
  "اختبار الافتراضات...",
  "موازنة وجهات النظر...",
  "تأليف الموجز النهائي...",
];

export default function DeliberatePage() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<DeliberationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressIndex, setProgressIndex] = useState(0);

  // ============================================
  // جلب السؤال من sessionStorage
  // ============================================
  useEffect(() => {
    const savedQuery = sessionStorage.getItem("shura-query");
    
    if (!savedQuery) {
      router.push("/");
      return;
    }

    setQuery(savedQuery);
  }, [router]);

  // ============================================
  // تشغيل رسائل التقدّم
  // ============================================
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // ============================================
  // استدعاء المداولة
  // ============================================
  useEffect(() => {
    if (!query) return;

    const runDeliberation = async () => {
      try {
        const response = await fetch("/api/deliberate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
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
  }, [query]);

  // ============================================
  // العودة للصفحة الرئيسية
  // ============================================
  const handleNewQuery = () => {
    sessionStorage.removeItem("shura-query");
    router.push("/");
  };

  return (
    <main className="relative min-h-screen">
      {/* ============================================
          الترويسة العلوية
          ============================================ */}
      <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgba(var(--background),0.85)] backdrop-blur-md">
        <div className="container-main flex h-16 items-center justify-between sm:h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewQuery}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[rgb(var(--muted-foreground))] transition-colors hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--foreground))]"
              aria-label="مداولة جديدة"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span className="hidden sm:inline">مداولة جديدة</span>
            </button>

            <div className="h-6 w-px bg-[rgb(var(--border))]" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--surface))]">
                <span className="font-display text-xs font-bold text-[rgb(var(--accent))]">
                  ش
                </span>
              </div>
              <span className="font-display text-sm font-semibold sm:text-base">
                شــورى
              </span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* ============================================
          القسم الرئيسي
          ============================================ */}
      <div className="container-main py-8 sm:py-12">
        {/* ============================================
            عرض السؤال الأصلي
            ============================================ */}
        {query && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <div className="heading-with-bar mb-3">
              <p className="text-sm font-medium text-[rgb(var(--accent))]">
                السؤال الاستراتيجي
              </p>
            </div>
            <h1 className="font-display text-xl leading-relaxed text-[rgb(var(--foreground))] sm:text-2xl lg:text-3xl">
              {query}
            </h1>
          </motion.section>
        )}

        {/* ============================================
            حالة التحميل — الأنميشن + رسائل التقدّم
            ============================================ */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* أنميشن تدفق المعرفة */}
              <div className="relative mb-8 h-64 overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] sm:h-80">
                <KnowledgeFlow />
              </div>

              {/* رسائل التقدّم */}
              <div className="space-y-4 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={progressIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="font-display text-lg text-[rgb(var(--foreground))] sm:text-xl"
                  >
                    {PROGRESS_MESSAGES[progressIndex]}
                  </motion.p>
                </AnimatePresence>

                {/* مؤشرات النقاط */}
                <div className="flex items-center justify-center gap-2">
                  {PROGRESS_MESSAGES.map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="h-1 rounded-full bg-[rgb(var(--accent))]"
                      animate={{
                        width: idx === progressIndex ? 24 : 8,
                        opacity: idx === progressIndex ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  ))}
                </div>

                <p className="text-sm text-[rgb(var(--muted))]">
                  هذه العملية تستغرق عادة بين 30 و 60 ثانية
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card-gold border-red-300 bg-red-50/30 text-center dark:border-red-900 dark:bg-red-950/20"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="mb-2 font-display text-lg font-semibold">
                تعذّرت إتمام المداولة
              </h2>
              <p className="mb-6 text-sm text-[rgb(var(--muted-foreground))]">
                {error}
              </p>
              <button
                onClick={handleNewQuery}
                className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-5 py-2 text-sm font-medium text-[rgb(var(--accent-foreground))] transition-all hover:shadow-lg"
              >
                المحاولة مرة أخرى
              </button>
            </motion.div>
          )}

          {/* ============================================
              عرض النتائج
              ============================================ */}
          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* ============================================
                  المؤشرات السريعة
                  ============================================ */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3 sm:gap-4"
              >
                <StatCard
                  label="استشهادات"
                  value={result.stats.totalCitations}
                  icon="anchor"
                />
                <StatCard
                  label="فجوات معرفية"
                  value={result.stats.identifiedGaps}
                  icon="search"
                />
                <StatCard
                  label="موثوقية"
                  value={result.synthesis.validation.valid ? "عالية" : "متوسطة"}
                  icon="shield"
                  isText
                />
              </motion.div>

              {/* ============================================
                  الموجز الاستراتيجي
                  ============================================ */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="heading-with-bar mb-6">
                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                    الموجز الاستراتيجي
                  </h2>
                </div>

                <div className="card-gold prose-content">
                  <SynthesisRenderer text={result.synthesis.text} />
                </div>
              </motion.section>

              {/* ============================================
                  أزرار الإجراءات
                  ============================================ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row"
              >
                <button
                  onClick={handleNewQuery}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-medium text-[rgb(var(--accent-foreground))] transition-all hover:shadow-lg hover:shadow-[rgba(181,136,56,0.3)] sm:w-auto"
                >
                  <span>مداولة جديدة</span>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-6 py-3 text-sm font-medium text-[rgb(var(--foreground))] transition-all hover:border-[rgb(var(--accent))] sm:w-auto"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>طباعة الموجز</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ============================================
// بطاقة إحصائية
// ============================================
function StatCard({
  label,
  value,
  icon,
  isText = false,
}: {
  label: string;
  value: string | number;
  icon: string;
  isText?: boolean;
}) {
  return (
    <div className="card-gold text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--surface-soft))]">
        <StatIcon type={icon} />
      </div>
      <div
        className={`font-display ${
          isText ? "text-base" : "text-2xl"
        } font-semibold text-gold-gradient`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))] sm:text-sm">
        {label}
      </div>
    </div>
  );
}

// ============================================
// أيقونات الإحصاءات
// ============================================
function StatIcon({ type }: { type: string }) {
  const props = {
    className: "h-4 w-4 text-[rgb(var(--accent))]",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "anchor":
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
}

// ============================================
// عرض الموجز مع تنسيق الاستشهادات
// ============================================
function SynthesisRenderer({ text }: { text: string }) {
  // تنظيف وسوم [cite:] و[reasoning:] و[gap:] وتحويلها إلى عناصر مرئية
  const parts = text.split(/(\[(?:cite|reasoning|gap):[^\]]+\])/g);

  return (
    <div className="space-y-4 text-[rgb(var(--foreground))] leading-relaxed">
      {parts.map((part, idx) => {
        const citeMatch = part.match(/^\[cite:([^\]]+)\]$/);
        const reasoningMatch = part.match(/^\[reasoning:([^\]]+)\]$/);
        const gapMatch = part.match(/^\[gap:([^\]]+)\]$/);

        if (citeMatch) {
          return (
            <sup
              key={idx}
              className="mx-1 inline-flex items-center gap-1 rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--surface-soft))] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--accent))]"
              title={citeMatch[1]}
            >
              ⚓ {citeMatch[1].length > 30 ? citeMatch[1].slice(0, 30) + "..." : citeMatch[1]}
            </sup>
          );
        }

        if (reasoningMatch) {
          return (
            <sup
              key={idx}
              className="mx-1 inline-flex items-center gap-1 rounded-full border border-[rgb(var(--primary))] bg-[rgb(var(--surface-soft))] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--primary))]"
              title={reasoningMatch[1]}
            >
              ⚖️ تعليل
            </sup>
          );
        }

        if (gapMatch) {
          return (
            <sup
              key={idx}
              className="mx-1 inline-flex items-center gap-1 rounded-full border border-[rgb(var(--muted))] bg-[rgb(var(--surface-soft))] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--muted-foreground))]"
              title={gapMatch[1]}
            >
              ⚠️ فجوة
            </sup>
          );
        }

        // النص العادي — تحويل الأسطر الجديدة لفقرات
        return part.split("\n\n").map((paragraph, pIdx) => {
          if (!paragraph.trim()) return null;
          
          // كشف العناوين (تبدأ بـ # أو رقم)
          if (paragraph.match(/^#{1,3}\s/)) {
            const level = paragraph.match(/^(#{1,3})/)?.[1].length || 2;
            const content = paragraph.replace(/^#{1,3}\s/, "");
            const Tag = `h${level + 1}` as keyof JSX.IntrinsicElements;
            return (
              <Tag
                key={`${idx}-${pIdx}`}
                className="mt-6 font-display font-semibold text-[rgb(var(--foreground))]"
              >
                {content}
              </Tag>
            );
          }

          // كشف القوائم
          if (paragraph.match(/^[-*]\s/m) || paragraph.match(/^\d+\.\s/m)) {
            const items = paragraph.split("\n").filter((line) => line.trim());
            return (
              <ul
                key={`${idx}-${pIdx}`}
                className="space-y-2 pr-6 marker:text-[rgb(var(--accent))]"
              >
                {items.map((item, iIdx) => (
                  <li key={iIdx} className="list-disc">
                    {item.replace(/^[-*]\s|^\d+\.\s/, "")}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={`${idx}-${pIdx}`} className="text-base sm:text-lg">
              {paragraph}
            </p>
          );
        });
      })}
    </div>
  );
}
