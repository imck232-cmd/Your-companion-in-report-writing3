
import React, { useState } from 'react';
import { Teacher, Report, CustomCriterion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import TeacherList from './TeacherList';
import ReportView from './ReportView';
import AggregatedReports from './AggregatedReports';
import PerformanceDashboard from './PerformanceDashboard';

interface TeacherManagementProps {
  teachers: Teacher[];
  reports: Report[];
  customCriteria: CustomCriterion[];
  addTeacher: (name: string) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (teacherId: string) => void;
  saveReport: (report: Report) => void;
  deleteReport: (reportId: string) => void;
  addCustomCriterion: (criterion: CustomCriterion) => void;
}

type View = 'teachers' | 'aggregated_reports' | 'performance_dashboard';

const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, reports, customCriteria, addTeacher, updateTeacher, deleteTeacher, saveReport, deleteReport, addCustomCriterion }) => {
  const { t } = useLanguage();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeView, setActiveView] = useState<View>('teachers');
  
  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setActiveView('teachers');
  };

  const handleBackToList = () => {
    setSelectedTeacher(null);
  };

  const renderView = () => {
    switch (activeView) {
      case 'aggregated_reports':
        return <AggregatedReports reports={reports} teachers={teachers} />;
      case 'performance_dashboard':
        return <PerformanceDashboard reports={reports} teachers={teachers} />;
      case 'teachers':
      default:
        if (selectedTeacher) {
          return <ReportView 
                    teacher={selectedTeacher} 
                    reports={reports.filter(r => r.teacherId === selectedTeacher.id)} 
                    customCriteria={customCriteria}
                    onBack={handleBackToList} 
                    saveReport={saveReport} 
                    deleteReport={deleteReport} 
                    updateTeacher={updateTeacher} 
                    addCustomCriterion={addCustomCriterion}
                 />;
        }
        return <TeacherList teachers={teachers} onSelectTeacher={handleSelectTeacher} addTeacher={addTeacher} deleteTeacher={deleteTeacher} updateTeacher={updateTeacher} />;
    }
  };

  const getButtonClass = (view: View) => {
    return `px-5 py-2.5 rounded-lg font-bold transition-all text-sm md:text-base transform hover:scale-105 ${activeView === view ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button onClick={() => { setActiveView('teachers'); setSelectedTeacher(null); }} className={getButtonClass('teachers')}>
          {t('manageTeachersAndReports')}
        </button>
        <button onClick={() => { setActiveView('aggregated_reports'); setSelectedTeacher(null); }} className={getButtonClass('aggregated_reports')}>
          {t('aggregatedReports')}
        </button>
        <button onClick={() => { setActiveView('performance_dashboard'); setSelectedTeacher(null); }} className={getButtonClass('performance_dashboard')}>
          {t('performanceIndicators')}
        </button>
      </div>
      {renderView()}
    </div>
  );
};

export default TeacherManagement;