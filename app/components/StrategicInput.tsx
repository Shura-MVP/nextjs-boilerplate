"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

interface StrategicInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  selectedAgentsCount?: number;
}

const MAX_LENGTH = 3000;
const MIN_LENGTH = 10;

const PLACEHOLDERS = [
  "اطرح سؤالك الاستراتيجي للحصول على التحليل والدليل...",
  "ما هي استفساراتك الاستراتيجية اليوم؟",
  "صِغ سؤالك السياسي أو الاقتصادي بدقة...",
  "ما القرار الذي تحتاج إلى مداولته الآن؟",
];

export default function StrategicInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isSubmitting = false,
  selectedAgentsCount = 0,
}: StrategicInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // ============================================
  // تدوير النص المساعد
  // ============================================
  useEffect(() => {
    if (isFocused || value.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused, value.length]);

  // ============================================
  // تكييف ارتفاع النص تلقائياً
  // ============================================
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 280)}px`;
  }, [value]);

  // ============================================
  // التحقق من الجاهزية
  // ============================================
  const trimmed = value.trim();
  const isTooShort = trimmed.length > 0 && trimmed.length < MIN_LENGTH;
  const isReady =
    trimmed.length >= MIN_LENGTH &&
    trimmed.length <= MAX_LENGTH &&
    selectedAgentsCount > 0 &&
    !disabled &&
    !isSubmitting;

  // ============================================
  // إرسال بالاختصار Cmd/Ctrl + Enter
  // ============================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isReady) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* ============================================
          العنوان
          ============================================ */}
      <div className="flex items-end justify-between gap-2">
        <div className="heading-bar">
          <h2 className="font-display text-xl font-semibold text-[rgb(var(--text-primary))] sm:text-2xl">
            صندوق البحث الاستراتيجي
          </h2>
        </div>
        <div className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))] sm:flex">
          <kbd className="rounded border border-[rgb(var(--border-subtle))]/20 bg-[rgb(var(--bg-elevated))] px-1.5 py-0.5">
            ⌘
          </kbd>
          <span>+</span>
          <kbd className="rounded border border-[rgb(var(--border-subtle))]/20 bg-[rgb(var(--bg-elevated))] px-1.5 py-0.5">
            Enter
          </kbd>
          <span className="mr-1">للإرسال</span>
        </div>
      </div>

      {/* ============================================
          صندوق الإدخال السيادي
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* توهج عند التركيز */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          animate={{
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--gold-bright) / 0.4), rgb(var(--gold-base) / 0.2), rgb(var(--gold-deep) / 0.4))",
            filter: "blur(8px)",
          }}
        />

        <div
          className="relative overflow-hidden rounded-2xl border bg-[rgb(var(--bg-secondary))]/80 backdrop-blur-sm transition-all duration-400 ease-sovereign"
          style={{
            borderColor: isFocused
              ? "rgb(var(--gold-base))"
              : "rgb(var(--border-subtle) / 0.2)",
            boxShadow: isFocused
              ? "inset 0 1px 0 0 rgb(var(--gold-base) / 0.15), 0 0 40px rgb(var(--gold-base) / 0.1)"
              : "inset 0 1px 0 0 rgb(var(--gold-base) / 0.05)",
          }}
        >
          {/* خط ذهبي عمودي على اليمين */}
          <div
            className="absolute right-0 top-0 h-full w-[2px] transition-opacity duration-400"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgb(var(--gold-base)), transparent)",
              opacity: isFocused ? 1 : 0.3,
            }}
          />

          {/* مربع النص */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            maxLength={MAX_LENGTH}
            disabled={disabled || isSubmitting}
            rows={4}
            className="w-full resize-none bg-transparent px-6 pt-6 pb-3 text-base leading-relaxed text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))]/60 focus:outline-none sm:text-lg"
            aria-label="السؤال الاستراتيجي"
            spellCheck={false}
          />

          {/* الشريط السفلي: العدّاد + الزر */}
          <div className="flex items-center justify-between gap-3 border-t border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-primary))]/30 px-4 py-3 sm:px-6">
            {/* العدّاد + حالة الجاهزية */}
            <div className="flex items-center gap-3">
              <CharCounter
                length={value.length}
                isTooShort={isTooShort}
              />
              {selectedAgentsCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden items-center gap-1.5 text-xs text-[rgb(var(--text-muted))] sm:flex"
                >
                  <Sparkles className="h-3 w-3 text-[rgb(var(--gold-base))]" />
                  <span>
                    <span className="text-[rgb(var(--gold-bright))]">
                      {selectedAgentsCount}
                    </span>{" "}
                    وكيل مختار
                  </span>
                </motion.div>
              )}
            </div>

            {/* زر الإرسال */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!isReady}
              className="btn-sovereign group/btn"
            >
              {isSubmitting ? (
                <>
                  <span>جار التحضير</span>
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
                </>
              ) : (
                <>
                  <span>ابدأ المداولة</span>
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-1"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ============================================
          رسائل المساعدة
          ============================================ */}
      <div className="flex items-center justify-between gap-2 px-1">
        <ValidationMessage
          isTooShort={isTooShort}
          hasAgents={selectedAgentsCount > 0}
          minLength={MIN_LENGTH}
        />

        <p className="hidden text-xs text-[rgb(var(--text-muted))]/70 sm:block">
          مداولة موثّقة · استشهاد بالأدلة · مخرج تنفيذي
        </p>
      </div>
    </div>
  );
}

// ============================================
// عدّاد الأحرف
// ============================================
function CharCounter({
  length,
  isTooShort,
}: {
  length: number;
  isTooShort: boolean;
}) {
  const percent = (length / MAX_LENGTH) * 100;
  const isNear = percent > 85;
  const isOver = percent > 95;

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span
        className={`transition-colors duration-300 ${
          isOver
            ? "text-[rgb(var(--critical))]"
            : isNear
            ? "text-[rgb(var(--warning))]"
            : isTooShort
            ? "text-[rgb(var(--warning))]"
            : "text-[rgb(var(--text-muted))]"
        }`}
      >
        {length.toLocaleString("ar-SA")}
      </span>
      <span className="text-[rgb(var(--text-faint))]">/</span>
      <span className="text-[rgb(var(--text-faint))]">
        {MAX_LENGTH.toLocaleString("ar-SA")}
      </span>
    </div>
  );
}

// ============================================
// رسالة التحقق
// ============================================
function ValidationMessage({
  isTooShort,
  hasAgents,
  minLength,
}: {
  isTooShort: boolean;
  hasAgents: boolean;
  minLength: number;
}) {
  if (isTooShort) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 text-xs text-[rgb(var(--warning))]"
      >
        <AlertCircle className="h-3 w-3" />
        <span>الحد الأدنى {minLength} أحرف</span>
      </motion.div>
    );
  }

  if (!hasAgents) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 text-xs text-[rgb(var(--warning))]"
      >
        <AlertCircle className="h-3 w-3" />
        <span>اختر وكيلاً واحداً على الأقل</span>
      </motion.div>
    );
  }

  return <div />;
}
