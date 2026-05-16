"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import type { JSX } from "react";

interface ExecutiveSummaryProps {
  text: string;
  referenceNumber?: string;
  timestamp?: string;
}

// ============================================
// أنواع أجزاء النص
// ============================================
type TextPart =
  | { type: "text"; content: string }
  | { type: "cite"; content: string; id: number }
  | { type: "reasoning"; content: string; id: number }
  | { type: "gap"; content: string; id: number };

// ============================================
// المكوّن الرئيسي
// ============================================
export default function ExecutiveSummary({
  text,
  referenceNumber,
  timestamp,
}: ExecutiveSummaryProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel-sovereign flex h-full flex-col overflow-hidden"
    >
      {/* ============================================
          رأس البطاقة
          ============================================ */}
      <header className="relative border-b border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--gold-base))]/15 text-[rgb(var(--gold-bright))]">
              <FileText className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-display text-base font-semibold text-[rgb(var(--text-primary))] sm:text-lg">
                الخلاصة الاستراتيجية
              </h2>
              <p className="font-en text-[10px] italic tracking-wider text-[rgb(var(--text-muted))] sm:text-xs">
                Executive Summary
              </p>
            </div>
          </div>

          {referenceNumber && (
            <div className="hidden flex-col items-end text-[10px] sm:flex">
              <span className="font-mono uppercase tracking-wider text-[rgb(var(--text-muted))]">
                Ref.
              </span>
              <span className="font-mono text-[rgb(var(--gold-bright))]">
                {referenceNumber}
              </span>
            </div>
          )}
        </div>

        {/* خط ذهبي رفيع تحت الرأس */}
        <div className="gold-line absolute bottom-0 left-0 right-0" />
      </header>

      {/* ============================================
          المحتوى — نص الخلاصة
          ============================================ */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
        <article className="prose-sovereign max-w-none">
          <SummaryRenderer text={text} />
        </article>
      </div>

      {/* ============================================
          التذييل — معلومات إضافية
          ============================================ */}
      {timestamp && (
        <footer className="border-t border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-primary))]/30 px-6 py-3">
          <div className="flex items-center justify-between gap-2 text-[10px] text-[rgb(var(--text-muted))]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[rgb(var(--gold-base))]" />
              <span>موجز تنفيذي مُحكَم</span>
            </div>
            <span className="font-mono">{formatTimestamp(timestamp)}</span>
          </div>
        </footer>
      )}
    </motion.section>
  );
}

// ============================================
// محلّل النص — يحوّل [cite:] [reasoning:] [gap:] لعناصر بصرية
// ============================================
function SummaryRenderer({ text }: { text: string }) {
  const parts = parseText(text);
  const paragraphs = groupIntoParagraphs(parts);

  return (
    <div className="space-y-5 leading-loose">
      {paragraphs.map((paragraph, pIdx) => (
        <ParagraphRenderer key={pIdx} parts={paragraph} />
      ))}
    </div>
  );
}

// ============================================
// تحليل النص لأجزاء (نص عادي + استشهادات + تعليلات + فجوات)
// ============================================
function parseText(text: string): TextPart[] {
  const pattern = /\[(cite|reasoning|gap):([^\]]+)\]/gi;
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let citeCounter = 0;
  let reasoningCounter = 0;
  let gapCounter = 0;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    // النص قبل العلامة
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    const tagType = match[1].toLowerCase();
    const content = match[2].trim();

    if (tagType === "cite") {
      citeCounter++;
      parts.push({ type: "cite", content, id: citeCounter });
    } else if (tagType === "reasoning") {
      reasoningCounter++;
      parts.push({ type: "reasoning", content, id: reasoningCounter });
    } else if (tagType === "gap") {
      gapCounter++;
      parts.push({ type: "gap", content, id: gapCounter });
    }

    lastIndex = match.index + match[0].length;
  }

  // النص المتبقي
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return parts;
}

// ============================================
// تجميع الأجزاء في فقرات (فصل عند سطرين فارغين)
// ============================================
function groupIntoParagraphs(parts: TextPart[]): TextPart[][] {
  const paragraphs: TextPart[][] = [];
  let current: TextPart[] = [];

  for (const part of parts) {
    if (part.type === "text") {
      const segments = part.content.split(/\n\s*\n/);
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].trim()) {
          current.push({ type: "text", content: segments[i] });
        }
        if (i < segments.length - 1) {
          if (current.length > 0) paragraphs.push(current);
          current = [];
        }
      }
    } else {
      current.push(part);
    }
  }

  if (current.length > 0) paragraphs.push(current);
  return paragraphs;
}

// ============================================
// عرض فقرة واحدة
// ============================================
function ParagraphRenderer({ parts }: { parts: TextPart[] }) {
  // كشف العناوين
  const firstText = parts.find((p) => p.type === "text");
  if (firstText && firstText.type === "text") {
    const headingMatch = firstText.content.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const HeadingTag = (`h${level + 1}` as unknown) as keyof JSX.IntrinsicElements;

      return (
        <HeadingTag className="mt-8 mb-3 font-display text-lg font-semibold text-[rgb(var(--gold-bright))]">
          {headingText}
        </HeadingTag>
      );
    }
  }

  // كشف القوائم
  const isList = parts.some(
    (p) =>
      p.type === "text" &&
      (/^[-•*]\s/m.test(p.content) || /^\d+\.\s/m.test(p.content))
  );

  if (isList) {
    return <ListRenderer parts={parts} />;
  }

  return (
    <p className="text-base leading-loose text-[rgb(var(--text-primary))] sm:text-[17px]">
      {parts.map((part, idx) => (
        <PartRenderer key={idx} part={part} />
      ))}
    </p>
  );
}

// ============================================
// عرض قائمة
// ============================================
function ListRenderer({ parts }: { parts: TextPart[] }) {
  // تجميع النص الكامل
  const fullText = parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.content : ""))
    .join("");

  const items = fullText.split("\n").filter((line) => line.trim());

  return (
    <ul className="mt-2 space-y-2.5 pr-2">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="relative flex gap-3 text-base leading-relaxed text-[rgb(var(--text-primary))] sm:text-[17px]"
        >
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[rgb(var(--gold-base))]" />
          <span>{item.replace(/^[-•*]\s|^\d+\.\s/, "")}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// عرض جزء واحد (نص أو علامة)
// ============================================
function PartRenderer({ part }: { part: TextPart }) {
  if (part.type === "text") {
    return <span>{part.content}</span>;
  }

  if (part.type === "cite") {
    return (
      <span
        className="mx-1 inline-flex cursor-help items-center gap-1 rounded border border-[rgb(var(--gold-base))]/40 bg-[rgb(var(--gold-base))]/10 px-1.5 py-0.5 align-baseline font-mono text-[10px] font-semibold text-[rgb(var(--gold-bright))] transition-all hover:bg-[rgb(var(--gold-base))]/20"
        title={part.content}
      >
        <span className="opacity-70">⚓</span>
        <span>{part.id}</span>
      </span>
    );
  }

  if (part.type === "reasoning") {
    return (
      <span
        className="mx-1 inline-flex cursor-help items-center gap-1 rounded border border-[rgb(var(--info))]/40 bg-[rgb(var(--info))]/10 px-1.5 py-0.5 align-baseline font-mono text-[10px] font-semibold text-[rgb(var(--info))] transition-all hover:bg-[rgb(var(--info))]/20"
        title={part.content}
      >
        <span className="opacity-70">⚖</span>
        <span>{part.id}</span>
      </span>
    );
  }

  if (part.type === "gap") {
    return (
      <span
        className="mx-1 inline-flex cursor-help items-center gap-1 rounded border border-[rgb(var(--warning))]/40 bg-[rgb(var(--warning))]/10 px-1.5 py-0.5 align-baseline font-mono text-[10px] font-semibold text-[rgb(var(--warning))] transition-all hover:bg-[rgb(var(--warning))]/20"
        title={part.content}
      >
        <span className="opacity-70">⚠</span>
        <span>{part.id}</span>
      </span>
    );
  }

  return null;
}

// ============================================
// تنسيق التاريخ
// ============================================
function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
