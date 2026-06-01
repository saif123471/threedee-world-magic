
## نظرة عامة

موقع صفحة واحدة (Single Page) باسم **Aether Labs** بأسلوب Apple فاخر، خلفية سوداء نقية (#050505)، خط أبيض رفيع أنيق، يعرض منتجَين فاخرَين مع تجارب تفاعلية ثلاثية الأبعاد ومحاكاة وكلاء AI.

## المنتجات

1. **Aether Sound Max** — سماعات رأس فاخرة
2. **Chronos Orion V2** — ساعة ذكية

## المكوّنات الرئيسية

### 1. شريط التنقل العلوي (TopNav)
- شعار "Aether" على اليسار بخط رفيع
- روابط منتجات بسيطة في الوسط
- أيقونة حقيبة تسوق على اليمين مع شارة عدّاد للمنتجات

### 2. قسم Hero
- عنوان كبير بخط رفيع جداً (font-thin) مع حركة fade-in
- عبارة فرعية هادئة
- مؤشر تمرير سفلي

### 3. بطاقات المنتجات (ProductCard) — التأثيرات الأساسية
- **Tilt 3D تفاعلي**: استخدام Framer Motion `useMotionValue` + `useTransform` لتتبع موضع الماوس وتدوير البطاقة على محوري X/Y مع `perspective` و`transformStyle: preserve-3d`
- **Click Flame Glow Burst**: عند النقر على الصورة، يظهر توهج نيون (برتقالي للسماعات، سيان للساعة) خلف المنتج بحركة scale + fade تختفي خلال ~800ms — مبنية على طبقة radial-gradient مع animation keyframes
- زر السعر/الشراء بنص: **"Consult Agent Swarm & Checkout"**

### 4. درج السلة المنزلق (CartDrawer)
- ينزلق من اليمين عند النقر على أيقونة الحقيبة (Sheet من shadcn أو Framer Motion)
- تصميم نظيف: قائمة منتجات، الكميات، الإجمالي، زر إتمام الشراء
- خلفية شبه شفافة backdrop blur

### 5. محاكاة Agent Swarm (AgentSwarmModal)
عند النقر على "Consult Agent Swarm & Checkout":
- Modal فاخر بطبقة blur
- ثلاث خطوات متتابعة مرئية:
  1. **Agent 1 — Personalization** (أيقونة Sparkles، توهج بنفسجي)
  2. **Agent 2 — Inventory Check** (أيقونة Package، توهج سيان)
  3. **Agent 3 — Fraud & Security** (أيقونة ShieldCheck، توهج برتقالي)
- كل خط يُنشّط بدوره مع spinner/pulse، خطوط متحركة بين الوكلاء توحي بالتواصل
- بعد ~4 ثوانٍ، رسالة تأكيد "Order Confirmed" وإفراغ السلة

### 6. Footer بسيط بنمط Apple

## التفاصيل التقنية

- **التقنيات**: React + TanStack Router (موجود) + Framer Motion + Tailwind CSS + shadcn/ui
- **حالة السلة**: React Context (`CartContext`) يحمل العناصر والإجمالي والوظائف add/remove/clear
- **نظام التصميم**: تحديث `src/styles.css`:
  - `--background: oklch(0.05 0 0)` (أسود عميق #050505)
  - `--foreground: oklch(0.98 0 0)`
  - tokens مخصصة: `--accent-orange` (نيون برتقالي)، `--accent-cyan` (نيون سيان)
  - keyframes للتوهج (glow-burst)، استيراد خط Inter رفيع أو SF Pro-like (`font-thin`, `tracking-tight`)
- **صور المنتجات**: توليد صورتَين عاليتَي الجودة عبر `imagegen` بخلفية سوداء/شفافة:
  - سماعات رأس فاخرة سوداء بإضاءة دراماتيكية
  - ساعة ذكية بإطار تيتانيوم على خلفية داكنة
- **التركيب**: بطاقات منتجات في grid من عمودَين بمساحات بيضاء كبيرة على نمط Apple

## بنية الملفات

```
src/
  routes/index.tsx                    (تركيب الصفحة الكاملة)
  components/
    TopNav.tsx
    Hero.tsx
    ProductCard.tsx                   (Tilt + Glow Burst)
    CartDrawer.tsx
    AgentSwarmModal.tsx               (محاكاة الـ 3 وكلاء)
    Footer.tsx
  context/CartContext.tsx
  data/products.ts                    (بيانات المنتجَين)
  assets/                             (صور المنتجات المولّدة)
  styles.css                          (التوكنز + keyframes)
```

## ميتاداتا SEO
- title: "Aether Labs — Sound & Time, Reimagined"
- description تصف العلامة والمنتجَين
- og tags + صورة المنتج كـ og:image

## الخطوات
1. تثبيت `framer-motion`
2. توليد صورتَي المنتجَين
3. تحديث `styles.css` بالتوكنز والـ keyframes
4. إنشاء CartContext وبيانات المنتجات
5. بناء المكونات بالترتيب: TopNav → Hero → ProductCard → CartDrawer → AgentSwarmModal → Footer
6. تركيبها في `routes/index.tsx` مع `<CartProvider>` وتحديث الميتاداتا
7. التحقق البصري عبر المعاينة
