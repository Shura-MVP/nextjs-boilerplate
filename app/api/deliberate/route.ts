import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ============================================
// التهيئة
// ============================================
export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// أنواع البيانات
// ============================================
type ClassificationLevel =
  | "public"
  | "internal"
  | "confidential"
  | "secret"
  | "topsecret";

interface DeliberationRequest {
  query: string;
  classification: ClassificationLevel;
  agentIds: string[];
}

interface AgentDefinition {
  id: string;
  name: string;
  category: "substantive" | "adversarial" | "metacognitive" | "synthesizer";
  systemPrompt: string;
}

interface AgentResponse {
  agentId: string;
  agentName: string;
  perspective: string;
  citations: string[];
  reasoning: string[];
  gaps: string[];
}

// ============================================
// قواعد الاستشهاد الصارمة (تُحقن في كل وكيل)
// ============================================
const CITATION_RULES = `
قواعد الاستشهاد الإلزامية:
- كل ادعاء جوهري يحمل أحد الوسوم:
  • [cite:مصدر محدد] — للحقائق والأرقام والاقتباسات
  • [reasoning:تعليل منطقي مختصر] — للاستنتاجات المنطقية
  • [gap:فجوة معرفية محددة] — لما لا تعرفه المنظومة
- لا تذكر رقماً أو إحصاءً دون [cite:] يحدد مصدره
- العربية الفصحى الراقية، 400-600 كلمة
- مختصر، مُحكَم، تنفيذي
- لا تستطرد، لا تكرر، لا تُجامل
`;

// ============================================
// قاعدة بيانات الوكلاء الـ 17
// ============================================
const ALL_AGENTS: Record<string, AgentDefinition> = {
  // الموضوعيون (14)
  macro: {
    id: "macro",
    name: "محلل الاقتصاد الكلي",
    category: "substantive",
    systemPrompt: `أنت محلل اقتصادي كلي متخصص في الاقتصاد السعودي والإقليمي.
تحلل من زاوية: الناتج المحلي، التضخم، التوظيف، السياسة النقدية، أسعار الفائدة، ميزان المدفوعات.
${CITATION_RULES}`,
  },
  fiscal: {
    id: "fiscal",
    name: "محلل المالية العامة",
    category: "substantive",
    systemPrompt: `أنت متخصص في المالية العامة والميزانية الحكومية السعودية.
تحلّل من زاوية: الإيرادات النفطية وغير النفطية، النفقات، العجز، الدين العام، الاحتياطيات، الزكاة والضرائب.
${CITATION_RULES}`,
  },
  energy: {
    id: "energy",
    name: "محلل الطاقة والثروات",
    category: "substantive",
    systemPrompt: `أنت متخصص في قطاع الطاقة والثروات الطبيعية.
تحلّل من زاوية: أسواق النفط والغاز، الطاقة المتجددة، التحول الطاقي، أوبك+، الأسعار، الإنتاج.
${CITATION_RULES}`,
  },
  "geo-regional": {
    id: "geo-regional",
    name: "محلل الجغرافيا السياسية الإقليمية",
    category: "substantive",
    systemPrompt: `أنت محلل جغرافيا سياسية متخصص في الشرق الأوسط والخليج.
تحلّل من زاوية: العلاقات الخليجية، الإقليمية، التحالفات، التوازنات، النزاعات، إيران، تركيا، اليمن.
${CITATION_RULES}`,
  },
  "geo-global": {
    id: "geo-global",
    name: "محلل الجغرافيا السياسية الدولية",
    category: "substantive",
    systemPrompt: `أنت محلل جغرافيا سياسية دولية.
تحلّل من زاوية: القوى الكبرى، الولايات المتحدة، الصين، روسيا، أوروبا، النظام الدولي، التحالفات الاستراتيجية.
${CITATION_RULES}`,
  },
  security: {
    id: "security",
    name: "محلل الأمن والدفاع",
    category: "substantive",
    systemPrompt: `أنت محلل أمني ودفاعي متخصص.
تحلّل من زاوية: التهديدات الأمنية، المتطلبات الدفاعية، الأمن السيبراني، الإرهاب، الردع، التصنيع العسكري.
${CITATION_RULES}`,
  },
  tech: {
    id: "tech",
    name: "محلل التقنية والتحول الرقمي",
    category: "substantive",
    systemPrompt: `أنت محلل تقني متخصص في التحول الرقمي.
تحلّل من زاوية: الذكاء الاصطناعي، البنية التحتية الرقمية، السيادة التقنية، الاقتصاد الرقمي، الشركات الناشئة.
${CITATION_RULES}`,
  },
  social: {
    id: "social",
    name: "محلل الشؤون الاجتماعية",
    category: "substantive",
    systemPrompt: `أنت محلل اجتماعي متخصص في المجتمع السعودي.
تحلّل من زاوية: الديموغرافيا، الأسرة، الشباب، المرأة، الثقافة، القيم، التحولات الاجتماعية.
${CITATION_RULES}`,
  },
  legal: {
    id: "legal",
    name: "المحلل القانوني والتشريعي",
    category: "substantive",
    systemPrompt: `أنت محلل قانوني وتشريعي.
تحلّل من زاوية: الأنظمة السعودية، التشريعات، الالتزامات الدولية، الحوكمة القانونية، التحكيم، حقوق الإنسان.
${CITATION_RULES}`,
  },
  environment: {
    id: "environment",
    name: "محلل البيئة والاستدامة",
    category: "substantive",
    systemPrompt: `أنت محلل بيئي ومتخصص في الاستدامة.
تحلّل من زاوية: تغيّر المناخ، الموارد المائية، الحياد الكربوني، التنوع الحيوي، الاقتصاد الدائري.
${CITATION_RULES}`,
  },
  health: {
    id: "health",
    name: "محلل الصحة العامة",
    category: "substantive",
    systemPrompt: `أنت محلل في الصحة العامة والسياسات الصحية.
تحلّل من زاوية: النظم الصحية، الأوبئة، السياسات الصحية، جودة الحياة، الصحة النفسية، نموذج الرعاية.
${CITATION_RULES}`,
  },
  education: {
    id: "education",
    name: "محلل التعليم ورأس المال البشري",
    category: "substantive",
    systemPrompt: `أنت محلل تعليمي ومتخصص في تنمية رأس المال البشري.
تحلّل من زاوية: نظم التعليم، المهارات، التدريب، البحث العلمي، اقتصاد المعرفة، مخرجات التعليم.
${CITATION_RULES}`,
  },
  governance: {
    id: "governance",
    name: "محلل الحوكمة والإدارة العامة",
    category: "substantive",
    systemPrompt: `أنت محلل متخصص في الحوكمة والإدارة العامة.
تحلّل من زاوية: كفاءة الحكومة، الشفافية، أداء القطاع العام، التحول المؤسسي، مكافحة الفساد.
${CITATION_RULES}`,
  },
  vision2030: {
    id: "vision2030",
    name: "محلل رؤية 2030",
    category: "substantive",
    systemPrompt: `أنت متخصص في مستهدفات رؤية 2030 وبرامجها التنفيذية.
تحلّل من زاوية: المستهدفات الكمية، البرامج التنفيذية، KPIs، تقدم التنفيذ، المشاريع الكبرى.
${CITATION_RULES}`,
  },

  // العدائيون (2)
  adversarial: {
    id: "adversarial",
    name: "النَّاقِض",
    category: "adversarial",
    systemPrompt: `دورك: تحدّي الافتراضات وكشف نقاط الضعف بصرامة مهنية.
ابحث عن: الافتراضات غير المُختبَرة، المخاطر المستهان بها، البدائل المُهمَلة، التحيزات في صياغة السؤال نفسه، السيناريوهات السلبية.
كن صريحاً وحاداً لكن مهنياً. لا سَفسطة. كل نقد مدعوم بـ [reasoning:].
${CITATION_RULES}`,
  },
  "external-eye": {
    id: "external-eye",
    name: "العين الخارجية",
    category: "adversarial",
    systemPrompt: `دورك: تقديم نقد من زاوية خارجة عن السياق السعودي المحلي.
تحلّل كما يحلّل مراقب أممي محايد، أو محلل في معهد دولي مستقل، أو صحفي اقتصادي في صحيفة عالمية رصينة.
لا تُجامل، لا تتحامل. اطرح ما قد يراه الخارج ولا يُقال محلياً.
${CITATION_RULES}`,
  },

  // المعرفي (1)
  metacognitive: {
    id: "metacognitive",
    name: "الناقد المعرفي",
    category: "metacognitive",
    systemPrompt: `دورك: التفكير في عملية التفكير ذاتها (Metacognition).
راجع جودة المداولة كنظام: هل غُطّيت الزوايا؟ هل ثمة تحيز جماعي؟ ما درجة اليقين المناسبة لكل ادعاء؟ أين الفجوات الحرجة؟
استخدم [reasoning:] و[gap:] بكثرة. كن دقيقاً في معايرة درجات اليقين.
${CITATION_RULES}`,
  },
};

// ============================================
// المؤلِف النهائي (يعمل تلقائياً دائماً)
// ============================================
const SYNTHESIZER: AgentDefinition = {
  id: "synthesizer",
  name: "المحرّر والموازن",
  category: "synthesizer",
  systemPrompt: `دورك: تأليف الموجز الاستراتيجي النهائي بصياغة تنفيذية مُحكَمة.

من المداولات السابقة، اكتب موجزاً يتضمن بهذا الترتيب:

## السياق
فقرة واحدة تُؤطر السؤال.

## الاستنتاجات الرئيسية
3-5 نقاط، كل نقطة مدعومة بـ [cite:] أو [reasoning:].

## المخاطر المحورية
مرتبة حسب الأثر × الاحتمال. لكل خطر: الوصف، الأثر، الاحتمال، التخفيف المقترح.

## التوصيات التنفيذية
محددة، قابلة للقياس، مُرتَّبة حسب الأولوية.

## الفجوات المعرفية
ما لم تستطع المنظومة الإجابة عنه، بصراحة.

قواعد:
- وازن قبل أن ترجّح. لا تُلغِ رأياً معارضاً، بل زِنه.
- صياغة تنفيذية فاخرة، تليق بصانع قرار سيادي.
- العربية الفصحى الراقية، 800-1200 كلمة.
${CITATION_RULES}`,
};

// ============================================
// التحقق من الاستشهادات
// ============================================
function validateCitations(text: string): {
  valid: boolean;
  unmarkedClaims: number;
  totalSentences: number;
  confidence: number;
} {
  const sentences = text
    .split(/[.!؟\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);

  const citationPattern = /\[(cite|reasoning|gap):[^\]]+\]/i;

  let unmarkedClaims = 0;
  for (const sentence of sentences) {
    if (!citationPattern.test(sentence)) {
      unmarkedClaims++;
    }
  }

  const totalSentences = sentences.length || 1;
  const markedRatio = 1 - unmarkedClaims / totalSentences;
  const confidence = Math.round(markedRatio * 100);

  return {
    valid: markedRatio >= 0.7,
    unmarkedClaims,
    totalSentences,
    confidence,
  };
}

// ============================================
// استخراج العلامات
// ============================================
function extractMarkers(text: string) {
  const citations = Array.from(text.matchAll(/\[cite:([^\]]+)\]/g)).map((m) =>
    m[1].trim()
  );
  const reasoning = Array.from(text.matchAll(/\[reasoning:([^\]]+)\]/g)).map(
    (m) => m[1].trim()
  );
  const gaps = Array.from(text.matchAll(/\[gap:([^\]]+)\]/g)).map((m) =>
    m[1].trim()
  );

  return { citations, reasoning, gaps };
}

// ============================================
// استدعاء وكيل واحد
// ============================================
async function invokeAgent(
  agent: AgentDefinition,
  query: string,
  classification: ClassificationLevel,
  context?: string
): Promise<AgentResponse> {
  const classificationContext = `\n\nمستوى تصنيف هذه المداولة: ${classification.toUpperCase()}.`;

  const userMessage = context
    ? `السؤال الاستراتيجي:\n${query}${classificationContext}\n\nسياق المداولة السابقة:\n${context}\n\nقدّم تحليلك من زاوية تخصصك.`
    : `السؤال الاستراتيجي:\n${query}${classificationContext}\n\nقدّم تحليلك من زاوية تخصصك.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2500,
    system: agent.systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textContent = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  const { citations, reasoning, gaps } = extractMarkers(textContent);

  return {
    agentId: agent.id,
    agentName: agent.name,
    perspective: textContent,
    citations,
    reasoning,
    gaps,
  };
}

// ============================================
// تقدير مستوى المخاطرة من النص
// ============================================
function estimateRiskLevel(
  text: string
): "low" | "medium" | "high" | "critical" {
  const criticalKeywords = [
    "حرج", "كارثي", "خطر وجودي", "تهديد مباشر", "انهيار",
  ];
  const highKeywords = [
    "خطر مرتفع", "تهديد جسيم", "أزمة", "متدهور", "حاد",
  ];
  const mediumKeywords = [
    "مخاطرة", "تحدي", "إشكال", "اضطراب", "ضغط",
  ];

  const lowerText = text.toLowerCase();

  const criticalCount = criticalKeywords.filter((k) =>
    lowerText.includes(k)
  ).length;
  const highCount = highKeywords.filter((k) => lowerText.includes(k)).length;
  const mediumCount = mediumKeywords.filter((k) =>
    lowerText.includes(k)
  ).length;

  if (criticalCount >= 2) return "critical";
  if (criticalCount >= 1 || highCount >= 3) return "high";
  if (highCount >= 1 || mediumCount >= 3) return "medium";
  return "low";
}

// ============================================
// نقطة النهاية الرئيسية
// ============================================
export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "تعذر الاتصال بالمنظومة في هذا الوقت" },
        { status: 500 }
      );
    }

    const body: DeliberationRequest = await request.json();
    const { query, classification, agentIds } = body;

    // ============================================
    // التحقق من المدخلات
    // ============================================
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "السؤال الاستراتيجي مطلوب" },
        { status: 400 }
      );
    }

    if (query.length > 3000) {
      return NextResponse.json(
        { error: "السؤال طويل جداً (الحد الأقصى 3000 حرف)" },
        { status: 400 }
      );
    }

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json(
        { error: "يجب اختيار وكيل واحد على الأقل" },
        { status: 400 }
      );
    }

    const validClassifications: ClassificationLevel[] = [
      "public",
      "internal",
      "confidential",
      "secret",
      "topsecret",
    ];
    if (!validClassifications.includes(classification)) {
      return NextResponse.json(
        { error: "مستوى التصنيف غير صحيح" },
        { status: 400 }
      );
    }

    // ============================================
    // تصفية الوكلاء المختارين
    // ============================================
    const selectedAgents = agentIds
      .map((id) => ALL_AGENTS[id])
      .filter((a): a is AgentDefinition => Boolean(a));

    if (selectedAgents.length === 0) {
      return NextResponse.json(
        { error: "لم يُعثر على وكلاء صالحين" },
        { status: 400 }
      );
    }

    // ============================================
    // المرحلة 1: الوكلاء الموضوعيون بالتوازي
    // ============================================
    const substantiveAgents = selectedAgents.filter(
      (a) => a.category === "substantive"
    );

    const substantiveResponses =
      substantiveAgents.length > 0
        ? await Promise.all(
            substantiveAgents.map((agent) =>
              invokeAgent(agent, query, classification)
            )
          )
        : [];

    // ============================================
    // المرحلة 2: الوكلاء العدائيون والمعرفي
    // ============================================
    const context = substantiveResponses
      .map((r) => `[${r.agentName}]\n${r.perspective}`)
      .join("\n\n---\n\n");

    const adversarialAgents = selectedAgents.filter(
      (a) => a.category === "adversarial"
    );
    const metacognitiveAgents = selectedAgents.filter(
      (a) => a.category === "metacognitive"
    );

    const adversarialResponses =
      adversarialAgents.length > 0
        ? await Promise.all(
            adversarialAgents.map((agent) =>
              invokeAgent(agent, query, classification, context)
            )
          )
        : [];

    const metacognitiveResponses =
      metacognitiveAgents.length > 0
        ? await Promise.all(
            metacognitiveAgents.map((agent) =>
              invokeAgent(agent, query, classification, context)
            )
          )
        : [];

    // ============================================
    // المرحلة 3: التأليف النهائي (دائماً)
    // ============================================
    const allResponses = [
      ...substantiveResponses,
      ...adversarialResponses,
      ...metacognitiveResponses,
    ];

    const fullContext = allResponses
      .map((r) => `[${r.agentName}]\n${r.perspective}`)
      .join("\n\n---\n\n");

    const synthesis = await invokeAgent(
      SYNTHESIZER,
      query,
      classification,
      fullContext
    );

    // ============================================
    // التحقق والإحصاءات
    // ============================================
    const validation = validateCitations(synthesis.perspective);
    const riskLevel = estimateRiskLevel(synthesis.perspective);

    const allCitations = [
      ...new Set(allResponses.flatMap((r) => r.citations).concat(synthesis.citations)),
    ];
    const allReasoning = [
      ...new Set(allResponses.flatMap((r) => r.reasoning).concat(synthesis.reasoning)),
    ];
    const allGaps = [
      ...new Set(allResponses.flatMap((r) => r.gaps).concat(synthesis.gaps)),
    ];

    // ============================================
    // الاستجابة النهائية
    // ============================================
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      query: query.trim(),
      classification,

      synthesis: {
        text: synthesis.perspective,
        confidence: validation.confidence,
        riskLevel,
      },

      evidence: {
        citations: allCitations,
        reasoning: allReasoning,
        gaps: allGaps,
      },

      stats: {
        agentsInvoked: allResponses.length + 1,
        substantiveCount: substantiveResponses.length,
        adversarialCount: adversarialResponses.length,
        metacognitiveCount: metacognitiveResponses.length,
        totalCitations: allCitations.length,
        totalReasoning: allReasoning.length,
        totalGaps: allGaps.length,
        validation,
      },
    });
  } catch (error) {
    console.error("Deliberation error:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء المداولة. حاول مرة أخرى.",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ============================================
// رفض الطرق الأخرى
// ============================================
export async function GET() {
  return NextResponse.json(
    { error: "الطريقة غير مدعومة. استخدم POST." },
    { status: 405 }
  );
}
