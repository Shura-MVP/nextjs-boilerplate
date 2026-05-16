# CLAUDE.md

> ملف سياق لـ Claude Code (أو أي وكيل برمجة) عند العمل على مستودع شــورى — SHURA MAG.

---

## ما هو هذا المشروع؟

شــورى منظومة المداولة الاستراتيجية السيادية لـ **مركز دعم اتخاذ القرار**.

**نقطة جوهرية:** هذا ليس نموذجاً أوّلياً يُستبدل لاحقاً. هذا هو **النظام النهائي** الذي سيُسلَم للمركز، الذي سيُمرّره بدوره لشركة HUMAIN لاستبدال النموذج اللغوي فقط (Claude → ALLaM) عبر طبقة LLM Adapter. **لا تعديل** على المنطق، الواجهة، الوكلاء، أو التصميم.

---

## القواعد المطلقة (لا تُكسر تحت أي ظرف)

### 🔴 الهوية البصرية محسومة

- **Dark Mode فقط** — لا light mode، لا toggle
- **اللوحة:** Obsidian (`#06070A`) + Sovereign Gold (`#BFA15A`) + Verdigris (`#536348`)
- **الخطوط:** Reem Kufi (عناوين) + Tajawal (نصوص) + Cormorant Garamond (إنجليزي) + JetBrains Mono (برمجي)
- **الفلسفة:** سيادي، مكتوم، فاخر، **لا إشعاع** في الألوان

### 🔴 السرية المعمارية

ممنوع كشف هذه التفاصيل في الواجهة:
- اسم النموذج اللغوي (Claude / Anthropic / ALLaM)
- العدد الفعلي للوكلاء الداخليين
- أسماء البروتوكولات الداخلية
- شرح المعمارية للمستخدم النهائي

### 🔴 RTL إلزامي

كل الواجهة باللغة العربية، الاتجاه RTL، **لا استثناءات**.

### 🔴 لا تبعيات جديدة دون مبرر قوي

التبعيات الحالية مدروسة:
- `next` 15.1+ · `react` 19 · `typescript` 5.7+
- `@anthropic-ai/sdk` (يُستبدل بـ ALLaM لاحقاً)
- `framer-motion` · `three` + `@react-three/fiber` + `@react-three/drei`
- `lucide-react` · `recharts` · `@react-pdf/renderer`
- `tailwindcss`

### 🔴 sessionStorage فقط (لا localStorage)

الاستخدام الوحيد المسموح:
- `shura-deliberation` — حفظ بيانات السؤال عند الانتقال بين الصفحتين

---

## قواعد التصميم

### Mobile-First

- يبدأ كل مكوّن بتصميم الموبايل ثم يتوسع
- أزرار اللمس بحد أدنى 44×44px
- النصوص العربية بحجم 16px+ على الموبايل

### Responsive

- يعمل بلا انكسار من 320px إلى 4K
- يستخدم `clamp()` للأحجام السيّالة

### الأداء

- Lighthouse Mobile ≥ 90
- Three.js محدود: 2000 جسيم max، 800 خط max
- `dpr: [1, 1.5]` للأداء على الموبايل
- احترام `prefers-reduced-motion`

---

## قواعد الكود

### TypeScript صارم

- لا `any` إلا بمبرر مكتوب
- `strict: true` في `tsconfig.json`
- `noUnusedLocals` + `noUnusedParameters`

### Server vs Client Components

- مكوّنات Server افتراضياً
- `"use client"` فقط عند الحاجة الحقيقية (state, effects, browser APIs, framer-motion)

### تنظيم الملفات

