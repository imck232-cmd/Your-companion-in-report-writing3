
import React, { useMemo, useState } from 'react';
import { Report, Teacher, GeneralEvaluationReport, ClassSessionEvaluationReport, EvaluationType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface PerformanceDashboardProps {
  reports: Report[];
  teachers: Teacher[];
}

type DashboardView = 'teacher_perf' | 'criteria_perf' | 'criteria_by_score' | 'other_works';

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ reports, teachers }) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<EvaluationType | 'all'>('all');
  const [activeView, setActiveView] = useState<DashboardView>('teacher_perf');
  
  const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t.name])), [teachers]);

  const filteredReports = useMemo(() => {
    if (filterType === 'all') return reports;
    return reports.filter(r => r.evaluationType === filterType);
  }, [reports, filterType]);

  const calculateReportPercentage = (report: Report): number => {
    let allScores: number[] = [];
    let maxScorePerItem = 4;
    
    if (report.evaluationType === 'general') {
        const criteria = (report as GeneralEvaluationReport).criteria;
        if (!criteria || criteria.length === 0) return 0;
        allScores = criteria.map(c => c.score);
    } else if (report.evaluationType === 'class_session') {
        const groups = (report as ClassSessionEvaluationReport).criterionGroups;
        if (!groups || groups.length === 0) return 0;
        allScores = groups.flatMap(g => g.criteria).map(c => c.score);
    }
    
    if (allScores.length === 0) return 0;
    const totalScore = allScores.reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = allScores.length * maxScorePerItem;
    if (maxPossibleScore === 0) return 0;
    return (totalScore / maxPossibleScore) * 100;
  };

  const teacherPerformance = useMemo(() => {
    const performance: { [teacherId: string]: { total: number; count: number } } = {};
    filteredReports.forEach(report => {
      if (!performance[report.teacherId]) {
        performance[report.teacherId] = { total: 0, count: 0 };
      }
      performance[report.teacherId].total += calculateReportPercentage(report);
      performance[report.teacherId].count += 1;
    });

    return Object.entries(performance)
      .map(([teacherId, data]) => ({
        teacherId,
        name: teacherMap.get(teacherId) || 'Unknown',
        average: data.count > 0 ? data.total / data.count : 0,
      }))
      .sort((a, b) => b.average - a.average);
  }, [filteredReports, teacherMap]);
  
  const criteriaPerformance = useMemo(() => {
    const criteriaData: { [label: string]: { totalScore: number; count: number } } = {};
    filteredReports.forEach(report => {
      const allCriteria = report.evaluationType === 'general'
        ? (report as GeneralEvaluationReport).criteria
        : (report as ClassSessionEvaluationReport).criterionGroups.flatMap(g => g.criteria);
      
      allCriteria.forEach(criterion => {
        if (!criteriaData[criterion.label]) {
          criteriaData[criterion.label] = { totalScore: 0, count: 0 };
        }
        criteriaData[criterion.label].totalScore += criterion.score;
        criteriaData[criterion.label].count += 1;
      });
    });

    const calculated = Object.entries(criteriaData).map(([label, data]) => ({
      label,
      average: data.count > 0 ? (data.totalScore / (data.count * 4)) * 100 : 0,
    }));
    
    const sorted = calculated.sort((a,b) => b.average - a.average);
    return {
        top: sorted.slice(0, 10),
        bottom: calculated.sort((a,b) => a.average - b.average).slice(0, 10),
    }
  }, [filteredReports]);

  const criteriaByScore = useMemo(() => {
    const data: { [criterionLabel: string]: { [score: number]: string[] } } = {};
    filteredReports.forEach(report => {
        const allCriteria = report.evaluationType === 'general'
        ? (report as GeneralEvaluationReport).criteria
        : (report as ClassSessionEvaluationReport).criterionGroups.flatMap(g => g.criteria);

        allCriteria.forEach(criterion => {
            if (!data[criterion.label]) data[criterion.label] = { 0: [], 1: [], 2: [], 3: [], 4: [] };
            const teacherName = teacherMap.get(report.teacherId);
            if(teacherName && !data[criterion.label][criterion.score].includes(teacherName)){
              data[criterion.label][criterion.score].push(teacherName);
            }
        });
    });
    return Object.entries(data).sort((a,b) => a[0].localeCompare(b[0]));
  }, [filteredReports, teacherMap]);

  const otherDataAnalysis = useMemo(() => {
    const strategies: { [key: string]: number } = {};
    const tools: { [key: string]: number } = {};
    const programs: { [key: string]: number } = {};
    const sources: { [key: string]: number } = {};

    filteredReports.forEach(report => {
        if (report.evaluationType === 'general') {
            const generalReport = report as GeneralEvaluationReport;
            generalReport.strategies.split(/[,،\n]/).forEach(s => { const term = s.trim(); if(term) strategies[term] = (strategies[term] || 0) + 1; });
            generalReport.tools.split(/[,،\n]/).forEach(t => { const term = t.trim(); if(term) tools[term] = (tools[term] || 0) + 1; });
            generalReport.programs.split(/[,،\n]/).forEach(p => { const term = p.trim(); if(term) programs[term] = (programs[term] || 0) + 1; });
            generalReport.sources.split(/[,،\n]/).forEach(s => { const term = s.trim(); if(term) sources[term] = (sources[term] || 0) + 1; });
        }
    });

    const sortData = (data: {[key: string]: number}) => Object.entries(data).sort((a,b) => b[1] - a[1]);

    return {
        strategies: sortData(strategies),
        tools: sortData(tools),
        programs: sortData(programs),
        sources: sortData(sources),
    };
  }, [filteredReports]);

  const getViewButtonClass = (view: DashboardView) => `px-4 py-2 rounded-md font-semibold transition-colors ${activeView === view ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`;

  const renderContent = () => {
    switch (activeView) {
        case 'teacher_perf':
            return (
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-center">أداء الموظفين (مرتب تنازلياً)</h3>
                    <ul className="space-y-3">
                        {teacherPerformance.map((perf, index) => (
                            <li key={perf.teacherId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="font-medium text-gray-800">{index + 1}. {perf.name}</span>
                            <span className="font-bold text-lg text-green-600">{perf.average.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        case 'criteria_perf':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-green-700 text-center text-lg">أعلى 10 معايير أداءً</h4>
                        <ul className="list-decimal list-inside ps-4 mt-2">
                            {criteriaPerformance.top.map((c) => <li key={c.label}>{c.label}: <span className="font-bold">{c.average.toFixed(1)}%</span></li>)}
                        </ul>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-red-700 text-center text-lg">أقل 10 معايير أداءً</h4>
                        <ul className="list-decimal list-inside ps-4 mt-2">
                            {criteriaPerformance.bottom.map((c) => <li key={c.label}>{c.label}: <span className="font-bold">{c.average.toFixed(1)}%</span></li>)}
                        </ul>
                    </div>
                </div>
            );
        case 'criteria_by_score':
            return (
                <div className="p-4 border rounded-lg space-y-4 max-h-[60vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-center">المعايير الوظيفية والتقييم العام</h3>
                    {criteriaByScore.map(([label, scores]) => (
                        <div key={label} className="p-3 bg-gray-50 rounded-md">
                            <h4 className="font-bold text-primary">{label}</h4>
                            <ul className="mt-2 text-sm space-y-1">
                                {[4, 3, 2, 1, 0].map(s => (
                                    scores[s].length > 0 && <li key={s}><span className="font-semibold">درجة {s}:</span> {scores[s].join('، ')}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        case 'other_works':
            return (
                 <div className="p-4 border rounded-lg space-y-4">
                     <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-center">الأعمال الأخرى (مرتبة بالأكثر استخداماً)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><h4 className="font-semibold text-gray-700">الاستراتيجيات:</h4><ul className="list-disc list-inside ps-4">{otherDataAnalysis.strategies.map(([name, count]) => <li key={name}>{name} ({count})</li>)}</ul></div>
                        <div><h4 className="font-semibold text-gray-700">الوسائل:</h4><ul className="list-disc list-inside ps-4">{otherDataAnalysis.tools.map(([name, count]) => <li key={name}>{name} ({count})</li>)}</ul></div>
                        <div><h4 className="font-semibold text-gray-700">المصادر:</h4><ul className="list-disc list-inside ps-4">{otherDataAnalysis.sources.map(([name, count]) => <li key={name}>{name} ({count})</li>)}</ul></div>
                        <div><h4 className="font-semibold text-gray-700">البرامج:</h4><ul className="list-disc list-inside ps-4">{otherDataAnalysis.programs.map(([name, count]) => <li key={name}>{name} ({count})</li>)}</ul></div>
                     </div>
                 </div>
            );
        default: return null;
    }
  }


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">{t('performanceIndicators')}</h2>
        
        <div className="p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="font-semibold">فلترة حسب نوع التقييم:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="p-2 border rounded-md focus:ring-primary focus:border-primary transition bg-inherit">
                <option value="all">الكل</option>
                <option value="general">{t('generalEvaluation')}</option>
                <option value="class_session">{t('classSessionEvaluation')}</option>
            </select>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 border-b pb-4">
            <button onClick={() => setActiveView('teacher_perf')} className={getViewButtonClass('teacher_perf')}>أداء الموظفين</button>
            <button onClick={() => setActiveView('criteria_perf')} className={getViewButtonClass('criteria_perf')}>أداء المعايير</button>
            <button onClick={() => setActiveView('criteria_by_score')} className={getViewButtonClass('criteria_by_score')}>المعايير حسب الدرجة</button>
            <button onClick={() => setActiveView('other_works')} className={getViewButtonClass('other_works')}>الأعمال الأخرى</button>
        </div>

        <div>
            {renderContent()}
        </div>
    </div>
  );
};

export default PerformanceDashboard;