import React, { useEffect, useState } from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { formatDisplayDate } from '../utils/dateUtils';
import { Checklist } from './Checklist';
import { WaterTracker } from './WaterTracker';
import { MoodSelector } from './MoodSelector';
import { DailyNotes } from './DailyNotes';

export const DayDrawer: React.FC = () => {
  const { selectedDate, isModalOpen, setModalOpen } = useCalendarStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isModalOpen]);

  const handleClose = () => {
    setModalOpen(false);
  };

  if (!isVisible || !selectedDate) return null;

  const date = new Date(selectedDate);

  return (
    <>
      {/* Mobile Backdrop/Overlay - only on small screens */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'bg-opacity-20' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md lg:max-w-96 xl:max-w-[28rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-pastel-pink p-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {formatDisplayDate(date)}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4 space-y-6">
            
            {/* Checklist Section */}
            <div className="bg-pastel-blue rounded-xl p-4">
              <Checklist date={selectedDate} />
            </div>

            {/* Water Tracker Section */}
            <div className="bg-pastel-green rounded-xl p-4">
              <WaterTracker date={selectedDate} />
            </div>

            {/* Mood Selector Section */}
            <div className="bg-pastel-yellow rounded-xl p-4">
              <MoodSelector date={selectedDate} />
            </div>

            {/* Daily Notes Section */}
            <div className="bg-pastel-purple rounded-xl p-4">
              <DailyNotes date={selectedDate} />
            </div>

            {/* Day Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumo do Dia</h3>
              <DaySummary date={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Component for day summary
const DaySummary: React.FC<{ date: string }> = ({ date }) => {
  const { getDayData } = useCalendarStore();
  const dayData = getDayData(date);

  const completedTasks = dayData.tasks.filter(task => task.completed).length;
  const totalTasks = dayData.tasks.length;
  const waterGoalAchieved = dayData.waterCount >= 8;
  const hasNotes = (dayData.notes || '').trim().length > 0;
  const notesWordCount = (dayData.notes || '').trim().split(/\s+/).filter(word => word.length > 0).length;

  const getMoodText = () => {
    if (!dayData.mood) return 'Não registrado';
    
    const moodLabels = {
      angry: 'Raiva 😡',
      tired: 'Cansado 😴',
      sad: 'Triste 😢',
      great: 'Ótimo 😃',
      fun: 'Divertido 🤩'
    };
    
    return moodLabels[dayData.mood];
  };

  return (
    <div className="space-y-4">
      {/* Tasks Summary */}
      <div className="bg-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-sm text-gray-600">Tarefas</div>
          {totalTasks > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Water Summary */}
      <div className="bg-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {dayData.waterCount}
          </div>
          <div className="text-sm text-gray-600">Copos de água</div>
          <div className={`text-xs mt-1 ${waterGoalAchieved ? 'text-green-600' : 'text-gray-500'}`}>
            {waterGoalAchieved ? '✓ Meta atingida!' : `Meta: 8 copos`}
          </div>
        </div>
      </div>

      {/* Mood Summary */}
      <div className="bg-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-800">
            {getMoodText()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Humor do dia</div>
        </div>
      </div>

      {/* Notes Summary */}
      <div className="bg-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {hasNotes ? notesWordCount : 0}
          </div>
          <div className="text-sm text-gray-600">Palavras nas notas</div>
          <div className={`text-xs mt-1 ${hasNotes ? 'text-purple-600' : 'text-gray-400'}`}>
            {hasNotes ? '📝 Notas registradas' : 'Nenhuma nota ainda'}
          </div>
        </div>
      </div>
    </div>
  );
};