export const dateToRuDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${addTenIfLessThenTen(hours)}:${addTenIfLessThenTen(
    minutes,
  )} ${addTenIfLessThenTen(day)}.${addTenIfLessThenTen(month)}.${year}`
}

const addTenIfLessThenTen = (number: number): string => {
  return number < 10 ? '0' + number : number.toString()
}
