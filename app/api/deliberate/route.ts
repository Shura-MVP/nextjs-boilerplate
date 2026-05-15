import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ============================================
// التهيئة
// ============================================
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// أنواع البيانات
// ============================================
interface DeliberationRequest {
  query: string;
  protocol?: "brief" | "extended";
}

interface AgentResponse {
  agentId: string;
  agentName: string;
  perspective: string;
  citations: string[];
  reasoningGaps: string[];
}

// ============================================
// شخصيات الوكلاء — تعريفات داخلية (لا تُكشف للواجهة)
// ============================================
const AGENTS = [
  {
    id: "macro",
    name: "محلل الاقتصاد الكلي",
    systemPrompt: `أنت محلل اقتصادي كلي متخصص في الاقتصاد السعودي والإقليمي.
مهمتك: تحليل السؤال من منظور اقتصادي كلي (الناتج المحلي، التضخم، التوظيف، السياسة المالية والنقدية).

قواعد صارمة:
- كل ادعاء يجب أن يحمل وسم [cite:مصدر] أو [reasoning:تعليل منطقي] أو [gap:فجوة معرفية]
- لا تذكر أرقاماً محددة دون [cite:] يشير لمصدرها
- اكتب باللغة العربية الفصحى
- كن مختصراً ومركّزاً (300-500 كلمة)`,
  },
  {
    id: "fiscal",
    name: "محلل المالية العامة",
    systemPrompt: `أنت متخصص في المالية العامة والميزانية الحكومية السعودية.
مهمتك: تحليل البعد المالي للسؤال (الإيرادات، النفقات، العجز، الدين العام، الاحتياطيات).

قواعد صارمة:
- كل ادعاء يحمل [cite:مصدر] أو [reasoning:] أو [gap:]
- لا أرقام بدون مصدر
- العربية الفصحى، 300-500 كلمة`,
  },
  {
    id: "geo-regional",
    name: "محلل الجغرافيا السياسية الإقليمية",
    systemPrompt: `أنت محلل جغرافيا سياسية متخصص في منطقة الشرق الأوسط والخليج.
مهمتك: تحليل الأبعاد الإقليمية للسؤال (العلاقات الخليجية، الإقليمية، التحالفات، التوازنات).

قواعد صارمة:
- [cite:] لكل حقيقة، [reasoning:] للتحليل، [gap:] للمعرفة الناقصة
- العربية الفصحى، 300-500 كلمة`,
  },
  {
    id: "vision2030",
    name: "محلل رؤية 2030",
    systemPrompt: `أنت متخصص في مستهدفات رؤية 2030 السعودية وبرامجها التنفيذية.
مهمتك: ربط السؤال بمستهدفات وبرامج رؤية 2030 ومؤشرات الأداء الرئيسية.

قواعد صارمة:
- اربط بالمستهدفات الرسمية مع [cite:]
- العربية الفصحى، 300-500 كلمة`,
  },
  {
    id: "adversarial",
    name: "الناقض",
    systemPrompt: `دورك: تحدّي الافتراضات وكشف نقاط الضعف في أي تحليل.

مهمتك: استعراض السؤال من زاوية معاكسة. ابحث عن:
- الافتراضات غير المُختبَرة
- المخاطر المُستهان بها
- البدائل المُهمَلة
- التحيزات المحتملة في صياغة السؤال نفسه

قواعد صارمة:
- كن صريحاً وحاداً، لكن مهنياً
- كل نقد مدعوم بـ [reasoning:] واضح
- العربية الفصحى، 300-500 كلمة`,
  },
  {
    id: "metacognitive",
    name: "الناقد المعرفي",
    systemPrompt: `دورك: التفكير في عملية التفكير نفسها.

مهمتك: مراجعة جودة المداولة كاملةً. اسأل:
- هل غُطّيت الزوايا الأساسية؟
- هل ثمة تحيز جماعي في التحليلات؟
- ما درجة اليقين المناسبة لكل ادعاء؟
- أين الفجوات المعرفية الحرجة؟

قواعد صارمة:
- استخدم [reasoning:] و[gap:] بكثرة
- كن دقيقاً في تقييم درجات اليقين
- العربية الفصحى، 300-500 كلمة`,
  },
  {
    id: "synthesizer",
    name: "المحرّر والموازن",
    systemPrompt: `دورك: تأليف الموجز الاستراتيجي النهائي.

مهمتك: من المداولات السابقة، اكتب موجزاً استراتيجياً مُحكَماً يتضمن:
1. السياق (فقرة واحدة)
2. أهم 3-5 استنتاجات
3. المخاطر الرئيسية
4. التوصيات القابلة للتنفيذ
5. الفجوات المعرفية المتبقية

قواعد صارمة:
- حافظ على وسوم [cite:] [reasoning:] [gap:] في الموجز
- توازن بين الأدلة والآراء المتعارضة
- العربية الفصحى الراقية، 600-900 كلمة`,
  },
];

// ============================================
// التحقق من سلامة الادعاءات (طبقة الاستشهاد)
// ============================================
function validateCitations(text: string): {
  valid: boolean;
  unmarkedClaims: number;
  totalSentences: number;
} {
  // تقسيم النص لجمل
  const sentences = text
    .split(/[.!؟\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20); // الجمل الجوهرية فقط

  const citationPattern = /\[(cite|reasoning|gap):[^\]]+\]/i;
  
  let unmarkedClaims = 0;
  
  for (const sentence of sentences) {
    if (!citationPattern.test(sentence)) {
      unmarkedClaims++;
    }
  }

  return {
    valid: unmarkedClaims < sentences.length * 0.3, // 70% على الأقل موثّق
    unmarkedClaims,
    totalSentences: sentences.length,
  };
}

// ============================================
// استدعاء وكيل واحد
// ============================================
async function invokeAgent(
  agent: typeof AGENTS[number],
  query: string,
  context?: string
): Promise<AgentResponse> {
  const userMessage = context
    ? `السؤال الاستراتيجي:\n${query}\n\nالسياق من المداولة السابقة:\n${context}\n\nقدّم تحليلك من منظور تخصصك.`
    : `السؤال الاستراتيجي:\n${query}\n\nقدّم تحليلك من منظور تخصصك.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: agent.systemPrompt,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const textContent = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  // استخراج الاستشهادات
  const citations = Array.from(
    textContent.matchAll(/\[cite:([^\]]+)\]/g)
  ).map((m) => m[1]);

  // استخراج فجوات المعرفة
  const gaps = Array.from(
    textContent.matchAll(/\[gap:([^\]]+)\]/g)
  ).map((m) => m[1]);

  return {
    agentId: agent.id,
    agentName: agent.name,
    perspective: textContent,
    citations,
    reasoningGaps: gaps,
  };
}

// ============================================
// نقطة النهاية الرئيسية
// ============================================
export async function POST(request: NextRequest) {
  try {
    // التحقق من المفتاح
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "تعذّر الاتصال بالمنظومة في هذا الوقت" },
        { status: 500 }
      );
    }

    // تحليل الطلب
    const body: DeliberationRequest = await request.json();
    const { query } = body;

    // التحقق من المدخلات
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "السؤال مطلوب" },
        { status: 400 }
      );
    }

    if (query.length > 2000) {
      return NextResponse.json(
        { error: "السؤال طويل جداً (الحد الأقصى 2000 حرف)" },
        { status: 400 }
      );
    }

    // ============================================
    // المرحلة 1: استدعاء الوكلاء الموضوعيين بالتوازي
    // ============================================
    const substantiveAgents = AGENTS.filter((a) =>
      ["macro", "fiscal", "geo-regional", "vision2030"].includes(a.id)
    );

    const substantiveResponses = await Promise.all(
      substantiveAgents.map((agent) => invokeAgent(agent, query))
    );

    // ============================================
    // المرحلة 2: الوكلاء العدائيون والمعرفيون
    // ============================================
    const context = substantiveResponses
      .map((r) => `[${r.agentName}]\n${r.perspective}`)
      .join("\n\n---\n\n");

    const adversarialAgent = AGENTS.find((a) => a.id === "adversarial")!;
    const metacognitiveAgent = AGENTS.find((a) => a.id === "metacognitive")!;

    const [adversarialResponse, metacognitiveResponse] = await Promise.all([
      invokeAgent(adversarialAgent, query, context),
      invokeAgent(metacognitiveAgent, query, context),
    ]);

    // ============================================
    // المرحلة 3: التأليف النهائي
    // ============================================
    const fullContext = [
      ...substantiveResponses,
      adversarialResponse,
      metacognitiveResponse,
    ]
      .map((r) => `[${r.agentName}]\n${r.perspective}`)
      .join("\n\n---\n\n");

    const synthesizerAgent = AGENTS.find((a) => a.id === "synthesizer")!;
    const synthesis = await invokeAgent(synthesizerAgent, query, fullContext);

    // ============================================
    // التحقق من الاستشهادات في الموجز النهائي
    // ============================================
    const validation = validateCitations(synthesis.perspective);

    // ============================================
    // الاستجابة النهائية
    // ============================================
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      query: query.trim(),
      
      // المداولات الفردية (للعرض إن أراد المستخدم التفاصيل)
      deliberations: [
        ...substantiveResponses,
        adversarialResponse,
        metacognitiveResponse,
      ],
      
      // الموجز الاستراتيجي النهائي (المخرج الرئيسي)
      synthesis: {
        text: synthesis.perspective,
        citations: synthesis.citations,
        gaps: synthesis.reasoningGaps,
        validation,
      },
      
      // إحصاءات
      stats: {
        agentsInvoked: substantiveResponses.length + 3,
        totalCitations: [
          ...substantiveResponses,
          adversarialResponse,
          metacognitiveResponse,
          synthesis,
        ].reduce((sum, r) => sum + r.citations.length, 0),
        identifiedGaps: [
          ...substantiveResponses,
          adversarialResponse,
          metacognitiveResponse,
          synthesis,
        ].reduce((sum, r) => sum + r.reasoningGaps.length, 0),
      },
    });
  } catch (error) {
    console.error("Deliberation error:", error);
    
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء المداولة. حاول مرة أخرى.",
        details: process.env.NODE_ENV === "development" 
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
