import { Teacher, GeneralCriterion, ClassSessionCriterionGroup } from './types';

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: 'وجدان العزي' }, { id: 't2', name: 'محمد الدريهم' },
  { id: 't3', name: 'عبد الرؤوف الوصابي' }, { id: 't4', name: 'فهمي الجرافي' },
  { id: 't5', name: 'آية فاتق' }, { id: 't6', name: 'عاصم المنعي' },
  { id: 't7', name: 'عبد الرزاق صبيح' }, { id: 't8', name: 'جمال الرديني' },
  { id: 't9', name: 'إيمان قطيش' }, { id: 't10', name: 'وفاء الصلوي' },
  { id: 't11', name: 'إيمان النصيف' }, { id: 't12', name: 'عبد السلام المعدني' },
  { id: 't13', name: 'علي عامر' }, { id: 't14', name: 'محمد المشرع' },
  { id: 't15', name: 'إيمان العبسي' }, { id: 't16', name: 'رانيا العزي' },
  { id: 't17', name: 'هدى الصغير' }, { id: 't18', name: 'أشواق المخلافي' },
  { id: 't19', name: 'عائشة العريقي' }, { id: 't20', name: 'ألطاف جار الله' },
  { id: 't21', name: 'هناء الحيجنة' }, { id: 't22', name: 'رحاب العيفري' },
  { id: 't23', name: 'ضحى القباطي' }, { id: 't24', name: 'خلود صلاح' },
  { id: 't25', name: 'هند  الحبابي' }, { id: 't26', name: 'ناديا الورد' }
];

export const GENERAL_EVALUATION_CRITERIA_TEMPLATE: Omit<GeneralCriterion, 'score'>[] = [
  { id: 'gc1', label: 'حضور اللقاء التطويري' },
  { id: 'gc2', label: 'السير في المنهج', progress: 'مطابق' },
  { id: 'gc3', label: 'عنوان آخر درس', lastLessonTitle: '' },
  { id: 'gc4', label: 'تسليم الأسئلة الأسبوعية' },
  { id: 'gc5', label: 'اختبار الطلاب' },
  { id: 'gc6', label: 'تنفيذ البرامج الخاصة بالمادة' },
  { id: 'gc7', label: 'تنفيذ الاستراتيجيات' },
  { id: 'gc8', label: 'استخدام وسائل تعليمية' },
];

export const COMMON_STRATEGIES = [
    'التعلم باللعب', 'التعلم بالقصص', 'التعلّم القائم على التكرار', 'التعلم التعاوني البسيط', 
    'التعليم بالمحاكاة', 'التعلم بالبطاقات', 'العصف الذهني المصغر', 'التعلم بالاكتشاف الموجّه', 
    'التعلم من خلال الأغاني التعليمية', 'استراتيجية التمثيل والدراما', 'التعلم بالصور', 
    'التعلم القائم على الملاحظة', 'التعليم بالأنشطة الحسية', 'التعليم بالحركة', 
    'التعلم من خلال المحاكاة الرقمية', 'استراتيجية التساؤل', 'التعلم القائم على المشاريع الصغيرة', 
    'استراتيجية العرض والنموذج', 'التعلم بالمهام المصغّرة', 'التعلم من خلال التجريب', 
    'التعلم التعاوني المتقدّم', 'التعلم القائم على المشروعات', 'التعلم القائم على المشكلات', 
    'التعلم القائم على البحث', 'التعلم الذاتي', 'التعلم المقلوب', 'استراتيجية حل المشكلات', 
    'استراتيجية الحوار والمناقشة', 'التعليم القائم على التفكير الناقد', 'استراتيجية الخرائط الذهنية', 
    'استراتيجية التعلم بالخبرة', 'التعليم القائم على المواقف', 'التعليم القائم على المهام الواقعية', 
    'التعلم القائم على التصميم', 'استراتيجية التعليم المبرمج', 'التعلم القائم على القيم', 
    'التعلم القائم على الاستقصاء', 'التعلم القائم على التكنولوجيا', 'التعلم القائم على النمذجة', 
    'التعلم القائم على التفكير الإبداعي'
];

export const COMMON_TOOLS = [
    'السبورة', 'البطاقات التعليمية', 'النماذج المجسمة', 'الصور واللوحات', 'الشرائح الشفافة',
    'الأفلام التعليمية', 'الفيديو التعليمي', 'جهاز العرض الضوئي', 'الخرائط الجغرافية', 'المجسمات',
    'الرسوم البيانية', 'الألعاب التعليمية', 'الحاسب الآلي', 'السبورة الذكية', 'المعامل الافتراضية',
    'الكتب التفاعلية', 'الوسائط المتعددة', 'العينات الحقيقية', 'التسجيلات الصوتية', 'العروض التقديمية'
];

export const COMMON_SOURCES = [
    'الكتب الدراسية', 'المراجع الأكاديمية', 'المجلات العلمية', 'المواقع الإلكترونية التعليمية',
    'قواعد البيانات', 'المكتبات المدرسية', 'المكتبات الرقمية', 'المعلم', 'الزملاء (التعلم من الأقران)',
    'الدروس المصوّرة', 'الدورات التدريبية', 'المنصات التعليمية الإلكترونية', 'التطبيقات التعليمية',
    'المؤتمرات والندوات', 'الخبراء والمختصون', 'الرحلات التعليمية', 'المتاحف والمراكز العلمية',
    'القنوات التعليمية', 'الوثائق الرسمية', 'الدراسات الميدانية'
];


export const CLASS_SESSION_BRIEF_TEMPLATE: ClassSessionCriterionGroup[] = [
  { id: 'csb1', title: 'الكفايات الشخصية وسمات المعلم', criteria: [
    { id: 'csb1c1', label: 'يهتم بمظهره الشخصي', score: 0 },
    { id: 'csb1c2', label: 'يظهر ثقة بنفسه', score: 0 },
    { id: 'csb1c3', label: 'يتحدث بصوت ولغة سليمة', score: 0 },
  ]},
  { id: 'csb2', title: 'الخطة الدرسية', criteria: [
    { id: 'csb2c1', label: 'يسير في المنهج وفق الخطة', score: 0 },
    { id: 'csb2c2', label: 'يقدم خطة درسية مكتملة العناصر (كمي)', score: 0 },
    { id: 'csb2c3', label: 'يربط الخطة الدراسية بموضوع الدرس (نوعي)', score: 0 },
  ]},
   { id: 'csb3', title: 'إدارة الصف', criteria: [
    { id: 'csb3c1', label: 'يحافظ على قواعد الانضباط الصفي', score: 0 },
    { id: 'csb3c2', label: 'يدير التفاعل الصفي بنجاح', score: 0 },
    { id: 'csb3c3', label: 'يساهم في إيجاد مناخ صفي ملائم', score: 0 },
    { id: 'csb3c4', label: 'يوزع زمن الحصة على خطوات الدرس (تنفيذ)', score: 0 },
  ]},
  { id: 'csb4', title: 'الأداء والعرض المباشر للدرس', criteria: [
    { id: 'csb4c1', label: 'يهيئ ويمهد للدرس بصورة ملائمة', score: 0 },
    { id: 'csb4c2', label: 'يظهر إلماما بالمادة العلمية', score: 0 },
    { id: 'csb4c3', label: 'يراعي الفروق الفردية بين المتعلمين', score: 0 },
    { id: 'csb4c4', label: 'يربط الدرس بالتطبيقات والبيئة المحيطة', score: 0 },
    { id: 'csb4c5', label: 'ينمي القيم والأخلاق الحميدة', score: 0 },
    { id: 'csb4c6', label: 'يفعل دور المتعلمين ويحفزهم', score: 0 },
    { id: 'csb4c7', label: 'يطرح أسئلة صفية متنوعة', score: 0 },
    { id: 'csb4c8', label: 'يتابع أعمال المتعلمين أثناء الدرس', score: 0 },
    { id: 'csb4c9', label: 'يغلق الدرس بصورة مناسبة', score: 0 },
  ]},
  { id: 'csb5', title: 'السبورة والوسائل والأنشطة التعليمية', criteria: [
    { id: 'csb5c1', label: 'يمارس التقييم المعزز للتعلم', score: 0 },
    { id: 'csb5c2', label: 'يستخدم السبورة بفاعلية', score: 0 },
    { id: 'csb5c3', label: 'يوظف الوسائط التعليمية بصورة مناسبة', score: 0 },
    { id: 'csb5c4', label: 'يدير النشاط الصفي بفاعلية', score: 0 },
  ]},
  { id: 'csb6', title: 'تحصيل المتعلمين', criteria: [
    { id: 'csb6c1', label: 'يفعل سجل الدرجات في الحصة', score: 0 },
    { id: 'csb6c2', label: 'يقيس استيعاب المتعلمين', score: 0 },
    { id: 'csb6c3', label: 'يتابع دفاتر المتعلمين بفاعلية', score: 0 },
    { id: 'csb6c4', label: 'يفعل الواجب المنزلي والتعيينات', score: 0 },
    { id: 'csb6c5', label: 'يربط تحصيل المتعلمين بمصادر التعلم', score: 0 },
  ]},
  { id: 'csb7', title: 'مهارات المادة', criteria: [
    { id: 'csb7c1', label: 'ينفذ المهارات الأساسية للمادة', score: 0 },
  ]},
  { id: 'csb8', title: 'البيئة الصفية', criteria: [
    { id: 'csb8c1', label: 'مشاركة الطلاب وتفاعلهم', score: 0 },
    { id: 'csb8c2', label: 'التفاعل الإيجابي بين المعلم والطلاب', score: 0 },
  ]},
];

export const CLASS_SESSION_EXTENDED_TEMPLATE: ClassSessionCriterionGroup[] = [
  { id: 'cse1', title: 'متميز في الصفات الشخصية', criteria: [
      { id: 'cse1c1', label: 'يظهر بمظهر حسن', score: 0 },
      { id: 'cse1c2', label: 'يحترم مشاعر الآخرين', score: 0 },
      { id: 'cse1c3', label: 'يثق بنفسه', score: 0 },
  ]},
  { id: 'cse2', title: 'اكتمال الخطة والتحضير (كمي)', criteria: [
      { id: 'cse2c1', label: 'توفر البيانات العامة (صف، حصة، عنوان، تاريخ)', score: 0 },
      { id: 'cse2c2', label: 'توفر الأهداف والمحتوى والأساليب الوسائل والتقويم', score: 0 },
      { id: 'cse2c3', label: 'توفر التمهيد والغلق والواجب بشكل مناسب', score: 0 },
      { id: 'cse2c4', label: 'يحدد أدواراً نشطة للمعلم والمتعلم تتفق مع المحتوى', score: 0 },
  ]},
  { id: 'cse3', title: 'اتفاق عناصر التحضير مع الدرس (نوعي)', criteria: [
      { id: 'cse3c1', label: 'تتفق عناصر التحضير مع المحتوى ومهاراته', score: 0 },
      { id: 'cse3c2', label: 'الأهداف مصاغة من المستويات العليا والدنيا', score: 0 },
      { id: 'cse3c3', label: 'الأهداف سليمة الصياغة وخالية من الأخطاء الإملائية', score: 0 },
      { id: 'cse3c4', label: 'التقويم مصاغ بطريقة تقيس تحقق الأهداف', score: 0 },
  ]},
   { id: 'cse4', title: 'التهيئة والتمهيد مناسبان للدرس', criteria: [
      { id: 'cse4c1', label: 'تهيئة بيئية و نفسية(نظافة، نظام، قيام، مجموعات)', score: 0 },
      { id: 'cse4c2', label: 'تهيئة توجيهية وانتقالية من نشاط إلى آخر', score: 0 },
      { id: 'cse4c3', label: 'تمهيد مشوق ومناسب للدرس ويثير دافعية المتعلم', score: 0 },
      { id: 'cse4c4', label: 'تمهيد انتقالي من مهارة علمية إلى أخرى', score: 0 },
  ]},
  { id: 'cse5', title: 'استخدام السبورة بفاعلية', criteria: [
      { id: 'cse5c1', label: 'يكتب البيانات والدرس وينظم السبورة مع التلوين', score: 0 },
      { id: 'cse5c2', label: 'يكتب عناصر ومهارات الدرس مع الأمثلة والتلوين', score: 0 },
      { id: 'cse5c3', label: 'يكتب القواعد والأساسيات التي يشرحها', score: 0 },
      { id: 'cse5c4', label: 'خلو الكتابة من الأخطاء العلمية واللغوية والإملائية', score: 0 },
  ]},
  { id: 'cse6', title: 'وضوح الشرح بتمكن علمي وتسلسل منطقي للدرس', criteria: [
      { id: 'cse6c1', label: 'الشرح خالٍ من الأخطاء العلمية الملقاة في الدرس', score: 0 },
      { id: 'cse6c2', label: 'الشرح خالٍ من الأخطاء اللغوية الملقاة في الدرس', score: 0 },
      { id: 'cse6c3', label: 'يوضح المفاهيم والمصطلحات الواردة في الدرس', score: 0 },
      { id: 'cse6c4', label: 'يتدرج من السهل والمعلوم إلى الصعب والمجهول', score: 0 },
      { id: 'cse6c5', label: 'التسلسل كامل و مناسب لمحتوى الدرس والمتعلم', score: 0 },
      { id: 'cse6c6', label: 'يكثر من الأمثلة التطبيقية لكل مهارة ونشاط', score: 0 },
      { id: 'cse6c7', label: 'يصحح أخطاء الطلاب ويوجههم للصواب', score: 0 },
      { id: 'cse6c8', label: 'يعتمد على المقارنات لتوضيح الفروق العلمية', score: 0 },
      { id: 'cse6c9', label: 'يضع أسئلة متنوعة لإثارة نشاط الطلاب', score: 0 },
  ]},
  { id: 'cse7', title: 'الاستراتيجات ودور المتعلم', criteria: [
      { id: 'cse7c1', label: 'تنويع الأساليب بحيث لكل هدف أسلوب نشط', score: 0 },
      { id: 'cse7c2', label: 'يستخدم طرقاً نشطة مثيرة لانتباه الطلاب', score: 0 },
      { id: 'cse7c3', label: 'يشرك المتعلم في نشاط الدرس ( فردي، جماعي)', score: 0 },
      { id: 'cse7c4', label: 'يحدد أدواراً للمعلم والمتعلم نشطة تتفق مع المحتوى', score: 0 },
  ]},
   { id: 'cse8', title: 'مهارات التواصل', criteria: [
      { id: 'cse8c1', label: 'يحسن إيصال المعلومة بلغة جسد وتحرك متميز', score: 0 },
      { id: 'cse8c2', label: 'وضوح الصوت وتنوع نبراته وفق محتوى الدرس', score: 0 },
      { id: 'cse8c3', label: 'يحسن الاستماع والحوار مع جميع المتعلمين', score: 0 },
  ]},
  { id: 'cse9', title: 'ربط الدرس بالقيم وخبرات الطلاب', criteria: [
      { id: 'cse9c1', label: 'ربط الدرس بقيمة حياتية من واقع الطلبة', score: 0 },
      { id: 'cse9c2', label: 'ينوع في الأنشطة وفق قدرات الطلبة العقلية', score: 0 },
      { id: 'cse9c3', label: 'يقدم التغذية الراجعة أثناء تنفيذ الطلاب للمهارات', score: 0 },
  ]},
  { id: 'cse10', title: 'الوسائل والمصادر', criteria: [
      { id: 'cse10c1', label: 'توفر وسائل مناسبة ومتنوعة وملتزمة بالوقت', score: 0 },
      { id: 'cse10c2', label: 'يتم توظيف الكتاب ومصادر أخرى حسب النشاط', score: 0 },
  ]},
  { id: 'cse11', title: 'تفاعل المتعلمين مع الدرس', criteria: [
      { id: 'cse11c1', label: 'شارك جميع الطلبة في الدرس', score: 0 },
      { id: 'cse11c2', label: 'تفاعل جميع المتعلمين مع بعضهم', score: 0 },
      { id: 'cse11c3', label: 'تفاعل المتعلمين مع المعلم والوسيلة والنشاط', score: 0 },
  ]},
  { id: 'cse12', title: 'الإدارة الصفية وقواعد السلوك', criteria: [
      { id: 'cse12c1', label: 'إدارة فاعلة منضبطة نشطة وغير خاملة دائماً', score: 0 },
      { id: 'cse12c2', label: 'يفعل الطالب الخامل من خلال السؤال والمشاركة', score: 0 },
      { id: 'cse12c3', label: 'تعزيز السلوكيات المرغوبة وتقويم غير المرغوبة', score: 0 },
      { id: 'cse12c4', label: 'أنهى الحصة وغطى الوقت حسب المخطط له', score: 0 },
      { id: 'cse12c5', label: 'يستخدم سجل نقاط ودرجات المشاركات الطلابية', score: 0 },
      { id: 'cse12c6', label: 'يستخدم الفاظاً وأحكاماً تربوية مناسبة لمعالجة سلوك', score: 0 },
  ]},
  { id: 'cse13', title: 'التقويم والغلق مناسبان ومثيران', criteria: [
      { id: 'cse13c1', label: 'تقويم تشخيصي وبنائي وختامي مكتمل', score: 0 },
      { id: 'cse13c2', label: 'يطرح أسئلة تثير التفكير( عصف، تصنيف، سابرة)', score: 0 },
      { id: 'cse13c3', label: 'يتابع استجابات المتعلمين', score: 0 },
      { id: 'cse13c4', label: 'إغلاق الدرس بملخص أو مراجعة أو أسلوب مختلف', score: 0 },
  ]},
  { id: 'cse14', title: 'يهتم بالواجبات والتصحيح', criteria: [
      { id: 'cse14c1', label: 'تقديم واجبات وتعيينات مناسبة ومتنوعه', score: 0 },
      { id: 'cse14c2', label: 'يتابع تنفيذ الواجبات من قبل الطلاب', score: 0 },
      { id: 'cse14c3', label: 'يصحح الدفاتر أولا بأول', score: 0 },
      { id: 'cse14c4', label: 'يضع إشارات وتغذية راجعة ويصوب الخطأ', score: 0 },
  ]},
];

// For "Subject Specific", we can reuse the extended template as a base.
export const CLASS_SESSION_SUBJECT_SPECIFIC_TEMPLATE: ClassSessionCriterionGroup[] = JSON.parse(JSON.stringify(CLASS_SESSION_EXTENDED_TEMPLATE));

export const THEMES = {
  default: { name: 'الافتراضي', colors: { '--color-primary': '#16786d', '--color-primary-light': '#3ab3a3', '--color-background': '#f9fafb', '--color-text': '#1f2937', '--color-card-bg': '#ffffff', '--color-card-border': '#e5e7eb', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  ocean: { name: 'المحيط الهادئ', colors: { '--color-primary': '#006d77', '--color-primary-light': '#83c5be', '--color-background': '#edf6f9', '--color-text': '#2b2d42', '--color-card-bg': '#ffffff', '--color-card-border': '#e2e8f0', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  sunset: { name: 'غروب الشمس', colors: { '--color-primary': '#d95d39', '--color-primary-light': '#f08a5d', '--color-background': '#fefae0', '--color-text': '#3d405b', '--color-card-bg': '#ffffff', '--color-card-border': '#faedcd', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  forest: { name: 'الغابة الخضراء', colors: { '--color-primary': '#2d6a4f', '--color-primary-light': '#52b788', '--color-background': '#f1faee', '--color-text': '#1b4332', '--color-card-bg': '#ffffff', '--color-card-border': '#d8f3dc', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  royal: { name: 'الملكي الأنيق', colors: { '--color-primary': '#4c1d95', '--color-primary-light': '#8b5cf6', '--color-background': '#f5f3ff', '--color-text': '#1e1b4b', '--color-card-bg': '#ffffff', '--color-card-border': '#ede9fe', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  autumn: { name: 'الخريف الدافئ', colors: { '--color-primary': '#b86125', '--color-primary-light': '#e47e35', '--color-background': '#fff7ed', '--color-text': '#422006', '--color-card-bg': '#ffffff', '--color-card-border': '#fee9d1', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  charcoal: { name: 'الفحم الداكن', colors: { '--color-primary': '#495057', '--color-primary-light': '#adb5bd', '--color-background': '#212529', '--color-text': '#f8f9fa', '--color-card-bg': '#343a40', '--color-card-border': '#495057', '--color-header-bg': '#343a40', '--color-header-text': '#f8f9fa' } },
  sky: { name: 'السماء الزرقاء', colors: { '--color-primary': '#0284c7', '--color-primary-light': '#38bdf8', '--color-background': '#f0f9ff', '--color-text': '#0c4a6e', '--color-card-bg': '#ffffff', '--color-card-border': '#e0f2fe', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  rose: { name: 'الوردي الناعم', colors: { '--color-primary': '#db2777', '--color-primary-light': '#f472b6', '--color-background': '#fff1f2', '--color-text': '#831843', '--color-card-bg': '#ffffff', '--color-card-border': '#ffe4e6', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
  emeraldGlow: { name: 'الزمرد المتوهج', colors: { '--color-primary': '#059669', '--color-primary-light': '#34d399', '--color-background': '#f0fdf4', '--color-text': '#064e3b', '--color-card-bg': '#ffffff', '--color-card-border': '#d1fae5', '--color-header-bg': 'var(--color-primary)', '--color-header-text': '#ffffff' } },
};