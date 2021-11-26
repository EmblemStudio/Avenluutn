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
  seconds === 0 ? secondString = "00" : secondString = seconds.toString()
  minutes === 0 ? minuteString = "00" : minuteString = minutes.toString()
  hours === 0 ? hourString = "00" : hourString = hours.toString()
  return `${hourString}:${minuteString}:${secondString}`
}