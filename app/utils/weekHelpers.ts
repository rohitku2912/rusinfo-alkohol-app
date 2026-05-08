export function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}
export function getWeekStart(date: Date) {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();

  let daysSinceMonday = dayOfWeek - 1;
  //søndag er 0, så dager siden mandag må bli satt til 6, ellers blir det -1.
  if (dayOfWeek === 0) {
    daysSinceMonday = 6;
  }
  startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export function getEndOfWeek(date: Date) {
  const endOfWeek = getWeekStart(date);

  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
}

export function getPreviousWeek() {
  const today = new Date();
  const previousWeekDate = new Date(today);

  previousWeekDate.setDate(today.getDate() - 7);

  return {
    start: getWeekStart(previousWeekDate),
    end: getEndOfWeek(previousWeekDate),
    key: createDateKey(getWeekStart(previousWeekDate)),
  };
}
