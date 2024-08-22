// If the date is today, return the time, otherwise return the date
export function getDateString(date: Date) {
  if (date.getDate() === new Date().getDate())
    return date.toLocaleTimeString().slice(0, 5)
  else return date.toLocaleDateString()
}
