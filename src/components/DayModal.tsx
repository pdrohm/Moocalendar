import React from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { formatDisplayDate } from '../utils/dateUtils';
import { Checklist } from './Checklist';
import { WaterTracker } from './WaterTracker';
import { MoodSelector } from './MoodSelector';

export const DayModal: React.FC = () => {
  const { selectedDate, isModalOpen, setModalOpen } = useCalendarStore();

  if (!isModalOpen || !selectedDate) return null;

  const date = new Date(selectedDate);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-pastel-pink p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {formatDisplayDate(date)}
            </h2>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            
            {/* Mobile: Stack vertically, Desktop: Grid layout */}
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
              
              {/* Left Column */}
              <div className="space-y-8">
                {/* Checklist Section */}
                <div className="bg-pastel-blue rounded-xl p-6">
                  <Checklist date={selectedDate} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Water Tracker Section */}
                <div className="bg-pastel-green rounded-xl p-6">
                  <WaterTracker date={selectedDate} />
                </div>

                {/* Mood Selector Section */}
                <div className="bg-pastel-yellow rounded-xl p-6">
                  <MoodSelector date={selectedDate} />
                </div>
              </div>
            </div>

            {/* Day Summary */}
            <div className="bg-pastel-purple rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumo do Dia</h3>
              <DaySummary date={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for day summary
const DaySummary: React.FC<{ date: string }> = ({ date }) => {
  const { getDayData } = useCalendarStore();
  const dayData = getDayData(date);

  const completedTasks = dayData.tasks.filter(task => task.completed).length;
  const totalTasks = dayData.tasks.length;
  const waterGoalAchieved = dayData.waterCount >= 8;

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  );
};