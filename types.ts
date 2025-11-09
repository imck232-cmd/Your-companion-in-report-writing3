export type Language = 'ar' | 'en';

export interface Teacher {
  id: string;
  name: string;
  school?: string;
  subject?: string;
  grades?: string;
  branch?: string; 
}

export interface BaseReport {
  id: string;
  teacherId: string;
  date: string;
  school: string;
  subject: string;
  grades: string;
  branch: string;
}

// General Evaluation Types
export interface GeneralCriterion {
  id: string;
  label: string;
  score: 0 | 1 | 2 | 3 | 4;
  progress?: 'متقدم' | 'مطابق' | 'متأخر';
  lastLessonTitle?: string;
}

export interface GeneralEvaluationReport extends BaseReport {
  evaluationType: 'general';
  criteria: GeneralCriterion[];
  strategies: string;
  tools: string;
  programs: string;
  sources: string;
}


// Class Session Evaluation Types
export type VisitType = 'استطلاعية' | 'تقييمية 1' | 'تقييمية 2' | 'فنية إشرافية' | 'تطويرية' | 'تبادلية' | 'تشخيصية' | 'علاجية';
export type ClassNumber = 'الأول' | 'الثاني' | 'الثالث' | 'الرابع' | 'الخامس' | 'السادس' | 'السابع' | 'الثامن' | 'التاسع' | 'العاشر' | 'الحادي عشر' | 'الثاني عشر';
export type Section = 'أ' | 'ب' | 'ج' | 'د' | 'هـ' | 'و' | 'ز' | 'ح' | 'ط';

export interface ClassSessionCriterion {
  id: string;
  label: string;
  score: 0 | 1 | 2 | 3 | 4;
}

export interface ClassSessionCriterionGroup {
  id: string;
  title: string;
  criteria: ClassSessionCriterion[];
}

export interface ClassSessionEvaluationReport extends BaseReport {
  evaluationType: 'class_session';
  subType: 'brief' | 'extended' | 'subject_specific';
  supervisorName: string;
  semester: 'الأول' | 'الثاني';
  visitType: VisitType;
  class: ClassNumber;
  section: Section;
  lessonNumber: string;
  lessonName: string;
  criterionGroups: ClassSessionCriterionGroup[];
  positives: string;
  notesForImprovement: string;
  recommendations: string;
  employeeComment: string;
}


export type Report = GeneralEvaluationReport | ClassSessionEvaluationReport;

export type EvaluationType = 'general' | 'class_session';

export interface CustomCriterion {
  id: string;
  school: string;
  evaluationType: 'general' | 'class_session';
  subType?: 'brief' | 'extended' | 'subject_specific';
  groupTitle?: string; // For class session criteria
  criterion: Omit<GeneralCriterion | ClassSessionCriterion, 'score'>;
}