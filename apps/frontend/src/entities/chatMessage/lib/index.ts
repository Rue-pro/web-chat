export const timeStampToRuDate = (timeStamp: string): string => {
  const date = new Date(timeStamp)
  return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}`
}
