import { State, Result, ResultType } from './content/interfaces'

export function nextState(state: State, events: Result[]): State {
  // console.log("nextState", state, events)
  const newState = Object.assign({}, state)
  events.forEach(event => {
    const guild = newState.guilds[event.guildId]

    if (guild) {
      // TODO store adventurers in state separately, just reference ids in guilds?
      const adventurer = guild.adventurers[event.advId]
      if (adventurer) {
        switch (event.type) {
          case ResultType.Death:
            // move adventurer to the graveyard
            guild.graveyard[adventurer.id] = adventurer
            delete guild.adventurers[adventurer.id]
            break
          case ResultType.Loot:
            // add loot to adventurer
            adventurer.loot.push(event.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          case ResultType.Skill:
            // add skill to adventurer
            adventurer.skills.push(event.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          case ResultType.Trait:
            // add trait to adventurer
            adventurer.traits.push(event.component)
            guild.adventurers[adventurer.id] = Object.assign({}, adventurer)
            break
          default:
            // Result doesn't effect permanent state
        }
      }

      newState.guilds[event.guildId] = Object.assign(
        {},
        guild
      )
    }
  })
  // TODO add adventurer credits / treasure / gold
  return newState
}
