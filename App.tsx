
import React, { useState, useMemo, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { translations } from './i18n/translations';
import Header from './components/Header';
import Footer from './components/Footer';
import TeacherManagement from './components/TeacherManagement';
import { Teacher, Report, CustomCriterion } from './types';
import { INITIAL_TEACHERS, THEMES } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('teachers', INITIAL_TEACHERS);
  const [reports, setReports] = useLocalStorage<Report[]>('reports', []);
  const [theme, setTheme] = useLocalStorage<string>('theme', 'default');
  const [customCriteria, setCustomCriteria] = useLocalStorage<CustomCriterion[]>('customCriteria', []);


  useEffect(() => {
    // FIX: Iterate over the `colors` property of the theme object, not the theme object itself.
    const themeConfig = THEMES[theme as keyof typeof THEMES] || THEMES.default;
    const themeColors = themeConfig.colors;
    for (const key in themeColors) {
      document.documentElement.style.setProperty(key, themeColors[key as keyof typeof themeColors]);
    }
  }, [theme]);


  const t = useMemo(() => {
    return (key: keyof typeof translations.ar) => {
      return translations[language][key] || key;
    };
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const addTeacher = (name: string) => {
    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name,
    };
    setTeachers(prev => [...prev, newTeacher]);
  };
  
  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    setReports(prev => prev.filter(r => r.teacherId !== teacherId));
  };

  const saveReport = (report: Report) => {
    setReports(prev => {
      const existingIndex = prev.findIndex(r => r.id === report.id);
      if (existingIndex > -1) {
        const updatedReports = [...prev];
        // FIX: Corrected a typo from `existing-index` to the correct variable name `existingIndex`.
        updatedReports[existingIndex] = report;
        return updatedReports;
      }
      return [...prev, report];
    });
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const addCustomCriterion = (criterion: CustomCriterion) => {
    setCustomCriteria(prev => [...prev, criterion]);
  };


  return (
    <LanguageProvider value={{ language, t, toggleLanguage }}>
      <div className={`min-h-screen font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header currentTheme={theme} setTheme={setTheme} />
        <main className="container mx-auto p-4 md:p-6">
          <TeacherManagement 
            teachers={teachers} 
            reports={reports}
            customCriteria={customCriteria}
            addTeacher={addTeacher}
            updateTeacher={updateTeacher}
            deleteTeacher={deleteTeacher}
            saveReport={saveReport}
            deleteReport={deleteReport}
            addCustomCriterion={addCustomCriterion}
          />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;