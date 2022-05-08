import { State, Result, ResultType } from './utils'

export function nextState(state: State, events: Result[]): State {
  const newState = Object.assign({}, state)
  events.forEach(event => {
    const guild = newState.guilds[event.guildId]
    // TODO add these to state during quests so they can effect things instantly
    if (guild) {
      const adventurer = guild.adventurers[event.advId]
      if (adventurer) {
        switch (event.type) {
          case ResultType.Death:
            // move adventurer to the graveyard
            guild.graveyard[adventurer.id] = Object.assign({}, adventurer)
            delete guild.adventurers[adventurer.id]
            break
          case ResultType.Loot:
            // add loot to adventurer if they aren't a thralls
            if (adventurer.species.includes("Thrall")) break
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
