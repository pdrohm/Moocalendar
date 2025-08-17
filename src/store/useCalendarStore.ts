import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarStore, DayData, Task } from '../types/index.js';

// Generate UUID compatible with all environments
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const createDefaultDayData = (date: string): DayData => ({
  date,
  tasks: [],
  waterCount: 0,
  mood: null,
  notes: '',
});

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      daysData: {},
      selectedDate: null,
      isModalOpen: false,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setModalOpen: (open) => set({ isModalOpen: open }),

      addTask: (date, text) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);
        
        const newTask: Task = {
          id: generateId(),
          text,
          completed: false,
          createdAt: new Date(),
          showInCalendar: true,
          icon: '📝',
        };

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: [...dayData.tasks, newTask],
            },
          },
        });
      },

      toggleTask: (date, taskId) => {
        const { daysData } = get();
        const dayData = daysData[date];
        
        if (!dayData) return;

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: dayData.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            },
          },
        });
      },

      deleteTask: (date, taskId) => {
        const { daysData } = get();
        const dayData = daysData[date];
        
        if (!dayData) return;

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: dayData.tasks.filter((task) => task.id !== taskId),
            },
          },
        });
      },

      toggleTaskCalendarVisibility: (date, taskId) => {
        const { daysData } = get();
        const dayData = daysData[date];
        
        if (!dayData) return;

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: dayData.tasks.map((task) =>
                task.id === taskId 
                  ? { ...task, showInCalendar: !task.showInCalendar } 
                  : task
              ),
            },
          },
        });
      },

      setTaskIcon: (date, taskId, icon) => {
        const { daysData } = get();
        const dayData = daysData[date];
        
        if (!dayData) return;

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: dayData.tasks.map((task) =>
                task.id === taskId 
                  ? { ...task, icon } 
                  : task
              ),
            },
          },
        });
      },

      updateTaskText: (date, taskId, text) => {
        const { daysData } = get();
        const dayData = daysData[date];
        
        if (!dayData) return;

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              tasks: dayData.tasks.map((task) =>
                task.id === taskId 
                  ? { ...task, text } 
                  : task
              ),
            },
          },
        });
      },

      setWaterCount: (date, count) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              waterCount: Math.max(0, count),
            },
          },
        });
      },

      incrementWater: (date) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              waterCount: dayData.waterCount + 1,
            },
          },
        });
      },

      decrementWater: (date) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              waterCount: Math.max(0, dayData.waterCount - 1),
            },
          },
        });
      },

      setMood: (date, mood) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              mood,
            },
          },
        });
      },

      setNotes: (date, notes) => {
        const { daysData } = get();
        const dayData = daysData[date] || createDefaultDayData(date);

        set({
          daysData: {
            ...daysData,
            [date]: {
              ...dayData,
              notes,
            },
          },
        });
      },

      getDayData: (date) => {
        const { daysData } = get();
        const existingData = daysData[date];
        
        if (!existingData) {
          return createDefaultDayData(date);
        }
        
        // Check if migration is needed
        const needsMigration = existingData.tasks.some(task => 
          task.showInCalendar === undefined || !task.icon
        );
        
        if (needsMigration) {
          // Migrate and save the data
          const migratedTasks = existingData.tasks.map(task => ({
            ...task,
            showInCalendar: task.showInCalendar !== undefined ? task.showInCalendar : true,
            icon: task.icon || '📝',
          }));

          const migratedData = {
            ...createDefaultDayData(date),
            ...existingData,
            notes: existingData.notes || '',
            tasks: migratedTasks,
          };

          // Save migrated data back to store
          set({
            daysData: {
              ...daysData,
              [date]: migratedData,
            },
          });

          return migratedData;
        }

        // No migration needed, return with defaults
        return {
          ...createDefaultDayData(date),
          ...existingData,
          notes: existingData.notes || '',
        };
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);