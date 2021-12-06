export function secondsToTimeString(seconds: number): string {
  let minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  seconds = seconds - (minutes * 60)
  minutes = minutes - (hours * 60)
  if (seconds > 59) throw new Error("Seconds > 59")
  if (minutes > 59) throw new Error("Minutes > 59")
  let secondString: string
  let minuteString: string
  let hourString: string
  seconds < 10 ? secondString = `0${seconds}` : secondString = seconds.toString()
  minutes < 10 ? minuteString = `0${minutes}` : minuteString = minutes.toString()
  hours < 10 ? hourString = `0${hours}` : hourString = hours.toString()
  return `${hourString}:${minuteString}:${secondString}`
}