import React, { useState } from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { getDaysInMonth, formatDate, isSameMonth, isToday } from '../utils/dateUtils';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { daysData, setSelectedDate, setModalOpen } = useCalendarStore();

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleDayClick = (date: Date) => {
    if (isSameMonth(date, currentDate)) {
      const dateString = formatDate(date);
      setSelectedDate(dateString);
      setModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayIndicators = (date: Date) => {
    const dateString = formatDate(date);
    const dayData = daysData[dateString];
    
    if (!dayData) return null;
    
    const indicators = [];
    
    // Individual Todo items - only show tasks marked for calendar display
    const calendarTasks = dayData.tasks.filter(task => task.showInCalendar);
    if (calendarTasks.length > 0) {
      // Limit to 2 todos to prevent overflow, prioritize incomplete tasks
      const incompleteTasks = calendarTasks.filter(task => !task.completed);
      const completedTasks = calendarTasks.filter(task => task.completed);
      
      // Show incomplete tasks first, then completed ones if there's space
      const prioritizedTasks = [...incompleteTasks, ...completedTasks];
      const maxVisibleTasks = 2;
      const visibleTasks = prioritizedTasks.slice(0, maxVisibleTasks);
      const remainingTasks = calendarTasks.length - visibleTasks.length;
      
      visibleTasks.forEach((task) => {
        indicators.push(
          <div key={`task-${task.id}`} className="flex items-start space-x-1 text-xs">
            <span className="text-xs flex-shrink-0">{task.icon}</span>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
              task.completed ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <span className={`leading-tight break-words ${
              task.completed ? 'text-gray-500' : 'text-gray-700'
            }`} title={task.text}>
              {task.text}
            </span>
          </div>
        );
      });
      
      // Show "+X mais" if there are additional tasks
      if (remainingTasks > 0) {
        indicators.push(
          <div key="more-tasks" className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full text-center">
            +{remainingTasks} mais
          </div>
        );
      }
    }
    
    // Compact other indicators
    const otherIndicators = [];
    
    // Water indicator (compact)
    if (dayData.waterCount > 0) {
      otherIndicators.push(
        <span key="water" className="text-xs text-blue-500">💧{dayData.waterCount}</span>
      );
    }
    
    // Mood indicator
    if (dayData.mood) {
      const moodEmojis = {
        angry: '😡',
        tired: '😴',
        sad: '😢',
        great: '😃',
        fun: '🤩'
      };
      otherIndicators.push(
        <span key="mood" className="text-xs">
          {moodEmojis[dayData.mood]}
        </span>
      );
    }
    
    // Notes indicator
    if (dayData.notes && dayData.notes.trim().length > 0) {
      otherIndicators.push(
        <span key="notes" className="text-xs">📝</span>
      );
    }
    
    // Add other indicators as a single row if they exist
    if (otherIndicators.length > 0) {
      indicators.push(
        <div key="other-indicators" className="flex items-center space-x-1">
          {otherIndicators}
        </div>
      );
    }
    
    return indicators.length > 0 ? (
      <div className="absolute bottom-1 left-1 right-1 space-y-1 overflow-hidden">
        {indicators}
      </div>
    ) : null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg bg-pastel-pink hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg bg-pastel-pink hover:bg-pink-200 transition-colors"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(date)}
              className={`
                relative h-28 sm:h-32 border-2 rounded-lg p-2 cursor-pointer transition-all
                ${isCurrentMonth 
                  ? 'bg-white border-gray-200 hover:border-pastel-blue hover:shadow-md' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
                }
                ${isTodayDate && isCurrentMonth ? 'border-blue-400 bg-pastel-blue' : ''}
              `}
            >
              <span className={`text-sm font-medium ${isTodayDate && isCurrentMonth ? 'text-blue-800' : ''}`}>
                {date.getDate()}
              </span>
              {isCurrentMonth && getDayIndicators(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
};