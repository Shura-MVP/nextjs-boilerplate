"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import AgentNetwork from "./components/AgentNetwork";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // حفظ السؤال في sessionStorage للانتقال لصفحة المداولة
    sessionStorage.setItem("shura-query", query.trim());
    
    // الانتقال لصفحة المداولة
    router.push("/deliberate");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ============================================
          الترويسة العلوية
          ============================================ */}
      <header className="fixed top-0 z-50 w-full">
        <div className="container-main flex h-16 items-center justify-between py-3 sm:h-20">
          {/* الشعار */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="relative h-8 w-8 sm:h-10 sm:w-10">
              <div className="absolute inset-0 rounded-full bg-gold-gradient opacity-20 blur-md" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--surface))]">
                <span className="font-display text-sm font-bold text-[rgb(var(--accent))] sm:text-base">
                  ش
                </span>
              </div>
            </div>
            <span className="font-display text-lg font-semibold text-[rgb(var(--foreground))] sm:text-xl">
              شــورى
            </span>
          </motion.div>

          {/* زر تبديل الثيم */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* خط ذهبي رفيع */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="gold-divider origin-right"
        />
      </header>

      {/* ============================================
          القسم الرئيسي — Hero
          ============================================ */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        {/* خلفية الأنميشن */}
        <div className="absolute inset-0 z-0 opacity-50 sm:opacity-70">
          <AgentNetwork />
        </div>

        {/* طبقة تدرج لتنعيم الخلفية */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[rgb(var(--background))] via-transparent to-[rgb(var(--background))]" />

        {/* المحتوى الرئيسي */}
        <div className="container-main relative z-20 mx-auto max-w-4xl text-center">
          {/* العنوان الرئيسي */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="font-display text-display-xl font-bold tracking-tight text-[rgb(var(--foreground))]">
              <span className="text-gold-gradient">شــــورى</span>
            </h1>
          </motion.div>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="mx-auto mb-3 max-w-2xl text-lg leading-relaxed text-[rgb(var(--muted-foreground))] sm:text-xl"
          >
            منظومة المداولة الاستراتيجية متعددة الوكلاء
          </motion.p>

          {/* خط ذهبي زخرفي */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="mx-auto mb-12 h-px w-24 bg-gold-gradient"
          />

          {/* مربع السؤال */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl"
          >
            <div className="relative group">
              {/* الإطار المتوهج */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gold-gradient opacity-0 blur-sm transition-opacity duration-500 group-focus-within:opacity-30" />
              
              <div className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] backdrop-blur-sm transition-all duration-300 group-focus-within:border-[rgb(var(--accent))]">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="اطرح سؤالك الاستراتيجي..."
                  rows={3}
                  maxLength={2000}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-2xl bg-transparent px-6 py-5 text-base text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none sm:text-lg"
                  aria-label="السؤال الاستراتيجي"
                />

                {/* شريط الأدوات السفلي */}
                <div className="flex items-center justify-between border-t border-[rgb(var(--border))] px-4 py-3">
                  <span className="text-xs text-[rgb(var(--muted))]">
                    {query.length} / 2000
                  </span>

                  <button
                    type="submit"
                    disabled={!query.trim() || isSubmitting}
                    className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-5 py-2 text-sm font-medium text-[rgb(var(--accent-foreground))] transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(181,136,56,0.3)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <span>جارٍ البدء</span>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>ابدأ المداولة</span>
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="19" y1="12" x2="5" y2="12" />
                          <polyline points="12 19 5 12 12 5" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* تلميح أسفل الصندوق */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-4 text-center text-sm text-[rgb(var(--muted))]"
            >
              مداولة متعددة الأبعاد · استشهاد موثّق · مخرج قابل للتنفيذ
            </motion.p>
          </motion.form>

          {/* ============================================
              المؤشرات السفلية — قيم النظام
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
            className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6"
          >
            {[
              { label: "وكلاء متخصصون", value: "متعددون", icon: "agents" },
              { label: "تحقق متعدد الطبقات", value: "صارم", icon: "shield" },
              { label: "استشهاد بكل ادعاء", value: "موثّق", icon: "anchor" },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 + idx * 0.1 }}
                className="card-gold text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--surface-soft))]">
                  <IconRenderer type={item.icon} />
                </div>
                <div className="font-display text-xl font-semibold text-gold-gradient">
                  {item.value}
                </div>
                <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          التذييل البسيط
          ============================================ */}
      <footer className="relative z-20 border-t border-[rgb(var(--border))] py-6 mt-auto">
        <div className="container-main flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-right">
          <p className="text-xs text-[rgb(var(--muted))]">
            © {new Date().getFullYear()} شــورى — جميع الحقوق محفوظة
          </p>
          <p className="font-en text-xs italic text-[rgb(var(--muted))]">
            Strategic Deliberation
          </p>
        </div>
      </footer>
    </main>
  );
}

// ============================================
// مكوّن مساعد للأيقونات
// ============================================
function IconRenderer({ type }: { type: string }) {
  const iconProps = {
    className: "h-5 w-5 text-[rgb(var(--accent))]",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "agents":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <line x1="12" y1="7" x2="5" y2="17" />
          <line x1="12" y1="7" x2="19" y2="17" />
          <line x1="7" y1="19" x2="17" y2="19" />
        </svg>
      );
    case "shield":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "anchor":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      );
    default:
      return null;
  }
}
