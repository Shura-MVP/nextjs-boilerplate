"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X, FileText } from "lucide-react";
import type { ClassificationLevel } from "./ClassificationBadge";

// ============================================
// أنواع البيانات
// ============================================
interface PrintLayoutProps {
  referenceNumber: string;
  timestamp: string;
  classification: ClassificationLevel;
  question: string;
  summaryText: string;
  citations: string[];
  reasoning: string[];
  gaps: string[];
  confidence: number;
  agentsInvoked: number;
}

// ============================================
// تسميات التصنيف
// ============================================
const CLASSIFICATION_AR: Record<ClassificationLevel, string> = {
  public: "عــام",
  internal: "للاستخدام الداخلي",
  confidential: "مُقيَّـد",
  secret: "ســـري",
  topsecret: "ســري للغاية",
};

const CLASSIFICATION_EN: Record<ClassificationLevel, string> = {
  public: "PUBLIC",
  internal: "INTERNAL USE",
  confidential: "CONFIDENTIAL",
  secret: "SECRET",
  topsecret: "TOP SECRET",
};

// ============================================
// المكوّن الرئيسي
// ============================================
export default function PrintLayout({
  referenceNumber,
  timestamp,
  classification,
  question,
  summaryText,
  citations,
  reasoning,
  gaps,
  confidence,
  agentsInvoked,
}: PrintLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ============================================
  // التأكد من التحميل في المتصفح (Hydration-safe)
  // ============================================
  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================
  // قفل التمرير عند فتح المعاينة
  // ============================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ============================================
  // الإغلاق بمفتاح Escape
  // ============================================
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // ============================================
  // الطباعة
  // ============================================
  const handlePrint = () => {
    window.print();
  };

  // ============================================
  // تنسيق التاريخ
  // ============================================
  const formattedDate = (() => {
    try {
      return new Date(timestamp).toLocaleString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  })();

  // ============================================
  // محتوى المعاينة (يُحقن في document.body عبر Portal)
  // ============================================
  const previewContent = (
    <div
      data-shura-print-portal
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="معاينة التقرير"
    >
      {/* أنماط الطباعة (تُحقن مع البوابة) */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body > *:not([data-shura-print-portal]) {
            display: none !important;
          }
          [data-shura-print-portal] {
            position: static !important;
            background: white !important;
            backdrop-filter: none !important;
            overflow: visible !important;
          }
          [data-shura-print-portal] .shura-print-toolbar {
            display: none !important;
          }
          [data-shura-print-portal] .shura-print-paper {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* ============================================
          شريط الأدوات (يُخفى عند الطباعة)
          ============================================ */}
      <div className="shura-print-toolbar sticky top-0 z-10 border-b border-[rgb(var(--border-subtle))]/20 bg-[rgb(var(--bg-primary))]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))]/20 bg-[rgb(var(--bg-elevated))]/40 px-3 py-2 text-sm text-[rgb(var(--text-secondary))] backdrop-blur-sm transition-all hover:border-[rgb(var(--gold-base))]/40 hover:text-[rgb(var(--gold-bright))]"
            aria-label="إغلاق المعاينة"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            <span>إغلاق</span>
          </button>

          <div className="hidden sm:block">
            <p className="font-display text-sm text-[rgb(var(--text-muted))]">
              معاينة التقرير قبل الطباعة
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-[rgb(var(--gold-base))] bg-gradient-to-b from-[rgb(var(--gold-base))] to-[rgb(var(--gold-deep))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg-primary))] shadow-md transition-all hover:brightness-110"
            aria-label="طباعة أو حفظ PDF"
          >
            <Printer className="h-4 w-4" strokeWidth={2.5} />
            <span>طباعة / حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* ============================================
          ورقة التقرير (التنسيق الرسمي)
          ============================================ */}
      <div
        dir="rtl"
        className="shura-print-paper mx-auto my-6 max-w-4xl bg-white px-10 py-12 text-[#1A1D24] shadow-2xl sm:my-10"
        style={{
          fontFamily:
            "var(--font-tajawal), 'Tajawal', system-ui, sans-serif",
        }}
      >
        {/* ============================================
            الترويسة الرسمية
            ============================================ */}
        <header className="mb-10 border-b-[3px] border-double border-[#BFA15A] pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1
                className="text-3xl font-bold leading-tight text-[#1A1D24]"
                style={{
                  fontFamily:
                    "var(--font-reem-kufi), 'Reem Kufi', serif",
                }}
              >
                شــورى
              </h1>
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#8E7333]"
                style={{
                  fontFamily:
                    "var(--font-mono), 'JetBrains Mono', monospace",
                }}
              >
                SHURA MAG · Strategic Deliberation System
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[#574420]">
                المحرّك المعرفي السيادي لـ مركز دعم اتخاذ القرار
              </p>
            </div>

            {/* شارة التصنيف */}
            <div className="flex-shrink-0">
              <div className="rounded-md border-[2px] border-[#8E7333] bg-[#F5EFD9] px-4 py-2 text-center">
                <p
                  className="text-sm font-bold text-[#574420]"
                  style={{
                    fontFamily:
                      "var(--font-reem-kufi), 'Reem Kufi', serif",
                  }}
                >
                  {CLASSIFICATION_AR[classification]}
                </p>
                <p
                  className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[#8E7333]"
                  style={{
                    fontFamily:
                      "var(--font-mono), 'JetBrains Mono', monospace",
                  }}
                >
                  {CLASSIFICATION_EN[classification]}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================
            بطاقة معلومات التقرير
            ============================================ */}
        <section className="mb-8">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-[#E8DCAE]">
                <td className="w-1/3 bg-[#F5EFD9] px-4 py-2.5 font-semibold text-[#574420]">
                  الرقم المرجعي
                </td>
                <td
                  className="px-4 py-2.5 text-[#1A1D24]"
                  style={{
                    fontFamily:
                      "var(--font-mono), 'JetBrains Mono', monospace",
                  }}
                >
                  {referenceNumber}
                </td>
              </tr>
              <tr className="border-b border-[#E8DCAE]">
                <td className="bg-[#F5EFD9] px-4 py-2.5 font-semibold text-[#574420]">
                  التاريخ والوقت
                </td>
                <td className="px-4 py-2.5 text-[#1A1D24]">
                  {formattedDate}
                </td>
              </tr>
              <tr className="border-b border-[#E8DCAE]">
                <td className="bg-[#F5EFD9] px-4 py-2.5 font-semibold text-[#574420]">
                  عدد الوكلاء المُستدعَين
                </td>
                <td className="px-4 py-2.5 text-[#1A1D24]">
                  {agentsInvoked} وكيل
                </td>
              </tr>
              <tr>
                <td className="bg-[#F5EFD9] px-4 py-2.5 font-semibold text-[#574420]">
                  دقة التحليل
                </td>
                <td className="px-4 py-2.5 text-[#1A1D24]">
                  <span className="font-semibold">{confidence}%</span>
                  <span className="ms-2 text-xs text-[#8E7333]">
                    ({confidence >= 75 ? "عالية" : confidence >= 50 ? "متوسطة" : "محدودة"})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ============================================
            السؤال الاستراتيجي
            ============================================ */}
        <section className="mb-8 break-inside-avoid">
          <h2
            className="mb-3 border-r-[5px] border-[#BFA15A] pr-4 text-lg font-bold text-[#1A1D24]"
            style={{
              fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
            }}
          >
            السؤال الاستراتيجي
          </h2>
          <p className="leading-loose text-[#1A1D24]">{question}</p>
        </section>

        {/* ============================================
            الموجز الاستراتيجي
            ============================================ */}
        <section className="mb-8">
          <h2
            className="mb-4 border-r-[5px] border-[#BFA15A] pr-4 text-lg font-bold text-[#1A1D24]"
            style={{
              fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
            }}
          >
            الموجز الاستراتيجي
          </h2>
          <div className="whitespace-pre-wrap leading-loose text-[#1A1D24]">
            {summaryText}
          </div>
        </section>

        {/* ============================================
            الاستشهادات والمصادر
            ============================================ */}
        {citations.length > 0 && (
          <section className="mb-8 break-inside-avoid">
            <h2
              className="mb-3 border-r-[5px] border-[#536348] pr-4 text-lg font-bold text-[#1A1D24]"
              style={{
                fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
              }}
            >
              الاستشهادات والمصادر
            </h2>
            <ol className="space-y-2 pr-6">
              {citations.map((c, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-[#1A1D24]"
                >
                  <span
                    className="me-2 inline-block font-semibold text-[#8E7333]"
                    style={{
                      fontFamily:
                        "var(--font-mono), 'JetBrains Mono', monospace",
                    }}
                  >
                    [{i + 1}]
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ============================================
            التعليلات المنطقية
            ============================================ */}
        {reasoning.length > 0 && (
          <section className="mb-8 break-inside-avoid">
            <h2
              className="mb-3 border-r-[5px] border-[#536348] pr-4 text-lg font-bold text-[#1A1D24]"
              style={{
                fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
              }}
            >
              التعليلات المنطقية
            </h2>
            <ol className="space-y-2 pr-6">
              {reasoning.map((r, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-[#1A1D24]"
                >
                  <span
                    className="me-2 inline-block font-semibold text-[#536348]"
                    style={{
                      fontFamily:
                        "var(--font-mono), 'JetBrains Mono', monospace",
                    }}
                  >
                    [{i + 1}]
                  </span>
                  {r}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ============================================
            الفجوات المعرفية
            ============================================ */}
        {gaps.length > 0 && (
          <section className="mb-8 break-inside-avoid">
            <h2
              className="mb-3 border-r-[5px] border-[#8E7333] pr-4 text-lg font-bold text-[#1A1D24]"
              style={{
                fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
              }}
            >
              الفجوات المعرفية
            </h2>
            <ol className="space-y-2 pr-6">
              {gaps.map((g, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-[#1A1D24]"
                >
                  <span
                    className="me-2 inline-block font-semibold text-[#8E7333]"
                    style={{
                      fontFamily:
                        "var(--font-mono), 'JetBrains Mono', monospace",
                    }}
                  >
                    [{i + 1}]
                  </span>
                  {g}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ============================================
            التذييل الرسمي
            ============================================ */}
        <footer className="mt-12 border-t-[3px] border-double border-[#BFA15A] pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p
              className="text-xs text-[#574420]"
              style={{
                fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif",
              }}
            >
              نموذج أوّلي قابل للتجربة لـ مركز دعم اتخاذ القرار
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.25em] text-[#8E7333]"
              style={{
                fontFamily:
                  "var(--font-mono), 'JetBrains Mono', monospace",
              }}
            >
              Sovereign Knowledge Engine · {referenceNumber}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <>
      {/* ============================================
          زر فتح المعاينة (يظهر ضمن الواجهة العادية)
          ============================================ */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-sovereign w-full sm:w-auto"
        aria-label="عرض التقرير وطباعته"
      >
        <FileText className="h-4 w-4" strokeWidth={2} />
        <span>عرض التقرير وطباعته</span>
      </button>

      {/* ============================================
          المعاينة (تُحقن في body عبر Portal)
          ============================================ */}
      {mounted && isOpen && createPortal(previewContent, document.body)}
    </>
  );
}
