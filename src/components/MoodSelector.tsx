import React from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import type { Mood } from '../types/index.js';

interface MoodSelectorProps {
  date: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ date }) => {
  const { getDayData, setMood } = useCalendarStore();
  
  const dayData = getDayData(date);

  const moods: { value: Mood; emoji: string; label: string; color: string }[] = [
    { value: 'angry', emoji: '😡', label: 'Raiva', color: 'bg-red-100 border-red-200 hover:bg-red-200' },
    { value: 'tired', emoji: '😴', label: 'Cansado', color: 'bg-gray-100 border-gray-200 hover:bg-gray-200' },
    { value: 'sad', emoji: '😢', label: 'Triste', color: 'bg-blue-100 border-blue-200 hover:bg-blue-200' },
    { value: 'great', emoji: '😃', label: 'Ótimo', color: 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200' },
    { value: 'fun', emoji: '🤩', label: 'Divertido', color: 'bg-purple-100 border-purple-200 hover:bg-purple-200' },
  ];

  const handleMoodSelect = (mood: Mood) => {
    // If the same mood is clicked, deselect it
    if (dayData.mood === mood) {
      setMood(date, null);
    } else {
      setMood(date, mood);
    }
  };

  const selectedMood = moods.find(mood => mood.value === dayData.mood);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Como você se sente hoje?</h3>
      
      {/* Current mood display */}
      {selectedMood ? (
        <div className="bg-pastel-green p-4 rounded-lg text-center">
          <div className="text-4xl mb-2">{selectedMood.emoji}</div>
          <div className="text-lg font-medium text-gray-800">{selectedMood.label}</div>
          <div className="text-sm text-gray-600 mt-1">
            Clique novamente para remover
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">😐</div>
          <div className="text-gray-600">Selecione seu humor</div>
        </div>
      )}

      {/* Mood options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`
              p-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95
              ${dayData.mood === mood.value 
                ? 'border-gray-400 bg-gray-100 ring-2 ring-gray-300' 
                : mood.color
              }
            `}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium text-gray-700">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Mood history/insights */}
      <div className="bg-pastel-orange p-3 rounded-lg">
        <div className="text-sm text-gray-700">
          💡 <strong>Dica:</strong> Registrar seu humor diariamente pode ajudar a identificar padrões e melhorar seu bem-estar.
        </div>
      </div>
    </div>
  );
};