export function secondsToTimeString(seconds: number): string {
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  seconds = seconds - (minutes * 60)
  minutes = minutes - (hours * 60)
  hours = hours - (days * 24)
  if (seconds > 59) throw new Error("Seconds > 59")
  if (minutes > 59) throw new Error("Minutes > 59")
  if (hours > 23) throw new Error("Hours > 23")
  let secondString: string
  let minuteString: string
  let hourString: string
  let dayString: string
  seconds < 10 ? secondString = `0${seconds}` : secondString = seconds.toString()
  minutes < 10 ? minuteString = `0${minutes}` : minuteString = minutes.toString()
  hours < 10 ? hourString = `0${hours}` : hourString = hours.toString()
  days < 10 ? dayString = `0${days}` : dayString = days.toString()
  let res = `${hourString}:${minuteString}:${secondString}`
  if (days > 0) res = `${dayString}:` + res
  return res
}