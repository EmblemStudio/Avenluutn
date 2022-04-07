import { Name } from '../content/loot/methods/names'

export interface ScriptResult {
  stories: Story[];
  nextState: State;
  nextUpdateTime: number;
}

export interface Story {
  party: Adventurer[];
  plainText: string[];
  richText: {
    beginning: LabeledString[];
    middle: {
      obstacleText: LabeledString[][];
      outcomeText: OutcomeText[];
    };
    ending: EndingText;
  }
  events: Result[];
  finalOutcome: Success;
  nextUpdateTime: number;
}

export interface Beginning {
  guild: Guild;
  party: Adventurer[];
  quest: Quest;
  endTime: number;
  obstacleTimes: number[];
  outcomeTimes: number[];
  text: LabeledString[];
}

export interface OutcomeText {
  main: LabeledString[];
  triggerTexts: LabeledString[][];
  resultTexts: LabeledString[][];
}

export interface Middle {
  questSuccess: Success;
  obstacles: Obstacle[];
  outcomes: Outcome[];
  allResults: Result[];
  obstacleText: LabeledString[][];
  outcomeText: OutcomeText[];
  allOutcomesSucceeded: boolean;
}

export interface Ending {
  results: Result[];
  text: EndingText;
}

export interface EndingText {
  main: LabeledString[];
  resultTexts: LabeledString[][];
}

export enum Label {
  adventurerName = "adventurerName",
  guildName = "guildName",
  questType = "questType",
  adjective = "adjective",
  object = "object",
  questObjective = "questObjective",
  locationName = "locationName",
  locationType = "locationType",
  obstacleName = "obstacleName",
  obstacleDiscovery = "obstacleDiscovery",
  obstacleAddition = "obstacleAddition",
  outcomeActivity = "outcomeActivity",
  outcomeResolver = "outcomeResolver",
  resultAdverb = "resultAdverb",
  injuryName = "injuryName",
  knockoutName = "knockoutName",
  deathName = "deathName",
  lootName = "lootName",
  skillName = "skillName",
  traitName = "traitName",
  conjunctive = "conjunctive"
}

export interface LabeledString {
  string: string;
  label: Label;
  entityId?: number;
}

// They [verb] [adjectives] [type] [name] [additions]
// They [stumbled upon] a [man-eating] [puzzlebox] [, "The Most Stark Horcrux",] which was [instilled with a dragon's spirit]. 
// adjectives and additions are connected to relevant skills / traits?

export interface Obstacle {
  difficulty: number; // 1-4?
  type: string;
  arrival: string;
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
  text: LabeledString[];
}

export interface TriggerInfo {
  chance: number; // percent chance to trigger
  modifier: number, // amount to adjust roll by +/- (5, 10, 15, 20, 25, 30)
  name: string, // name of trait, skill, loot word
  type: "skills" | "loot" | "traits"
}

export interface Traits { [trait: string]: TraitInfo[] }

export interface TraitInfo {
  positiveTrigger: string | null,
  negativeTrigger: string | null
}

export interface Result {
  guildId: number;
  advName: Name;
  advId: number;
  type: ResultType;
  text: LabeledString[];
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

export interface Quest {
  guildId: number; // index of the guild going on the quest
  difficulty: number; // 1-4, not included in final text, but publicly available (equivalent to "greatness")
  type: string; // e.g. "Defeat"
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
  stories: any;
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
  [key: string]: number;
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