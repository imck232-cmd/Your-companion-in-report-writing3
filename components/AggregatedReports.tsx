
import React, { useState, useMemo } from 'react';
import { Report, Teacher, EvaluationType, GeneralEvaluationReport, ClassSessionEvaluationReport, ClassSessionCriterion, GeneralCriterion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { exportAggregatedToTxt, exportAggregatedToPdf, exportAggregatedToExcel, sendAggregatedToWhatsApp } from '../lib/exportUtils';

interface AggregatedReportsProps {
  reports: Report[];
  teachers: Teacher[];
}

type ReportWithPercentage = Report & {
    percentage: number;
};

const AggregatedReports: React.FC<AggregatedReportsProps> = ({ reports, teachers }) => {
  const { t, language } = useLanguage();
  const [filterType, setFilterType] = useState<EvaluationType | 'all'>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openStatus, setOpenStatus] = useState<string | null>(null);
  const [openCriterion, setOpenCriterion] = useState<string | null>(null);

  const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t.name])), [teachers]);

  const calculateReportPercentage = (report: Report): number => {
    let allScores: number[] = [];
    if(report.evaluationType === 'general') {
        allScores = (report as GeneralEvaluationReport).criteria.map(c => c.score);
    } else if (report.evaluationType === 'class_session') {
        allScores = (report as ClassSessionEvaluationReport).criterionGroups.flatMap(g => g.criteria).map(c => c.score);
    }
    if (allScores.length === 0) return 0;
    const totalScore = allScores.reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = allScores.length * 4;
    if (maxPossibleScore === 0) return 0;
    return (totalScore / maxPossibleScore) * 100;
  };
  
  const getPerformanceStatus = (percentage: number): { key: string, label: string } => {
    if (percentage <= 30) return { key: 'status_0_30', label: t('percentage_0_30') };
    if (percentage <= 40) return { key: 'status_31_40', label: t('percentage_31_40') };
    if (percentage <= 60) return { key: 'status_41_60', label: t('percentage_41_60') };
    if (percentage <= 74) return { key: 'status_61_74', label: t('percentage_61_74') };
    if (percentage <= 80) return { key: 'status_75_80', label: t('percentage_75_80') };
    if (percentage <= 89) return { key: 'status_81_89', label: t('percentage_81_89') };
    return { key: 'status_90_100', label: t('percentage_90_100') };
  };

  const reportsWithPercentage = useMemo(() => {
    return reports.map(r => ({ ...r, percentage: calculateReportPercentage(r) }));
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reportsWithPercentage.filter(report => {
      const typeMatch = filterType === 'all' || report.evaluationType === filterType;
      const teacherMatch = filterTeacher === 'all' || report.teacherId === filterTeacher;
      const teacherName = teacherMap.get(report.teacherId)?.toLowerCase() || '';
      const searchMatch = !searchTerm || teacherName.includes(searchTerm.toLowerCase());
      return typeMatch && teacherMatch && searchMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reportsWithPercentage, filterType, filterTeacher, searchTerm, teacherMap]);
  
  const reportsByCriterion = useMemo(() => {
    const grouped: { [key: string]: { scores: number[], count: number } } = {};
    filteredReports.forEach(report => {
        const allCriteria: (GeneralCriterion | ClassSessionCriterion)[] = report.evaluationType === 'general'
            ? (report as GeneralEvaluationReport).criteria
            : (report as ClassSessionEvaluationReport).criterionGroups.flatMap(g => g.criteria);
        
        allCriteria.forEach(criterion => {
            if (!grouped[criterion.label]) {
                grouped[criterion.label] = { scores: [], count: 0 };
            }
            grouped[criterion.label].scores.push(criterion.score);
            grouped[criterion.label].count++;
        });
    });
    return Object.entries(grouped).map(([label, data]) => {
        const totalScore = data.scores.reduce((sum, s) => sum + s, 0);
        const average = data.count > 0 ? (totalScore / (data.count * 4)) * 100 : 0;
        const scoreDistribution = data.scores.reduce((acc, score) => {
            acc[score] = (acc[score] || 0) + 1;
            return acc;
        }, {} as {[key: number]: number});
        return { label, average, count: data.count, scoreDistribution };
    }).sort((a, b) => b.average - a.average);
  }, [filteredReports]);

  const reportsByStatus = useMemo(() => {
    const grouped: { [key: string]: { label: string; reports: ReportWithPercentage[] } } = {};
    reportsWithPercentage.forEach(report => {
        const status = getPerformanceStatus(report.percentage);
        if (!grouped[status.key]) {
            grouped[status.key] = { label: status.label, reports: [] };
        }
        grouped[status.key].reports.push(report);
    });
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])); // Sort by key
  }, [reportsWithPercentage, language]);


  const overallAverage = useMemo(() => {
    if (filteredReports.length === 0) return 0;
    const totalPercentage = filteredReports.reduce((sum, report) => sum + report.percentage, 0);
    return totalPercentage / filteredReports.length;
  }, [filteredReports]);

  return (
    <div className="space-y-6 p-6 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
      <h2 className="text-2xl font-bold text-primary">{t('aggregatedReports')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border" style={{backgroundColor: 'rgba(128,128,128,0.05)', borderColor: 'var(--color-card-border)'}}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary transition bg-inherit">
          <option value="all">جميع أنواع التقارير</option>
          <option value="general">{t('generalEvaluation')}</option>
          <option value="class_session">{t('classSessionEvaluation')}</option>
        </select>
        <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)} className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary transition bg-inherit">
          <option value="all">جميع المعلمين</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input
            type="text"
            placeholder="ابحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary transition bg-inherit"
        />
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto p-2">
        {filteredReports.map(report => (
            <div key={report.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: 'var(--color-background)', borderColor: 'var(--color-card-border)'}}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{teacherMap.get(report.teacherId) || 'Unknown Teacher'}</p>
                  <p className="text-sm">{report.evaluationType === 'general' ? t('generalEvaluation') : t('classSessionEvaluation')}</p>
                  <p className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
                </div>
                <div className="text-lg font-bold text-primary">
                  {report.percentage.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
         {filteredReports.length === 0 && <p className="text-center py-8">لا توجد تقارير تطابق الفلاتر المحددة.</p>}
      </div>

      {filteredReports.length > 0 && (
         <div className="mt-6 p-4 bg-primary-light/20 rounded-lg text-center">
            <h3 className="text-xl font-bold text-primary">
                متوسط النسبة المئوية للتقارير المعروضة: <span className="text-2xl">{overallAverage.toFixed(2)}%</span>
            </h3>
         </div>
      )}
      
       {filteredReports.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
                <button onClick={() => exportAggregatedToTxt(filteredReports, teachers)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105">{t('exportTxt')}</button>
                <button onClick={() => exportAggregatedToPdf(filteredReports, teachers)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105">{t('exportPdf')}</button>
                <button onClick={() => exportAggregatedToExcel(filteredReports, teachers)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105">{t('exportExcel')}</button>
                <button onClick={() => sendAggregatedToWhatsApp(filteredReports, teachers)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105">{t('sendToWhatsApp')}</button>
            </div>
        )}
        
        <div className="border-t pt-6" style={{ borderColor: 'var(--color-card-border)' }}>
            <h3 className="text-xl font-bold text-primary mb-4">تقارير خاصة حسب المعيار</h3>
            <div className="space-y-2">
                 {reportsByCriterion.map(({ label, average, count, scoreDistribution }) => (
                     <div key={label} className="border rounded-lg" style={{ borderColor: 'var(--color-card-border)' }}>
                        <button onClick={() => setOpenCriterion(openCriterion === label ? null : label)} className="w-full text-right rtl:text-right ltr:text-left p-4 flex justify-between items-center font-semibold hover:bg-primary-light/10">
                            <span>{label} ({count} مرات)</span>
                            <span className="flex items-center gap-2">
                               <span className="font-bold text-primary">{average.toFixed(1)}%</span>
                               <span className={`transform transition-transform ${openCriterion === label ? 'rotate-180' : ''}`}>▼</span>
                            </span>
                        </button>
                        {openCriterion === label && (
                            <div className="p-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
                                <ul className="list-inside list-disc">
                                  {[4, 3, 2, 1, 0].map(score => (
                                      scoreDistribution[score] && <li key={score}>درجة {score}: {scoreDistribution[score]} تقارير</li>
                                  ))}
                                </ul>
                            </div>
                        )}
                    </div>
                 ))}
            </div>
        </div>


        <div className="border-t pt-6" style={{ borderColor: 'var(--color-card-border)' }}>
            <h3 className="text-xl font-bold text-primary mb-4">{t('reportsByStatus')}</h3>
            <div className="space-y-2">
                {reportsByStatus.map(([key, { label, reports: statusReports }]) => (
                    <div key={key} className="border rounded-lg" style={{ borderColor: 'var(--color-card-border)' }}>
                        <button onClick={() => setOpenStatus(openStatus === key ? null : key)} className="w-full text-right rtl:text-right ltr:text-left p-4 flex justify-between items-center font-semibold hover:bg-primary-light/10">
                            <span>{label} ({statusReports.length})</span>
                            <span className={`transform transition-transform ${openStatus === key ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {openStatus === key && (
                            <div className="p-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
                                {statusReports.map(r => (
                                    <div key={r.id} className="mb-2 p-2 rounded bg-gray-50 flex justify-between">
                                        <span>{teacherMap.get(r.teacherId)} - ({r.evaluationType === 'general' ? t('generalEvaluation') : t('classSessionEvaluation')})</span>
                                        <span className="font-bold">{r.percentage.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

    </div>
  );
};

export default AggregatedReports;