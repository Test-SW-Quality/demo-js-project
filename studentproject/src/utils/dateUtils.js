import { MONTH_NAMES } from './constants';

export const daysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month) => {
  return MONTH_NAMES[month];
};

export const handleDecreaseMonth = (currentMonth, currentYear) => {
  if (currentMonth === 0) {
    return { month: 11, year: currentYear - 1 };
  }
  return { month: currentMonth - 1, year: currentYear };
};

export const handleIncreaseMonth = (currentMonth, currentYear) => {
  if (currentMonth === 11) {
    return { month: 0, year: currentYear + 1 };
  }
  return { month: currentMonth + 1, year: currentYear };
};
