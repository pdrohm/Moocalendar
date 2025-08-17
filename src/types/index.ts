export type Mood = 'angry' | 'tired' | 'sad' | 'great' | 'fun';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  showInCalendar: boolean;
  icon: string;
}

export interface DayData {
  date: string;
  tasks: Task[];
  waterCount: number;
  mood: Mood | null;
  notes: string;
}

export interface CalendarStore {
  daysData: Record<string, DayData>;
  selectedDate: string | null;
  isModalOpen: boolean;
  
  setSelectedDate: (date: string | null) => void;
  setModalOpen: (open: boolean) => void;
  
  addTask: (date: string, text: string) => void;
  toggleTask: (date: string, taskId: string) => void;
  deleteTask: (date: string, taskId: string) => void;
  toggleTaskCalendarVisibility: (date: string, taskId: string) => void;
  setTaskIcon: (date: string, taskId: string, icon: string) => void;
  updateTaskText: (date: string, taskId: string, text: string) => void;
  
  setWaterCount: (date: string, count: number) => void;
  incrementWater: (date: string) => void;
  decrementWater: (date: string) => void;
  
  setMood: (date: string, mood: Mood | null) => void;
  
  setNotes: (date: string, notes: string) => void;
  
  getDayData: (date: string) => DayData;
}