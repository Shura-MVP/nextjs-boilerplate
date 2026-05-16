"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
const AmbientBackground = dynamic(() => import("./components/AmbientBackground"), { ssr: false });
import ShuraLogo from "./components/ShuraLogo";
import {
  ClassificationSelector,
  type ClassificationLevel,
} from "./components/ClassificationBadge";
import CouncilGrid, { AGENTS } from "./components/CouncilGrid";
import StrategicInput from "./components/StrategicInput";

export default function HomePage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [classification, setClassification] =
    useState<ClassificationLevel>("internal");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    AGENTS.map((a) => a.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!query.trim() || selectedAgentIds.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      query: query.trim(),
      classification,
      agentIds: selectedAgentIds,
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("shura-deliberation", JSON.stringify(payload));
    router.push("/deliberate");
  };

  const stats = useMemo(
    () => ({
      totalAgents: AGENTS.length,
      selectedCount: selectedAgentIds.length,
    }),
    [selectedAgentIds]
  );

  return (
    <>
      <AmbientBackground />

      <main className="relative z-10 min-h-screen">
        {/* ============================================
            الهيدر
            ============================================ */}
        <header className="relative">
          <div className="container-wide flex h-20 items-center justify-between sm:h-24">
            <ShuraLogo size="md" />

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden items-center gap-2 rounded-full border border-[rgb(var(--gold-base))]/20 bg-[rgb(var(--bg-elevated))]/40 px-4 py-1.5 backdrop-blur-sm sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--gold-base))] animate-pulse-sovereign" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--gold-base))]">
                Prototype
              </span>
            </motion.div>
          </div>
          <div className="gold-line" />
        </header>

        {/* ============================================
            القسم الافتتاحي
            ============================================ */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="container-wide">
            <div className="mx-auto max-w-5xl text-center">
              {/* شارة نموذج أوّلي */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--gold-base))]/25 bg-[rgb(var(--bg-elevated))]/30 px-4 py-1.5 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--gold-base))]" />
                <span className="font-display text-xs text-[rgb(var(--gold-base))] sm:text-sm">
                  نموذج أولي قابل للتجربة — مركز دعم اتخاذ القرار
                </span>
              </motion.div>

              {/* العنوان الرئيسي */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-6 font-display text-display-2xl tracking-tight"
              >
                <span className="text-gold">شــورى</span>
              </motion.h1>

              {/* النص التعريفي */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-[rgb(var(--text-secondary))] sm:text-lg lg:text-xl"
              >
                المحرّك المعرفي السيادي. منظومة استشارية متعددة الوكلاء، تُجري
                مداولةً منهجيةً مدعومةً بالأدلة، لرفد صنّاع القرار في مركز دعم
                اتخاذ القرار باستراتيجياتٍ قطاعيةٍ موثّقة.
              </motion.p>

              {/* خط ذهبي زخرفي */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                className="mx-auto mb-12 h-px w-32 bg-sovereign-gradient"
              />
            </div>
          </div>
        </section>

        {/* ============================================
            شارة السرية
            ============================================ */}
        <section className="relative py-6">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="panel-sovereign p-6 sm:p-8"
            >
              <ClassificationSelector
                selected={classification}
                onChange={setClassification}
              />
            </motion.div>
          </div>
        </section>

        {/* ============================================
            مجلس الوكلاء
            ============================================ */}
        <section className="relative py-6">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="panel-sovereign p-6 sm:p-8"
            >
              <CouncilGrid
                selectedIds={selectedAgentIds}
                onChange={setSelectedAgentIds}
              />
            </motion.div>
          </div>
        </section>

        {/* ============================================
            صندوق البحث الاستراتيجي
            ============================================ */}
        <section
          id="strategic-input-section"
          className="relative py-6 pb-16"
        >
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="panel-sovereign p-6 sm:p-8"
            >
              <StrategicInput
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                selectedAgentsCount={stats.selectedCount}
              />
            </motion.div>
          </div>
        </section>

        {/* ============================================
            التذييل
            ============================================ */}
        <footer className="relative mt-auto border-t border-[rgb(var(--border-subtle))]/10 py-8">
          <div className="container-wide">
            <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row">
              <p className="font-display text-xs text-[rgb(var(--text-muted))] sm:text-sm">
                نموذج أوّلي قابل للتجربة لـ مركز دعم اتخاذ القرار
              </p>
              <p className="font-en text-xs italic text-[rgb(var(--text-faint))]">
                Sovereign Knowledge Engine
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
