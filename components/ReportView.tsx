import React, { useState } from 'react';
import { Teacher, Report, EvaluationType, GeneralEvaluationReport, ClassSessionEvaluationReport, CustomCriterion, GeneralCriterion, ClassSessionCriterion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import GeneralEvaluationForm from './GeneralEvaluationForm';
import ClassSessionEvaluationForm from './ClassSessionEvaluationForm';
import { GENERAL_EVALUATION_CRITERIA_TEMPLATE, CLASS_SESSION_BRIEF_TEMPLATE } from '../constants';

interface ReportViewProps {
  teacher: Teacher;
  reports: Report[];
  customCriteria: CustomCriterion[];
  onBack: () => void;
  saveReport: (report: Report) => void;
  deleteReport: (reportId: string) => void;
  updateTeacher: (teacher: Teacher) => void;
  addCustomCriterion: (criterion: CustomCriterion) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ teacher, reports, customCriteria, onBack, saveReport, deleteReport, updateTeacher, addCustomCriterion }) => {
  const { t } = useLanguage();
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleNewReport = (type: EvaluationType) => {
    // Find the most recent report of the same type for this teacher to pre-fill data
    const latestReportOfSameType = [...reports]
        .filter(r => r.evaluationType === type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Fallback to any latest report if no report of the same type is found
    const latestReportOverall = [...reports]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const latestReport = latestReportOfSameType || latestReportOverall;

    const baseReport = {
      id: `report-${Date.now()}`,
      teacherId: teacher.id,
      date: new Date().toISOString().split('T')[0],
      // Pre-fill with latest report data, fallback to teacher data, then to empty
      school: latestReport?.school || teacher.school || '',
      subject: latestReport?.subject || teacher.subject || '',
      grades: latestReport?.grades || teacher.grades || '',
      branch: latestReport?.branch || 'main',
    };
    
    if (type === 'general') {
        const schoolCustomCriteria = customCriteria
            .filter(c => c.school === baseReport.school && c.evaluationType === 'general')
            .map(c => ({ ...(c.criterion as Omit<GeneralCriterion, 'score'>), score: 0 }));

        const newReport: GeneralEvaluationReport = {
            ...baseReport,
            evaluationType: 'general',
            criteria: [
                ...GENERAL_EVALUATION_CRITERIA_TEMPLATE.map(c => ({...c, score: 0})),
                ...schoolCustomCriteria
            ],
            strategies: '',
            tools: '',
            programs: '',
            sources: '',
        };
        setEditingReport(newReport);
    } else if (type === 'class_session') {
        const latestClassReport = latestReport as ClassSessionEvaluationReport | undefined;
        
        const newReport: ClassSessionEvaluationReport = {
          ...baseReport,
          evaluationType: 'class_session',
          subType: 'brief',
          criterionGroups: JSON.parse(JSON.stringify(CLASS_SESSION_BRIEF_TEMPLATE)),
          // Pre-fill with latest class report data, then fallback to defaults
          supervisorName: latestClassReport?.supervisorName || '', 
          semester: latestClassReport?.semester || 'الأول', 
          visitType: latestClassReport?.visitType || 'استطلاعية', 
          class: latestClassReport?.class || 'الأول', 
          section: latestClassReport?.section || 'أ',
          lessonNumber: latestClassReport?.lessonNumber || '', 
          lessonName: latestClassReport?.lessonName || '', 
          positives: '', 
          notesForImprovement: '', 
          recommendations: '', 
          employeeComment: ''
        }
        setEditingReport(newReport);
    }
    setIsCreatingNew(true);
  };
  
  const cancelEdit = () => {
    setEditingReport(null);
    setIsCreatingNew(false);
  }

  const handleSaveReport = (report: Report) => {
    // Persist teacher info from the latest report
    const { school, subject, grades, branch } = report;
    if (teacher.school !== school || teacher.subject !== subject || teacher.grades !== grades || teacher.branch !== branch) {
      updateTeacher({ ...teacher, school, subject, grades, branch });
    }
    saveReport(report);
    cancelEdit();
  };
  
  const handleDelete = (reportId: string) => {
      if(window.confirm(t('confirmDelete'))) {
          deleteReport(reportId);
      }
  }

  if (editingReport) {
      if (editingReport.evaluationType === 'general') {
        return <GeneralEvaluationForm report={editingReport as GeneralEvaluationReport} teacher={teacher} onSave={handleSaveReport} onCancel={cancelEdit} addCustomCriterion={addCustomCriterion} />;
      }
      if (editingReport.evaluationType === 'class_session') {
        return <ClassSessionEvaluationForm report={editingReport as ClassSessionEvaluationReport} teacher={teacher} onSave={handleSaveReport} onCancel={cancelEdit} isNewReport={isCreatingNew} addCustomCriterion={addCustomCriterion} />;
      }
  }


  return (
    <div>
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline transition-all">&larr; {t('teachersList')}</button>
      <h2 className="text-2xl font-bold mb-4">{t('reportsFor')} {teacher.name}</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 border rounded-lg">
        <button onClick={() => handleNewReport('general')} className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 font-semibold">{t('generalEvaluation')}</button>
        <button onClick={() => handleNewReport('class_session')} className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105 font-semibold">{t('classSessionEvaluation')} </button>
      </div>

      <div className="space-y-4">
        {reports.length > 0 ? (
          [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(report => (
            <div key={report.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="font-semibold">{report.evaluationType === 'general' ? t('generalEvaluation') : `${t('classSessionEvaluation')} (${(report as ClassSessionEvaluationReport).subType})`}</p>
                <p className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingReport(report); setIsCreatingNew(false); }} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors transform hover:scale-105">{t('edit')}</button>
                <button onClick={() => handleDelete(report.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors transform hover:scale-105">{t('delete')}</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">{t('noReportsYet')}</p>
        )}
      </div>
    </div>
  );
};

export default ReportView;