import { Name } from './loot/methods/names'

export interface Quest {
  difficulty: number; // not included in final text, but publicly available (equivalent to "greatness")
  verb: string; // e.g. "Defeat"
  firstAdjective: string; // e.g. "strong"
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

export interface Party {
  adventurers: number[];
}

export interface Guild {
  id: number;
  name: string;
  motto: string;
  location: string;
  bard: Character;
  adventurers: { [id: number]: Adventurer };
  parties: Party[];
  adventurerCredits: { [advernturerId: number]: number };
  gold: number;
}

export interface State {
  guilds: Guild[];
}