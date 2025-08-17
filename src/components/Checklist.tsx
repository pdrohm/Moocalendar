import React, { useState } from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import type { Task } from '../types/index.js';
import { IconSelector } from './IconSelector';

interface ChecklistProps {
  date: string;
}

export const Checklist: React.FC<ChecklistProps> = ({ date }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [iconSelectorTaskId, setIconSelectorTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const { getDayData, addTask, toggleTask, deleteTask, toggleTaskCalendarVisibility, setTaskIcon, updateTaskText } = useCalendarStore();
  
  const dayData = getDayData(date);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(date, newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(date, taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(date, taskId);
  };

  const handleToggleCalendarVisibility = (taskId: string) => {
    toggleTaskCalendarVisibility(date, taskId);
  };

  const handleIconClick = (taskId: string) => {
    setIconSelectorTaskId(iconSelectorTaskId === taskId ? null : taskId);
  };

  const handleIconSelect = (taskId: string, icon: string) => {
    setTaskIcon(date, taskId, icon);
    setIconSelectorTaskId(null);
  };

  const handleEditClick = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const handleEditSave = (taskId: string) => {
    if (editingText.trim()) {
      updateTaskText(date, taskId, editingText.trim());
    }
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      handleEditSave(taskId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Lista de Tarefas</h3>
      
      {/* Add new task form */}
      <form onSubmit={handleAddTask} className="flex space-x-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pastel-green hover:bg-green-200 text-gray-800 rounded-lg transition-colors font-medium"
        >
          Adicionar
        </button>
      </form>

      {/* Tasks list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {dayData.tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma tarefa adicionada ainda</p>
        ) : (
          dayData.tasks.map((task: Task) => (
            <div
              key={task.id}
              className={`relative flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                task.completed 
                  ? 'bg-pastel-green border-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Task completion checkbox */}
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-400 border-green-400 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {task.completed && '✓'}
              </button>

              {/* Custom icon */}
              <button
                onClick={() => handleIconClick(task.id)}
                className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                title="Alterar ícone"
              >
                {task.icon}
              </button>
              
              {/* Task text */}
              {editingTaskId === task.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                    className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(task.id)}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Salvar"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-red-500 hover:text-red-600 p-1"
                    title="Cancelar"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span
                  className={`flex-1 transition-all cursor-pointer hover:bg-gray-50 px-2 py-1 rounded ${
                    task.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-800'
                  }`}
                  onClick={() => handleEditClick(task.id, task.text)}
                  title="Clique para editar"
                >
                  {task.text}
                </span>
              )}

              {/* Calendar visibility toggle */}
              <button
                onClick={() => handleToggleCalendarVisibility(task.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  task.showInCalendar 
                    ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600'
                }`}
                title={task.showInCalendar ? 'Visível no calendário - clique para ocultar' : 'Oculto do calendário - clique para mostrar'}
              >
                📅
              </button>
              
              {/* Delete button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                title="Deletar tarefa"
              >
                🗑️
              </button>

            </div>
          ))
        )}
      </div>

      {/* Tasks summary */}
      {dayData.tasks.length > 0 && (
        <div className="bg-pastel-blue p-3 rounded-lg space-y-1">
          <p className="text-sm text-gray-700">
            Progresso: {dayData.tasks.filter(task => task.completed).length} de {dayData.tasks.length} tarefas concluídas
          </p>
          <p className="text-xs text-gray-600">
            📅 {dayData.tasks.filter(task => task.showInCalendar).length} tarefas visíveis no calendário
          </p>
        </div>
      )}

      {/* Icon Selector Modal */}
      {iconSelectorTaskId && (
        <IconSelector
          currentIcon={dayData.tasks.find(task => task.id === iconSelectorTaskId)?.icon || '📝'}
          onIconSelect={(icon) => handleIconSelect(iconSelectorTaskId, icon)}
          onClose={() => setIconSelectorTaskId(null)}
        />
      )}
    </div>
  );
};