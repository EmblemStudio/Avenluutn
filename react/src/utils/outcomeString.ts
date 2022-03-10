import { Success } from "../../../scripts/src"

export function outcomeString(outcome: Success, storyComplete: boolean): string {
  if (!storyComplete) return "Unkown Outcome"
  switch (outcome) {
    case Success.failure:
      return "Failure"
    case Success.mixed:
      return "Success"
    case Success.success:
      return "Great Success"
    default:
      return "Unknown Outcome"
  }
}