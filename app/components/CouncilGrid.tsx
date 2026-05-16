"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  Coins,
  Flame,
  Globe2,
  Globe,
  ShieldAlert,
  Cpu,
  Users,
  Scale,
  Leaf,
  Heart,
  GraduationCap,
  Building2,
  Target,
  Swords,
  Eye,
  Brain,
  CheckCircle2,
  Circle,
  Sparkles,
  Users2,
} from "lucide-react";
import AgentCard, { type Agent } from "./AgentCard";

// ============================================
// قائمة الوكلاء الـ 17 (قابلة للاختيار)
// + المحرّر والموازن (يعمل تلقائياً، لا يُعرض كبطاقة)
// ============================================
export const AGENTS: Agent[] = [
  // ====================================
  // الموضوعيون (14)
  // ====================================
  {
    id: "macro",
    name: "محلل الاقتصاد الكلي",
    nameEn: "Macroeconomic Analyst",
    category: "substantive",
    specialty: "الناتج المحلي، التضخم، التوظيف، السياسة النقدية",
    description:
      "تحليل الاقتصاد الكلي للسعودية والإقليم من زاوية المؤشرات الرئيسية.",
    icon: TrendingUp,
  },
  {
    id: "fiscal",
    name: "محلل المالية العامة",
    nameEn: "Fiscal Policy Analyst",
    category: "substantive",
    specialty: "الإيرادات، النفقات، العجز، الدين العام، الزكاة والضرائب",
    description: "تحليل البعد المالي للميزانية الحكومية ومسار الإنفاق العام.",
    icon: Coins,
  },
  {
    id: "energy",
    name: "محلل الطاقة والثروات",
    nameEn: "Energy & Resources Analyst",
    category: "substantive",
    specialty: "النفط، الغاز، الطاقة المتجددة، أسواق الطاقة العالمية",
    description: "تحليل ديناميات الطاقة وأسواقها وانعكاساتها الاستراتيجية.",
    icon: Flame,
  },
  {
    id: "geo-regional",
    name: "محلل الجغرافيا الإقليمية",
    nameEn: "Regional Geopolitics Analyst",
    category: "substantive",
    specialty: "العلاقات الخليجية، الإقليمية، التحالفات، التوازنات",
    description: "تحليل الديناميات الإقليمية في الشرق الأوسط والخليج.",
    icon: Globe2,
  },
  {
    id: "geo-global",
    name: "محلل الجغرافيا الدولية",
    nameEn: "Global Geopolitics Analyst",
    category: "substantive",
    specialty: "القوى الكبرى، النظام الدولي، التحالفات الاستراتيجية",
    description: "تحليل ديناميات النظام الدولي والقوى الكبرى وانعكاساتها.",
    icon: Globe,
  },
  {
    id: "security",
    name: "محلل الأمن والدفاع",
    nameEn: "Security & Defense Analyst",
    category: "substantive",
    specialty: "التهديدات الأمنية، الدفاع، الأمن السيبراني، الإرهاب",
    description: "تحليل التهديدات الأمنية والمتطلبات الدفاعية الاستراتيجية.",
    icon: ShieldAlert,
  },
  {
    id: "tech",
    name: "محلل التقنية والتحوّل الرقمي",
    nameEn: "Technology & Digital Transformation",
    category: "substantive",
    specialty: "الذكاء الاصطناعي، البنية التحتية الرقمية، السيادة التقنية",
    description: "تحليل التحول الرقمي والتقنيات الناشئة وأثرها السيادي.",
    icon: Cpu,
  },
  {
    id: "social",
    name: "محلل الشؤون الاجتماعية",
    nameEn: "Social Affairs Analyst",
    category: "substantive",
    specialty: "السكان، الأسرة، الشباب، الثقافة، الديموغرافيا",
    description: "تحليل الأبعاد الاجتماعية والديموغرافية للقرارات الاستراتيجية.",
    icon: Users,
  },
  {
    id: "legal",
    name: "المحلل القانوني والتشريعي",
    nameEn: "Legal & Regulatory Analyst",
    category: "substantive",
    specialty: "الأنظمة، التشريعات، الالتزامات الدولية، الحوكمة القانونية",
    description: "تحليل الأبعاد القانونية والتشريعية والتنظيمية للقرارات.",
    icon: Scale,
  },
  {
    id: "environment",
    name: "محلل البيئة والاستدامة",
    nameEn: "Environment & Sustainability",
    category: "substantive",
    specialty: "تغيّر المناخ، الموارد الطبيعية، الاستدامة، الحياد الكربوني",
    description: "تحليل القضايا البيئية والاستدامة طويلة الأمد.",
    icon: Leaf,
  },
  {
    id: "health",
    name: "محلل الصحة العامة",
    nameEn: "Public Health Analyst",
    category: "substantive",
    specialty: "النظم الصحية، الأوبئة، السياسات الصحية، جودة الحياة",
    description: "تحليل قضايا الصحة العامة والنظم الصحية الوطنية.",
    icon: Heart,
  },
  {
    id: "education",
    name: "محلل التعليم ورأس المال البشري",
    nameEn: "Education & Human Capital",
    category: "substantive",
    specialty: "التعليم، التدريب، المهارات، اقتصاد المعرفة",
    description: "تحليل قضايا التعليم وتنمية رأس المال البشري الوطني.",
    icon: GraduationCap,
  },
  {
    id: "governance",
    name: "محلل الحوكمة والإدارة العامة",
    nameEn: "Governance & Public Administration",
    category: "substantive",
    specialty: "الإدارة الحكومية، الكفاءة، الشفافية، أداء القطاع العام",
    description: "تحليل قضايا الحوكمة وكفاءة الإدارة العامة وأدائها.",
    icon: Building2,
  },
  {
    id: "vision2030",
    name: "محلل رؤية 2030",
    nameEn: "Vision 2030 Analyst",
    category: "substantive",
    specialty: "المستهدفات، البرامج التنفيذية، مؤشرات الأداء الرئيسية",
    description: "تحليل القرارات في ضوء مستهدفات رؤية 2030 وبرامجها.",
    icon: Target,
  },

  // ====================================
  // العدائيون (2)
  // ====================================
  {
    id: "adversarial",
    name: "النَّاقِض",
    nameEn: "The Challenger",
    category: "adversarial",
    specialty: "تحدّي الافتراضات، كشف نقاط الضعف، الزاوية المعاكسة",
    description: "يُتحدّى الافتراضات السائدة ويكشف نقاط الضعف في التحليلات.",
    icon: Swords,
  },
  {
    id: "external-eye",
    name: "العين الخارجية",
    nameEn: "The External Eye",
    category: "adversarial",
    specialty: "النقد من خارج السياق المحلي، المنظور الأممي المستقل",
    description: "يُقدّم نقداً من زاوية خارجة عن السياق السعودي المحلي.",
    icon: Eye,
  },

  // ====================================
  // المعرفيون (1 — المحرّر يعمل تلقائياً)
  // ====================================
  {
    id: "metacognitive",
    name: "الناقد المعرفي",
    nameEn: "The Metacognitive Critic",
    category: "metacognitive",
    specialty: "التفكير في عملية التفكير، تقييم جودة المداولة كنظام",
    description: "يُراجع جودة المداولة ذاتها ودرجات اليقين والتحيز الجماعي.",
    icon: Brain,
  },
];

// ============================================
// أوضاع الاختيار
// ============================================
type SelectionMode = "single" | "multiple" | "all";

interface CouncilGridProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

// ============================================
// المكوّن الرئيسي
// ============================================
export default function CouncilGrid({
  selectedIds,
  onChange,
}: CouncilGridProps) {
  const [mode, setMode] = useState<SelectionMode>("all");
  const [filter, setFilter] = useState<"all" | "substantive" | "adversarial" | "metacognitive">("all");

  // ============================================
  // الوكلاء حسب التصفية
  // ============================================
  const filteredAgents = useMemo(() => {
    if (filter === "all") return AGENTS;
    return AGENTS.filter((a) => a.category === filter);
  }, [filter]);

  // ============================================
  // تبديل وضع الاختيار
  // ============================================
  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);

    if (newMode === "all") {
      onChange(AGENTS.map((a) => a.id));
    } else if (newMode === "single") {
      onChange(selectedIds.length > 0 ? [selectedIds[0]] : []);
    }
    // multiple — يحتفظ بالاختيار الحالي
  };

  // ============================================
  // تبديل اختيار وكيل واحد
  // ============================================
  const handleToggle = (agentId: string) => {
    if (mode === "single") {
      onChange([agentId]);
      return;
    }

    if (selectedIds.includes(agentId)) {
      onChange(selectedIds.filter((id) => id !== agentId));
    } else {
      onChange([...selectedIds, agentId]);
    }
  };

  // ============================================
  // عدد المختارين حسب الفئة
  // ============================================
  const stats = useMemo(() => {
    return {
      total: selectedIds.length,
      substantive: AGENTS.filter(
        (a) => a.category === "substantive" && selectedIds.includes(a.id)
      ).length,
      adversarial: AGENTS.filter(
        (a) => a.category === "adversarial" && selectedIds.includes(a.id)
      ).length,
      metacognitive: AGENTS.filter(
        (a) => a.category === "metacognitive" && selectedIds.includes(a.id)
      ).length,
    };
  }, [selectedIds]);

  return (
    <div className="space-y-6">
      {/* ============================================
          الرأس: العنوان + أوضاع الاختيار
          ============================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="heading-bar">
            <h2 className="font-display text-xl font-semibold text-[rgb(var(--text-primary))] sm:text-2xl">
              مجلس الوكلاء الرقمي
            </h2>
          </div>
          <p className="pr-5 text-sm text-[rgb(var(--text-muted))]">
            اختر الوكلاء المعنيّين بمداولتك — كلٌّ منهم يحلّل من زاوية تخصصه
          </p>
        </div>

        {/* ============================================
            أوضاع الاختيار: واحد / متعدد / الكل
            ============================================ */}
        <div className="flex items-center gap-1 rounded-xl border border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 p-1">
          {[
            { value: "single" as SelectionMode, label: "وكيل واحد", icon: Circle },
            { value: "multiple" as SelectionMode, label: "عدة وكلاء", icon: CheckCircle2 },
            { value: "all" as SelectionMode, label: "المجلس كاملاً", icon: Users2 },
          ].map((opt) => {
            const Icon = opt.icon;
            const isActive = mode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleModeChange(opt.value)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "text-[rgb(var(--bg-primary))]"
                    : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 rounded-lg bg-sovereign-gradient"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" strokeWidth={2} />
                <span className="relative">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================
          مرشّحات الفئات + إحصاءات الاختيار
          ============================================ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: "all", label: "الكل", count: AGENTS.length },
            {
              value: "substantive",
              label: "موضوعي",
              count: AGENTS.filter((a) => a.category === "substantive").length,
            },
            {
              value: "adversarial",
              label: "عدائي",
              count: AGENTS.filter((a) => a.category === "adversarial").length,
            },
            {
              value: "metacognitive",
              label: "معرفي",
              count: AGENTS.filter((a) => a.category === "metacognitive").length,
            },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value as typeof filter)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
                filter === f.value
                  ? "border-[rgb(var(--gold-base))] bg-[rgb(var(--gold-base))]/10 text-[rgb(var(--gold-bright))]"
                  : "border-[rgb(var(--border-subtle))]/15 text-[rgb(var(--text-muted))] hover:border-[rgb(var(--border-subtle))]/30 hover:text-[rgb(var(--text-secondary))]"
              }`}
            >
              <span>{f.label}</span>
              <span className="opacity-60">({f.count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[rgb(var(--text-muted))]">
          <Sparkles className="h-3.5 w-3.5 text-[rgb(var(--gold-base))]" />
          <span>
            مختار: <span className="text-[rgb(var(--gold-bright))]">{stats.total}</span> / {AGENTS.length}
          </span>
        </div>
      </div>

      {/* ============================================
          شبكة البطاقات
          ============================================ */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredAgents.map((agent, idx) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedIds.includes(agent.id)}
              onToggle={() => handleToggle(agent.id)}
              index={idx}
              disabled={
                mode === "single" &&
                selectedIds.length > 0 &&
                !selectedIds.includes(agent.id)
                  ? false
                  : false
              }
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ============================================
          ملاحظة عن المحرّر التلقائي
          ============================================ */}
      <div className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))]/10 bg-[rgb(var(--bg-elevated))]/30 px-4 py-3 text-xs text-[rgb(var(--text-muted))]">
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-[rgb(var(--gold-base))]" />
        <span>
          المحرّر والموازن يعمل تلقائياً في نهاية كل مداولة لتأليف الموجز
          الاستراتيجي الموحّد.
        </span>
      </div>
    </div>
  );
}
