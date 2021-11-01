import { Name } from '../loot/methods/names'

// They [verb] [adjectives] [type] [name] [additions]
// They [stumbled upon] a [man-eating] [puzzlebox] [, "The Most Stark Horcrux",] which was [instilled with a dragon's spirit]. 
// adjectives and additions are connected to relevant skills / traits?
export enum ObstacleType {
  puzzle = "PUZZLE",
  obstacle = "OBSTACLE",
  entity = "ENTITY"
}

export interface Obstacle {
  difficulty: number; // 1-4?
  type: ObstacleType;
  discovery: string;
  firstAdjective?: string;
  secondAdjective?: string;
  object: string;
  firstName?: string;
  lastName?: string;
  additions?: string[];
  quest?: Quest;
}

// [Trait triggers].
// The [trait] [name] [positive trait verb / negative trait verb].
// [Skill  triggers]. 
// [name]'s [skill] skills [come in handy | get in the way].
// [Obstacle outcome]. 
// After a [adjs] [type-specific action], they [fail to?] [type-specific verb] the [name].
// [Result events]
// [[name] [outcome]].
// George breaks his femur. Lina discovers Ancient Armor!
export interface Outcome {
  success: Success; // 0: costly failure, 1: costly success, 2: full success
  adjective: string;
  activity: string;
  resolver: string;
  obstacle: Obstacle;
  triggers: Trigger[];
  results: Result[];
}

export enum Success {
  failure,
  mixed,
  success
}

// TODO should skills and traits really be represented by different things?
export interface Trigger {
  characterName: Name;
  triggeredComponent: string;
  verb: string;
}

export interface Result {
  guildId: number;
  advName: Name;
  advId: number;
  type: ResultType;
  text: string;
  component: string;
}

// TODO add a "TREASURE" type?
export enum ResultType {
  Injury = "INJURY",
  Knockout = "KNOCKOUT", // 3 injuries = knockout
  Death = "DEATH",
  Loot = "LOOT",
  Skill = "SKILL",
  Trait = "TRAIT",
}

export interface Results {
  "INJURY": Result[];
  "KNOCKOUT": Result[];
  "DEATH": Result[];
  "LOOT": Result[];
  "SKILL": Result[];
  "TRAIT": Result[];
}

export enum QuestType {
  defeat = "DEFEAT",
  explore = "EXPLORE",
  retrieve = "RETRIEVE",
  defend = "DEFEND",
  befriend = "BEFRIEND"
}

export interface Quest {
  guildId: number; // index of the guild going on the quest
  difficulty: number; // 1-4, not included in final text, but publicly available (equivalent to "greatness")
  type: QuestType; // e.g. "Defeat"
  firstAdjective?: string; // e.g. "strong"
  secondAdjective?: string; // e.g. "putrescent"
  objective: string; // e.g. "ogre" --> we will need separate object lists for each verb, or at least different ones
  firstName?: string; // e.g. "Melifluous"
  lastName?: string; // e.g. "Belcher"
  locationName: string; // e.g. "Sarong" (proper noun)
  locationType: string; // e.g. "Mountain"
} 

export interface Character {
  name: Name;
  pronouns: Pronouns;
  species: string[];
  traits: string[];
  age: number;
}

export interface Adventurer extends Character {
  id: number;
  class: string[];
  stats: Stats;
  skills: string[];
  loot: string[];
}

export interface Pronouns {
  [type: string]: string;
  subject: string; // e.g. she, he
  object: string; // e.g. her, him
  depPossessive: string; // e.g. her, his
  indPossessive: string; // e.g. hers, his
  reflexive: string; // e.g. herself, himself
}

export interface Stats {
  strength: number;
  magic: number;
  agility: number;
  resourcefulness: number;
  toughness: number;
}

export interface Guild {
  id: number;
  name: string;
  motto: string;
  location: string;
  bard: Character;
  adventurers: { [id: number]: Adventurer };
  graveyard: { [id: number]: Adventurer };
  // parties: number[][];
  adventurerCredits: { [advernturerId: number]: number };
  gold: number;
}

export interface State {
  guilds: Guild[];
}