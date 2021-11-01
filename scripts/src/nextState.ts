import { State, Adventurer, Quest, Obstacle, Outcome, Result, Success, ResultType, Guild } from './oc/interfaces'

export function nextState(state: State, results: Result[]): State {
  const newState = Object.assign({}, state)
  results.forEach(result => {
    const guild = newState.guilds[result.guildId]

    if (guild) {
      // TODO store adventurers in state separately, just reference ids in guilds?
      const adventurer = guild.adventurers[result.advId]
      if (adventurer) {
        switch (result.type) {
          case ResultType.Death:
            // move adventurer to the graveyard
            guild.graveyard[adventurer.id] = adventurer
            delete guild.adventurers[adventurer.id]
            break
          case ResultType.Loot:
            // add loot to adventurer
            adventurer.loot.push(result.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          case ResultType.Skill:
            // add skill to adventurer
            adventurer.skills.push(result.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          case ResultType.Trait:
            // add trait to adventurer
            adventurer.traits.push(result.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          default:
            // Result doesn't effect permanent state
        }
      }

      newState.guilds[result.guildId] = Object.assign(
        {},
        guild
      )
    }
  })
  // TODO add adventurer credits / treasure / gold
  return newState
}