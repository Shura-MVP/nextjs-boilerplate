"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { ClassificationLevel } from "./ClassificationBadge";

// ============================================
// تسجيل الخطوط العربية
// ============================================
Font.register({
  family: "Tajawal",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/tajawal/v11/Iura6YBj_oCad4k1l_6gLrZjiLlJ-G0.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/tajawal/v11/Iurf6YBj_oCad4k1l5qjMLBjiLlJ8gJ4mvA.ttf",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/tajawal/v11/Iurf6YBj_oCad4k1l5qjLLNjiLlJ8gJ4mvA.ttf",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "ReemKufi",
  src: "https://fonts.gstatic.com/s/reemkufi/v20/2sDPZGJLip7W2J7v7wQDb0-_C7G4SbZcEw.ttf",
});

Font.register({
  family: "Cormorant",
  src: "https://fonts.gstatic.com/s/cormorantgaramond/v18/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.ttf",
});

// ============================================
// أنماط الـ PDF
// ============================================
const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FAFAF7",
    fontFamily: "Tajawal",
    fontSize: 11,
    color: "#1A2419",
  },

  // ============================================
  // الترويسة العلوية
  // ============================================
  header: {
    backgroundColor: "#0F1216",
    padding: 24,
    borderBottom: "3pt solid #BFA15A",
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    backgroundColor: "#BFA15A",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#0F1216",
    fontFamily: "ReemKufi",
    fontSize: 18,
    fontWeight: 700,
  },
  brandText: {
    fontFamily: "ReemKufi",
    fontSize: 20,
    fontWeight: 700,
    color: "#E8DCAE",
    textAlign: "right",
  },
  brandSubtext: {
    fontFamily: "Cormorant",
    fontSize: 9,
    color: "#BFA15A",
    letterSpacing: 2,
    marginTop: 2,
    textAlign: "right",
  },
  refSection: {
    alignItems: "flex-start",
  },
  refLabel: {
    fontSize: 7,
    color: "#8E7333",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  refNumber: {
    fontSize: 11,
    color: "#E8DCAE",
    fontWeight: 700,
  },

  // ============================================
  // شارة السرية
  // ============================================
  classificationBanner: {
    padding: 8,
    borderBottom: "1pt solid #BFA15A",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classificationText: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 2,
  },
  timestampText: {
    fontSize: 8,
    color: "#5A4420",
    fontFamily: "Cormorant",
  },

  // ============================================
  // المحتوى
  // ============================================
  content: {
    padding: 32,
  },

  documentTitle: {
    fontFamily: "ReemKufi",
    fontSize: 22,
    fontWeight: 700,
    color: "#1A2419",
    textAlign: "right",
    marginBottom: 6,
  },
  documentSubtitle: {
    fontFamily: "Cormorant",
    fontSize: 11,
    color: "#735B28",
    textAlign: "right",
    marginBottom: 20,
    letterSpacing: 1,
    fontStyle: "italic",
  },

  goldDivider: {
    height: 2,
    backgroundColor: "#BFA15A",
    marginBottom: 24,
    width: "100%",
  },

  // ============================================
  // قسم السؤال
  // ============================================
  questionSection: {
    backgroundColor: "#F5F0E3",
    border: "1pt solid #D4BE7E",
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
  },
  questionLabel: {
    fontFamily: "ReemKufi",
    fontSize: 9,
    color: "#8E7333",
    letterSpacing: 1.5,
    marginBottom: 6,
    textAlign: "right",
  },
  questionText: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1A2419",
    textAlign: "right",
    lineHeight: 1.7,
  },

  // ============================================
  // عناوين الأقسام
  // ============================================
  sectionTitle: {
    fontFamily: "ReemKufi",
    fontSize: 14,
    fontWeight: 700,
    color: "#1A2419",
    textAlign: "right",
    marginTop: 20,
    marginBottom: 10,
    paddingRight: 10,
    borderRight: "3pt solid #BFA15A",
  },

  sectionTitleEn: {
    fontFamily: "Cormorant",
    fontSize: 9,
    color: "#735B28",
    textAlign: "right",
    marginBottom: 12,
    fontStyle: "italic",
    letterSpacing: 1,
  },

  // ============================================
  // النص الأساسي
  // ============================================
  bodyText: {
    fontSize: 11,
    color: "#2D4230",
    textAlign: "right",
    lineHeight: 1.8,
    marginBottom: 10,
  },

  // ============================================
  // الاستشهادات والأدلة
  // ============================================
  evidenceGrid: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 16,
  },
  evidenceItem: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F0E3",
    border: "1pt solid #D4BE7E",
    borderRadius: 4,
  },
  evidenceLabel: {
    fontSize: 8,
    color: "#8E7333",
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: "right",
  },
  evidenceCount: {
    fontFamily: "ReemKufi",
    fontSize: 16,
    fontWeight: 700,
    color: "#BFA15A",
    textAlign: "right",
  },

  citationsList: {
    marginTop: 12,
  },
  citationItem: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: "0.5pt solid #E0D9BD",
  },
  citationNumber: {
    fontSize: 9,
    color: "#8E7333",
    fontWeight: 700,
    minWidth: 20,
  },
  citationText: {
    flex: 1,
    fontSize: 9,
    color: "#2D4230",
    textAlign: "right",
    lineHeight: 1.5,
  },

  // ============================================
  // مؤشرات
  // ============================================
  metricsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "#0F1216",
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 7,
    color: "#BFA15A",
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: "right",
  },
  metricValue: {
    fontFamily: "ReemKufi",
    fontSize: 18,
    fontWeight: 700,
    color: "#E8DCAE",
    textAlign: "right",
  },
  metricUnit: {
    fontSize: 9,
    color: "#BFA15A",
    textAlign: "right",
    marginTop: 2,
  },

  // ============================================
  // التذييل
  // ============================================
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    borderTop: "1pt solid #BFA15A",
    paddingTop: 8,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#5A4420",
    fontFamily: "Cormorant",
    fontStyle: "italic",
  },
  pageNumber: {
    fontSize: 8,
    color: "#735B28",
  },

  // ============================================
  // شريط جانبي للعلامة
  // ============================================
  watermark: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 6,
    height: "100%",
    backgroundColor: "#BFA15A",
  },
});

// ============================================
// إعدادات السرية للـ PDF
// ============================================
const PDF_CLASSIFICATION = {
  public: {
    label: "عــام",
    labelEn: "PUBLIC",
    color: "#5A7A4F",
    bgColor: "#E8EDE5",
  },
  internal: {
    label: "للاستخدام الداخلي",
    labelEn: "INTERNAL USE ONLY",
    color: "#8E7333",
    bgColor: "#F5F0E3",
  },
  confidential: {
    label: "مُقيَّـد",
    labelEn: "CONFIDENTIAL",
    color: "#A86838",
    bgColor: "#F5E8DC",
  },
  secret: {
    label: "ســـري",
    labelEn: "SECRET",
    color: "#A04545",
    bgColor: "#F5DCDC",
  },
  topsecret: {
    label: "ســري للغاية",
    labelEn: "TOP SECRET",
    color: "#5A2D2D",
    bgColor: "#E8C5C5",
  },
};

// ============================================
// واجهة بيانات الـ PDF
// ============================================
export interface PDFData {
  referenceNumber: string;
  timestamp: string;
  classification: ClassificationLevel;
  question: string;
  summaryText: string;
  citations: string[];
  reasoning: string[];
  gaps: string[];
  confidence: number;
  riskLevel: string;
  agentsInvoked: number;
}

// ============================================
// مكوّن الـ PDF
// ============================================
function ShuraPDFDocument({ data }: { data: PDFData }) {
  const cls = PDF_CLASSIFICATION[data.classification];
  const formattedDate = formatDateForPDF(data.timestamp);

  // تنظيف النص من العلامات
  const cleanText = stripMarkers(data.summaryText);

  return (
    <Document
      title={`شــورى — تقرير ${data.referenceNumber}`}
      author="شــورى — Shura MAG"
      subject="موجز استراتيجي"
      creator="Shura MAG"
      producer="Shura MAG"
    >
      <Page size="A4" style={styles.page}>
        {/* شريط ذهبي جانبي */}
        <View style={styles.watermark} fixed />

        {/* ============================================
            الترويسة
            ============================================ */}
        <View style={styles.header} fixed>
          <View style={styles.headerContent}>
            <View style={styles.brandSection}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>ش</Text>
              </View>
              <View>
                <Text style={styles.brandText}>شــورى</Text>
                <Text style={styles.brandSubtext}>SHURA MAG</Text>
              </View>
            </View>

            <View style={styles.refSection}>
              <Text style={styles.refLabel}>REFERENCE</Text>
              <Text style={styles.refNumber}>{data.referenceNumber}</Text>
            </View>
          </View>
        </View>

        {/* ============================================
            شارة السرية
            ============================================ */}
        <View
          style={[
            styles.classificationBanner,
            { backgroundColor: cls.bgColor },
          ]}
        >
          <Text
            style={[styles.classificationText, { color: cls.color }]}
          >
            {cls.labelEn} — {cls.label}
          </Text>
          <Text style={styles.timestampText}>{formattedDate}</Text>
        </View>

        {/* ============================================
            المحتوى
            ============================================ */}
        <View style={styles.content}>
          <Text style={styles.documentTitle}>الموجز الاستراتيجي</Text>
          <Text style={styles.documentSubtitle}>
            Executive Strategic Summary
          </Text>

          <View style={styles.goldDivider} />

          {/* السؤال */}
          <View style={styles.questionSection}>
            <Text style={styles.questionLabel}>السؤال الاستراتيجي</Text>
            <Text style={styles.questionText}>{data.question}</Text>
          </View>

          {/* المؤشرات */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>دقة التحليل</Text>
              <Text style={styles.metricValue}>{data.confidence}%</Text>
              <Text style={styles.metricUnit}>Confidence Level</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>الوكلاء المُستدعَون</Text>
              <Text style={styles.metricValue}>{data.agentsInvoked}</Text>
              <Text style={styles.metricUnit}>Agents Invoked</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>الاستشهادات</Text>
              <Text style={styles.metricValue}>{data.citations.length}</Text>
              <Text style={styles.metricUnit}>Citations</Text>
            </View>
          </View>

          {/* الخلاصة */}
          <Text style={styles.sectionTitle}>الخلاصة التنفيذية</Text>
          <Text style={styles.sectionTitleEn}>Executive Summary</Text>
          <Text style={styles.bodyText}>{cleanText}</Text>

          {/* الأدلة */}
          {data.citations.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>قائمة الاستشهادات</Text>
              <Text style={styles.sectionTitleEn}>Citations Register</Text>

              <View style={styles.citationsList}>
                {data.citations.map((citation, idx) => (
                  <View key={idx} style={styles.citationItem}>
                    <Text style={styles.citationNumber}>[{idx + 1}]</Text>
                    <Text style={styles.citationText}>{citation}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* الفجوات المعرفية */}
          {data.gaps.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>الفجوات المعرفية</Text>
              <Text style={styles.sectionTitleEn}>Knowledge Gaps</Text>

              <View style={styles.citationsList}>
                {data.gaps.map((gap, idx) => (
                  <View key={idx} style={styles.citationItem}>
                    <Text style={styles.citationNumber}>[{idx + 1}]</Text>
                    <Text style={styles.citationText}>{gap}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ============================================
            التذييل
            ============================================ */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            نموذج أوّلي قابل للتجربة — مركز دعم اتخاذ القرار
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// ============================================
// دالة توليد PDF وتحميلها
// ============================================
export async function generatePDF(data: PDFData): Promise<void> {
  try {
    const blob = await pdf(<ShuraPDFDocument data={data} />).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shura-${data.referenceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("تعذّر توليد التقرير");
  }
}

// ============================================
// توليد رقم مرجعي فريد
// ============================================
export function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);

  return `SHURA-${year}-${month}-${day}-${random}`;
}

// ============================================
// تنسيق التاريخ للـ PDF
// ============================================
function formatDateForPDF(iso: string): string {
  try {
    const date = new Date(iso);
    const arabic = date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return arabic;
  } catch {
    return iso;
  }
}

// ============================================
// تنظيف النص من علامات [cite:] [reasoning:] [gap:]
// ============================================
function stripMarkers(text: string): string {
  return text
    .replace(/\[cite:[^\]]+\]/gi, "")
    .replace(/\[reasoning:[^\]]+\]/gi, "")
    .replace(/\[gap:[^\]]+\]/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}
