import { Result, Results } from './interfaces'

export function processResults(previousResults: Result[]): { [advId: number]: Results } {
  const processedResults: { [advId: number]: Results } = {}
  previousResults.forEach(result => { 
    let advResults = processedResults[result.advId]
    if (advResults === undefined) {
      advResults = {
        "INJURY": [],
        "KNOCKOUT": [],
        "DEATH": [],
        "LOOT": [],
        "SKILL": [],
        "TRAIT": [],
      }
    }
    advResults[result.type].push(result)
    processedResults[result.advId] = advResults
  })
  return processedResults
}