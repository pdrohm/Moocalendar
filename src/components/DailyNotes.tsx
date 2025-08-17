import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '../store/useCalendarStore';

interface DailyNotesProps {
  date: string;
}

export const DailyNotes: React.FC<DailyNotesProps> = ({ date }) => {
  const { getDayData, setNotes } = useCalendarStore();
  const dayData = getDayData(date);
  const [localNotes, setLocalNotes] = useState(dayData.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when date changes
  useEffect(() => {
    setLocalNotes(dayData.notes || '');
  }, [dayData.notes, date]);

  // Auto-save with debounce
  useEffect(() => {
    if (localNotes === (dayData.notes || '')) return;

    setIsSaving(true);
    const timeoutId = setTimeout(() => {
      setNotes(date, localNotes);
      setIsSaving(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      setIsSaving(false);
    };
  }, [localNotes, date, setNotes, dayData.notes]);

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(event.target.value);
  };

  const wordCount = localNotes.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = localNotes.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          📝 Notas do Dia
        </h3>
        <div className="flex items-center space-x-2">
          {isSaving && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
              Salvando...
            </div>
          )}
          {!isSaving && localNotes !== (dayData.notes || '') && (
            <div className="text-sm text-gray-500">
              Não salvo
            </div>
          )}
          {!isSaving && localNotes === (dayData.notes || '') && localNotes.length > 0 && (
            <div className="text-sm text-green-600">
              ✓ Salvo
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border-2 border-gray-100 focus-within:border-pastel-blue transition-colors">
        <textarea
          value={localNotes}
          onChange={handleNotesChange}
          placeholder="Escreva suas reflexões, pensamentos ou acontecimentos do dia..."
          className="w-full h-32 resize-none border-none outline-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed"
          aria-label="Notas diárias"
        />
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex space-x-4">
            <span>{wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}</span>
            <span>{charCount} {charCount === 1 ? 'caractere' : 'caracteres'}</span>
          </div>
          <div className="text-gray-400">
            {localNotes.length > 0 ? 'Auto-salvo em 1s' : 'Digite para começar'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {localNotes.length > 0 && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setLocalNotes('')}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Helpful Tips */}
      {localNotes.length === 0 && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Dicas para suas notas:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Como foi o seu dia? O que aconteceu de especial?</li>
            <li>• Quais foram seus sentimentos e emoções?</li>
            <li>• O que você aprendeu hoje?</li>
            <li>• Pelo que você é grato hoje?</li>
            <li>• Quais são seus planos para amanhã?</li>
          </ul>
        </div>
      )}
    </div>
  );
};
