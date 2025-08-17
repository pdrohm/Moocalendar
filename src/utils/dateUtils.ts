export const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();
  
  const days: Date[] = [];
  
  // Add empty days for the start of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1);
    days.push(prevMonthDay);
  }
  
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add days to complete the last week
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};