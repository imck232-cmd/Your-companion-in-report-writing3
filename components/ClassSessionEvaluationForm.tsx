import React, { useState, useMemo, useEffect } from 'react';
import { ClassSessionEvaluationReport, Teacher, ClassSessionCriterionGroup, ClassSessionCriterion, CustomCriterion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { exportToTxt, exportToPdf, exportToExcel, sendToWhatsApp } from '../lib/exportUtils';
import { CLASS_SESSION_BRIEF_TEMPLATE, CLASS_SESSION_EXTENDED_TEMPLATE, CLASS_SESSION_SUBJECT_SPECIFIC_TEMPLATE } from '../constants';
import { verbToMasdar } from '../lib/nlp_ar';

interface ClassSessionEvaluationFormProps {
  report: ClassSessionEvaluationReport;
  teacher: Teacher;
  onSave: (report: ClassSessionEvaluationReport) => void;
  onCancel: () => void;
  isNewReport: boolean;
  addCustomCriterion: (criterion: CustomCriterion) => void;
}

const ClassSessionEvaluationForm: React.FC<ClassSessionEvaluationFormProps> = ({ report, teacher, onSave, onCancel, isNewReport, addCustomCriterion }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ClassSessionEvaluationReport>(report);
  const [activeSubType, setActiveSubType] = useState<'brief' | 'extended' | 'subject_specific'>(report.subType);

  useEffect(() => {
    let template: ClassSessionCriterionGroup[];
    switch(activeSubType){
      case 'brief': template = CLASS_SESSION_BRIEF_TEMPLATE; break;
      case 'extended': template = CLASS_SESSION_EXTENDED_TEMPLATE; break;
      case 'subject_specific': template = CLASS_SESSION_SUBJECT_SPECIFIC_TEMPLATE; break;
      default: template = [];
    }
    
    if (isNewReport || formData.subType !== activeSubType) {
       setFormData(prev => ({
          ...prev,
          subType: activeSubType,
          criterionGroups: JSON.parse(JSON.stringify(template))
       }));
    }
  }, [activeSubType, isNewReport, formData.subType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (groupIndex: number, criterionIndex: number, score: 0 | 1 | 2 | 3 | 4) => {
    const newGroups = [...formData.criterionGroups];
    newGroups[groupIndex].criteria[criterionIndex].score = score;
    setFormData(prev => ({ ...prev, criterionGroups: newGroups }));
  };
  
  const addCriterion = (groupIndex: number) => {
    const newCriterionName = window.prompt(t('criterionName'));
    if (!newCriterionName || !newCriterionName.trim()) return;

    const isGeneral = window.confirm('هل تريد إضافة هذا المعيار كـ "عام" لجميع المعلمين في هذه المدرسة؟\nاضغط "OK" لعام، أو "Cancel" لخاص بهذا التقرير فقط.');
    
    const newCriterion: ClassSessionCriterion = { id: `custom-${Date.now()}`, label: newCriterionName.trim(), score: 0 };
    const newGroups = [...formData.criterionGroups];
    newGroups[groupIndex].criteria.push(newCriterion);
    setFormData(prev => ({ ...prev, criterionGroups: newGroups }));

    if (isGeneral && formData.school) {
        const customCriterion: CustomCriterion = {
            id: `custom-g-${Date.now()}`,
            school: formData.school,
            evaluationType: 'class_session',
            subType: formData.subType,
            groupTitle: newGroups[groupIndex].title,
            criterion: { id: newCriterion.id, label: newCriterion.label }
        };
        addCustomCriterion(customCriterion);
    }
  };
  
  const removeCriterion = (groupIndex: number, criterionIndex: number) => {
     if (window.confirm(t('confirmDelete'))) {
      const newGroups = [...formData.criterionGroups];
      newGroups[groupIndex].criteria.splice(criterionIndex, 1);
      setFormData(prev => ({ ...prev, criterionGroups: newGroups }));
    }
  };


  const getScoreColor = (score: number) => {
    switch(score) {
      case 0: return 'bg-red-800 text-white border-red-800';
      case 1: return 'bg-warning text-white border-warning';
      case 2: return 'bg-light-yellow text-gray-800 border-light-yellow';
      case 3: return 'bg-blue-500 text-white border-blue-500';
      case 4: return 'bg-green-500 text-white border-green-500';
      default: return 'bg-gray-200 border-gray-300 hover:bg-gray-300';
    }
  };

  const getScoreFeedback = (score: number): string => {
    const key = `score_${score}` as keyof ReturnType<typeof useLanguage>['t'];
    return t(key as any);
  };
  
  const generateFeedback = () => {
    let positives: string[] = [];
    let notes: string[] = [];
    let recommendations: string[] = [];

    formData.criterionGroups.forEach(group => {
        group.criteria.forEach(criterion => {
            const masdar = verbToMasdar(criterion.label);
            switch(criterion.score) {
                case 4:
                    positives.push(`لقد تميزت في ${masdar}، ولقد وصلت إلى أعلى المستويات في هذا المعيار.`);
                    break;
                case 3:
                    positives.push(`الأداء كان قوياً في ${masdar} ونطمح أن يرتقي إلى أعلى المستويات.`);
                    break;
                case 2:
                    notes.push(`نطمح إلى الارتقاء أكثر في ${masdar} بحيث يرتقي إلى أعلى المستويات.`);
                    break;
                case 1:
                case 0:
                    recommendations.push(`نرجو التحسن بشكل أفضل في ${masdar} بحيث يرتقي إلى أعلى المستويات.`);
                    break;
            }
        });
    });

    setFormData(prev => ({
        ...prev,
        positives: positives.join('\n'),
        notesForImprovement: notes.join('\n'),
        recommendations: recommendations.join('\n')
    }));
  };

  const totalPercentage = useMemo(() => {
    const allCriteria = formData.criterionGroups.flatMap(g => g.criteria);
    if (allCriteria.length === 0) return 0;
    const totalScore = allCriteria.reduce((sum, c) => sum + c.score, 0);
    const maxScore = allCriteria.length * 4;
    if (maxScore === 0) return 0;
    return (totalScore / maxScore) * 100;
  }, [formData.criterionGroups]);

  const getPerformanceStyles = (percentage: number): { className: string, text: string } => {
    if (percentage <= 30) return { className: 'bg-red-800 text-white', text: t('percentage_0_30') };
    if (percentage <= 40) return { className: 'bg-red-500 text-white', text: t('percentage_31_40') };
    if (percentage <= 60) return { className: 'bg-yellow-300 text-gray-800', text: t('percentage_41_60') };
    if (percentage <= 74) return { className: 'bg-yellow-500 text-white', text: t('percentage_61_74') };
    if (percentage <= 80) return { className: 'bg-sky-400 text-white', text: t('percentage_75_80') };
    if (percentage <= 89) return { className: 'bg-sky-600 text-white', text: t('percentage_81_89') };
    return { className: 'bg-green-500 text-white', text: t('percentage_90_100') };
  };

  const performanceStyle = getPerformanceStyles(totalPercentage);

  const subTypeButtonClass = (type: 'brief' | 'extended' | 'subject_specific') => 
    `px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${activeSubType === type ? 'bg-primary text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`;

  return (
    <div className="p-4 md:p-6 rounded-lg shadow-md space-y-6" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
      <h2 className="text-2xl font-bold text-primary">{t('classSessionEvaluation')} - {teacher.name}</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg" style={{backgroundColor: 'rgba(128,128,128,0.05)', borderColor: 'var(--color-card-border)'}}>
        <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <input type="text" name="school" placeholder={t('schoolName')} value={formData.school} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <input type="text" name="subject" placeholder={t('subject')} value={formData.subject} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <input type="text" name="grades" placeholder={t('grades')} value={formData.grades} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <input type="text" name="supervisorName" placeholder="اسم المشرف" value={formData.supervisorName} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <select name="semester" value={formData.semester} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit">
          <option value="الأول">الفصل الدراسي الأول</option>
          <option value="الثاني">الفصل الدراسي الثاني</option>
        </select>
        <select name="visitType" value={formData.visitType} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit">
          {['استطلاعية', 'تقييمية 1', 'تقييمية 2', 'فنية إشرافية', 'تطويرية', 'تبادلية', 'تشخيصية', 'علاجية'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select name="class" value={formData.class} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit">
          {['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
         <select name="section" value={formData.section} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit">
          {['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <input type="text" name="lessonNumber" placeholder="رقم الدرس" value={formData.lessonNumber} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
        <input type="text" name="lessonName" placeholder={t('lessonTitle')} value={formData.lessonName} onChange={handleInputChange} className="p-2 border rounded focus:ring-primary focus:border-primary transition bg-inherit" />
      </div>

      <div className="flex justify-center gap-4 py-4">
        <button onClick={() => setActiveSubType('brief')} className={subTypeButtonClass('brief')}>التقييم المختصر</button>
        <button onClick={() => setActiveSubType('extended')} className={subTypeButtonClass('extended')}>التقييم الموسع</button>
        <button onClick={() => setActiveSubType('subject_specific')} className={subTypeButtonClass('subject_specific')}>التقييم حسب المادة</button>
      </div>

      <div className="space-y-6">
        {formData.criterionGroups.map((group, groupIndex) => (
          <div key={group.id} className="border rounded-lg" style={{borderColor: 'var(--color-primary-light)'}}>
            <div className="flex justify-between items-center p-3 rounded-t-lg" style={{backgroundColor: 'var(--color-primary-light)', color: 'white'}}>
                <h4 className="text-lg font-bold">{group.title}</h4>
                 <button onClick={() => addCriterion(groupIndex)} className="hover:text-gray-200 p-1 rounded-full hover:bg-black/20 transition-colors transform hover:scale-110" title={t('addNewCriterion')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            <div className="p-4 space-y-3">
              {group.criteria.map((criterion, critIndex) => (
                 <div key={criterion.id} className="flex flex-col md:flex-row items-center gap-4 border-b py-2" style={{borderColor: 'var(--color-card-border)'}}>
                    <div className="flex-grow flex items-center">
                        <button onClick={() => removeCriterion(groupIndex, critIndex)} className="text-red-500 hover:text-red-700 p-1 me-2 rtl:ms-2 rounded-full hover:bg-red-100 transition-colors transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <label className="font-medium">{criterion.label}</label>
                        <span className="text-sm text-gray-500 ms-2 rtl:me-2">({getScoreFeedback(criterion.score)})</span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {[0, 1, 2, 3, 4].map(score => (
                            <button key={score} onClick={() => handleScoreChange(groupIndex, critIndex, score as 0|1|2|3|4)} className={`w-10 h-10 rounded-full font-bold border-2 transition-transform transform hover:scale-110 ${criterion.score === score ? getScoreColor(score) : 'bg-gray-200 border-gray-300'}`}>
                                {score}
                            </button>
                        ))}
                    </div>
                 </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
       <div className={`text-center p-4 rounded-lg transition-colors duration-500 ${performanceStyle.className}`}>
        <h4 className="text-lg font-bold">{t('totalPercentage')}: <span className="text-2xl">{totalPercentage.toFixed(2)}%</span></h4>
        <p className="font-semibold mt-1">{performanceStyle.text}</p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
             <button onClick={generateFeedback} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold">{t('generateFeedback')}</button>
        </div>
        <textarea name="positives" placeholder="أهم الإيجابيات" value={formData.positives} onChange={handleInputChange} className="w-full p-2 border rounded h-24 focus:ring-primary focus:border-primary transition bg-inherit" />
        <textarea name="notesForImprovement" placeholder="أهم الملاحظات (للتحسين)" value={formData.notesForImprovement} onChange={handleInputChange} className="w-full p-2 border rounded h-24 focus:ring-primary focus:border-primary transition bg-inherit" />
        <textarea name="recommendations" placeholder="أهم التوصيات" value={formData.recommendations} onChange={handleInputChange} className="w-full p-2 border rounded h-24 focus:ring-primary focus:border-primary transition bg-inherit" />
        <textarea name="employeeComment" placeholder="تعليق الموظف" value={formData.employeeComment} onChange={handleInputChange} className="w-full p-2 border rounded h-24 focus:ring-primary focus:border-primary transition bg-inherit" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
        <button onClick={() => onSave(formData)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105">{t('save')}</button>
        <button onClick={onCancel} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105">{t('cancel')}</button>
        <button onClick={() => exportToTxt(formData, teacher)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105">{t('exportTxt')}</button>
        <button onClick={() => exportToPdf(formData, teacher)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105">{t('exportPdf')}</button>
        <button onClick={() => exportToExcel(formData, teacher)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105">{t('exportExcel')}</button>
        <button onClick={() => sendToWhatsApp(formData, teacher)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105">{t('sendToWhatsApp')}</button>
      </div>
    </div>
  );
};

export default ClassSessionEvaluationForm;