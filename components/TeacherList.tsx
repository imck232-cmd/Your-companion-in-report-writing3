
import React, { useState, useMemo } from 'react';
import { Teacher } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TeacherListProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
  addTeacher: (name: string) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacher: (teacher: Teacher) => void;
}

const PlusIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const PencilIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const TeacherList: React.FC<TeacherListProps> = ({ teachers, onSelectTeacher, addTeacher, deleteTeacher, updateTeacher }) => {
  const { t } = useLanguage();
  const [newTeacherName, setNewTeacherName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTeacher = () => {
    if (newTeacherName.trim()) {
      addTeacher(newTeacherName.trim());
      setNewTeacherName('');
    }
  };

  const handleDelete = (e: React.MouseEvent, teacherId: string) => {
    e.stopPropagation();
    if (window.confirm(t('confirmDelete'))) {
      deleteTeacher(teacherId);
    }
  };
  
  const handleEdit = (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    const newName = window.prompt(t('editTeacher'), teacher.name);
    if (newName && newName.trim() && newName.trim() !== teacher.name) {
      updateTeacher({ ...teacher, name: newName.trim() });
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter(teacher => teacher.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teachers, searchTerm]);


  return (
    <div className="space-y-8">
      {/* Add Teacher Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-primary">{t('addTeacher')}</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder={t('teacherName')}
            className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            value={newTeacherName}
            onChange={(e) => setNewTeacherName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTeacher()}
          />
          <button onClick={handleAddTeacher} className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 transform hover:scale-105">
            <PlusIcon />
            <span>{t('add')}</span>
          </button>
        </div>
      </div>

      {/* Teacher List Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-xl font-semibold text-primary">{t('teachersList')}</h3>
             <input
                type="text"
                placeholder={t('searchForTeacher')}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="space-y-3">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map(teacher => (
              <div
                key={teacher.id}
                className="p-3 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3 hover:border-primary hover:bg-gray-50 transition-all duration-200"
              >
                <span className="font-medium text-gray-800">{teacher.name}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => onSelectTeacher(teacher)} className="px-3 py-1.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1 transition-colors transform hover:scale-105">
                    <PlusIcon />
                    <span>{t('newReportForTeacher')}</span>
                  </button>
                   <button
                    onClick={(e) => handleEdit(e, teacher)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors transform hover:scale-110"
                    title={t('edit')}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, teacher.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors transform hover:scale-110"
                    title={t('delete')}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">{t('selectTeacherToViewReports')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;