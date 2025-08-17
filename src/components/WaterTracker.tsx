import React from 'react';
import { useCalendarStore } from '../store/useCalendarStore';

interface WaterTrackerProps {
  date: string;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ date }) => {
  const { getDayData, incrementWater, decrementWater } = useCalendarStore();
  
  const dayData = getDayData(date);

  const renderWaterGlasses = () => {
    const glasses = [];
    const maxDisplay = 8; // Maximum glasses to display visually
    
    for (let i = 0; i < Math.min(dayData.waterCount, maxDisplay); i++) {
      glasses.push(
        <div key={i} className="text-2xl">💧</div>
      );
    }
    
    // Fill remaining spaces with empty glasses
    for (let i = dayData.waterCount; i < maxDisplay; i++) {
      glasses.push(
        <div key={i} className="text-2xl opacity-20">💧</div>
      );
    }
    
    return glasses;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Contador de Água</h3>
      
      {/* Water counter display */}
      <div className="bg-pastel-blue p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-blue-800 mb-2">
          {dayData.waterCount}
        </div>
        <div className="text-sm text-gray-600">
          {dayData.waterCount === 1 ? 'copo' : 'copos'} de água
        </div>
      </div>

      {/* Visual representation */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded-lg border border-gray-200">
        {renderWaterGlasses()}
      </div>
      
      {/* If more than 8 glasses, show additional count */}
      {dayData.waterCount > 8 && (
        <div className="text-center text-sm text-gray-600">
          + {dayData.waterCount - 8} copos adicionais
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => decrementWater(date)}
          disabled={dayData.waterCount === 0}
          className="px-6 py-3 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-600 rounded-lg transition-colors font-medium"
        >
          - Remover
        </button>
        
        <button
          onClick={() => incrementWater(date)}
          className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors font-medium"
        >
          + Adicionar
        </button>
      </div>

      {/* Goal indicator */}
      <div className="bg-pastel-yellow p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Meta diária: 8 copos</span>
          <div className="flex items-center space-x-2">
            {dayData.waterCount >= 8 ? (
              <>
                <span className="text-green-600 font-medium">✓ Meta atingida!</span>
                <div className="text-lg">🎉</div>
              </>
            ) : (
              <span className="text-gray-600">
                Faltam {8 - dayData.waterCount} copos
              </span>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((dayData.waterCount / 8) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};