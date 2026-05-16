"use client";

import { Printer } from "lucide-react";
import { useState } from "react";
import type { ClassificationLevel } from "./ClassificationBadge";

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
// إعدادات السرية للطباعة
// ============================================
const PRINT_CLASSIFICATION = {
  public: { label: "عــام", labelEn: "PUBLIC", color: "#5A7A4F" },
  internal: {
    label: "للاستخدام الداخلي",
    labelEn: "INTERNAL USE ONLY",
    color: "#8E7333",
  },
  confidential: {
    label: "مُقيَّـد",
    labelEn: "CONFIDENTIAL",
    color: "#A86838",
  },
  secret: { label: "ســـري", labelEn: "SECRET", color: "#A04545" },
  topsecret: {
    label: "ســري للغاية",
    labelEn: "TOP SECRET",
    color: "#5A2D2D",
  },
};

// ============================================
// المكوّن الرئيسي
// ============================================
export default function PrintLayout(props: PrintLayoutProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      {/* ============================================
          زر الطباعة — يختفي عند الطباعة
          ============================================ */}
      <button
        type="button"
        onClick={handlePrint}
        disabled={isPrinting}
        className="btn-ghost no-print group/print"
        aria-label="طباعة التقرير"
      >
        <Printer
          className="h-4 w-4 transition-transform group-hover/print:scale-110"
          strokeWidth={2}
        />
        <span>طباعة التقرير</span>
      </button>

      {/* ============================================
          محتوى الطباعة — مخفي بصرياً، يظهر فقط عند الطباعة
          ============================================ */}
      <PrintableContent {...props} />
    </>
  );
}

// ============================================
// المحتوى القابل للطباعة
// ============================================
function PrintableContent(props: PrintLayoutProps) {
  const cls = PRINT_CLASSIFICATION[props.classification];
  const formattedDate = formatPrintDate(props.timestamp);
  const cleanText = stripMarkers(props.summaryText);

  return (
    <div className="print-only" aria-hidden="true">
      <style jsx global>{`
        @media screen {
          .print-only {
            display: none !important;
          }
        }

        @media print {
          /* إعدادات الصفحة */
          @page {
            size: A4;
            margin: 1.5cm 1.8cm;
          }

          /* إخفاء كل شيء عدا منطقة الطباعة */
          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            direction: rtl;
            font-family: "Tajawal", "Arial", sans-serif;
            color: #1a2419;
            background: white;
          }

          /* إخفاء العناصر التفاعلية */
          .no-print {
            display: none !important;
          }

          /* تحسين الألوان للطباعة */
          .print-only h1,
          .print-only h2,
          .print-only h3 {
            color: #1a2419;
            page-break-after: avoid;
          }

          .print-only .page-break {
            page-break-before: always;
          }

          .print-only .avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* ============================================
          ترويسة الصفحة
          ============================================ */}
      <header
        style={{
          borderBottom: "3pt solid #BFA15A",
          paddingBottom: "12pt",
          marginBottom: "16pt",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        >
          {/* الشعار والاسم */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10pt",
              flexDirection: "row-reverse",
            }}
          >
            <div
              style={{
                width: "44pt",
                height: "44pt",
                background: "#BFA15A",
                borderRadius: "22pt",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#0F1216",
                  fontSize: "18pt",
                  fontWeight: 700,
                }}
              >
                ش
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: "20pt",
                  fontWeight: 700,
                  color: "#1A2419",
                  marginBottom: "2pt",
                }}
              >
                شــورى
              </div>
              <div
                style={{
                  fontSize: "9pt",
                  color: "#8E7333",
                  letterSpacing: "2pt",
                  fontStyle: "italic",
                }}
              >
                SHURA MAG
              </div>
            </div>
          </div>

          {/* الرقم المرجعي */}
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "7pt",
                color: "#8E7333",
                letterSpacing: "1.5pt",
                marginBottom: "2pt",
              }}
            >
              REFERENCE
            </div>
            <div
              style={{
                fontSize: "11pt",
                fontWeight: 700,
                color: "#1A2419",
              }}
            >
              {props.referenceNumber}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          شارة السرية
          ============================================ */}
      <div
        style={{
          background: `${cls.color}15`,
          border: `1pt solid ${cls.color}`,
          padding: "6pt 12pt",
          marginBottom: "16pt",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row-reverse",
          borderRadius: "4pt",
        }}
      >
        <div
          style={{
            fontSize: "10pt",
            fontWeight: 700,
            letterSpacing: "2pt",
            color: cls.color,
          }}
        >
          {cls.labelEn} — {cls.label}
        </div>
        <div
          style={{
            fontSize: "8pt",
            color: "#5A4420",
            fontStyle: "italic",
          }}
        >
          {formattedDate}
        </div>
      </div>

      {/* ============================================
          العنوان الرئيسي
          ============================================ */}
      <div style={{ marginBottom: "20pt" }}>
        <h1
          style={{
            fontSize: "22pt",
            fontWeight: 700,
            color: "#1A2419",
            textAlign: "right",
            marginBottom: "4pt",
          }}
        >
          الموجز الاستراتيجي
        </h1>
        <div
          style={{
            fontSize: "11pt",
            color: "#735B28",
            fontStyle: "italic",
            letterSpacing: "1pt",
            textAlign: "right",
          }}
        >
          Executive Strategic Summary
        </div>

        <div
          style={{
            height: "2pt",
            background: "#BFA15A",
            marginTop: "12pt",
          }}
        />
      </div>

      {/* ============================================
          السؤال الاستراتيجي
          ============================================ */}
      <div
        className="avoid-break"
        style={{
          background: "#F5F0E3",
          border: "1pt solid #D4BE7E",
          borderRadius: "4pt",
          padding: "12pt 16pt",
          marginBottom: "20pt",
        }}
      >
        <div
          style={{
            fontSize: "9pt",
            color: "#8E7333",
            letterSpacing: "1.5pt",
            marginBottom: "6pt",
            fontWeight: 500,
          }}
        >
          السؤال الاستراتيجي
        </div>
        <div
          style={{
            fontSize: "13pt",
            fontWeight: 500,
            color: "#1A2419",
            lineHeight: 1.7,
          }}
        >
          {props.question}
        </div>
      </div>

      {/* ============================================
          المؤشرات السريعة
          ============================================ */}
      <div
        className="avoid-break"
        style={{
          display: "flex",
          gap: "8pt",
          marginBottom: "20pt",
          flexDirection: "row-reverse",
        }}
      >
        <MetricBox
          label="دقة التحليل"
          labelEn="Confidence"
          value={`${props.confidence}%`}
        />
        <MetricBox
          label="الوكلاء المُستدعَون"
          labelEn="Agents"
          value={String(props.agentsInvoked)}
        />
        <MetricBox
          label="الاستشهادات"
          labelEn="Citations"
          value={String(props.citations.length)}
        />
        <MetricBox
          label="الفجوات المعرفية"
          labelEn="Gaps"
          value={String(props.gaps.length)}
        />
      </div>

      {/* ============================================
          الخلاصة التنفيذية
          ============================================ */}
      <SectionHeader
        title="الخلاصة التنفيذية"
        titleEn="Executive Summary"
      />

      <div
        style={{
          fontSize: "11pt",
          color: "#2D4230",
          lineHeight: 1.9,
          textAlign: "right",
          marginBottom: "24pt",
        }}
      >
        {cleanText.split("\n\n").map((paragraph, idx) => (
          <p
            key={idx}
            style={{ marginBottom: "10pt" }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* ============================================
          الاستشهادات
          ============================================ */}
      {props.citations.length > 0 && (
        <div className="avoid-break">
          <SectionHeader
            title="قائمة الاستشهادات"
            titleEn="Citations Register"
          />

          <div style={{ marginBottom: "20pt" }}>
            {props.citations.map((citation, idx) => (
              <CitationItem
                key={idx}
                index={idx + 1}
                content={citation}
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================================
          الفجوات المعرفية
          ============================================ */}
      {props.gaps.length > 0 && (
        <div className="avoid-break">
          <SectionHeader
            title="الفجوات المعرفية"
            titleEn="Knowledge Gaps"
          />

          <div style={{ marginBottom: "20pt" }}>
            {props.gaps.map((gap, idx) => (
              <CitationItem
                key={idx}
                index={idx + 1}
                content={gap}
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================================
          التذييل
          ============================================ */}
      <footer
        style={{
          borderTop: "1pt solid #BFA15A",
          paddingTop: "10pt",
          marginTop: "30pt",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row-reverse",
          fontSize: "8pt",
          color: "#5A4420",
        }}
      >
        <div style={{ fontStyle: "italic" }}>
          نموذج أوّلي قابل للتجربة — مركز دعم اتخاذ القرار
        </div>
        <div style={{ fontFamily: "monospace" }}>{props.referenceNumber}</div>
      </footer>
    </div>
  );
}

// ============================================
// عنوان قسم
// ============================================
function SectionHeader({
  title,
  titleEn,
}: {
  title: string;
  titleEn: string;
}) {
  return (
    <div style={{ marginBottom: "12pt", marginTop: "20pt" }}>
      <h2
        style={{
          fontSize: "14pt",
          fontWeight: 700,
          color: "#1A2419",
          textAlign: "right",
          paddingRight: "10pt",
          borderRight: "3pt solid #BFA15A",
          marginBottom: "2pt",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "9pt",
          color: "#735B28",
          fontStyle: "italic",
          letterSpacing: "1pt",
          textAlign: "right",
        }}
      >
        {titleEn}
      </div>
    </div>
  );
}

// ============================================
// صندوق مؤشر
// ============================================
function MetricBox({
  label,
  labelEn,
  value,
}: {
  label: string;
  labelEn: string;
  value: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#0F1216",
        padding: "10pt 12pt",
        borderRadius: "4pt",
      }}
    >
      <div
        style={{
          fontSize: "7pt",
          color: "#BFA15A",
          letterSpacing: "1pt",
          marginBottom: "3pt",
          textAlign: "right",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "18pt",
          fontWeight: 700,
          color: "#E8DCAE",
          textAlign: "right",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "7pt",
          color: "#BFA15A",
          textAlign: "right",
          marginTop: "2pt",
          fontStyle: "italic",
        }}
      >
        {labelEn}
      </div>
    </div>
  );
}

// ============================================
// عنصر استشهاد
// ============================================
function CitationItem({
  index,
  content,
}: {
  index: number;
  content: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8pt",
        marginBottom: "6pt",
        paddingBottom: "6pt",
        borderBottom: "0.5pt solid #E0D9BD",
        flexDirection: "row-reverse",
      }}
    >
      <div
        style={{
          fontSize: "9pt",
          color: "#8E7333",
          fontWeight: 700,
          minWidth: "24pt",
        }}
      >
        [{index}]
      </div>
      <div
        style={{
          flex: 1,
          fontSize: "9pt",
          color: "#2D4230",
          lineHeight: 1.6,
          textAlign: "right",
        }}
      >
        {content}
      </div>
    </div>
  );
}

// ============================================
// أدوات مساعدة
// ============================================
function formatPrintDate(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function stripMarkers(text: string): string {
  return text
    .replace(/\[cite:[^\]]+\]/gi, "")
    .replace(/\[reasoning:[^\]]+\]/gi, "")
    .replace(/\[gap:[^\]]+\]/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}
