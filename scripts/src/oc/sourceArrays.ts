import { Pronouns, ObstacleType, ResultType, Success } from './interfaces'

// Obstacle Sources // 

export const activityAdjectives = {
  0: [ // failed
    "an exhausting",
    "a failed",
    "a rough",
    "a weak",
    "a bungled",
    "a misguided",
    "an out-of-control",
    "a doomed"
  ],
  1: [ // mixed
    "a fraught",
    "a challenging",
    "a trying",
    "an epic",
    "a hard-earned",
    "a strenuous",
    "a grueling",
    "a testing"
  ],
  2: [ // succeeded
    "a successful",
    "a triumphant",
    "a dominating",
    "an easy",
    "an excellent",
    "a breezy",
    "a powerful",
    "a strong"
  ]
}

export const obstacleInfo = {
  "PUZZLE": {
    discovery: [ // they ___ an object
      "stumbled upon",
      "discovered",
      "were blocked by",
      "had to solve"
    ],
    objects: [ // they discovered a ___
      "puzzlebox",
      "maze",
      "locked gate",
      "dead end"
    ],
    activities: [ // after a ____
      "brainstorm",
      "attempt",
      `hundred guesses`
    ],
    resolvers: [ // they ____ the object
      ["solved", "failed to solve"],
      ["figured out", "failed to figure out"],
      ["found a way through", "found no way through"]
    ]
  },
  "OBSTACLE": {
    discovery: [
      "were confronted with",
      "were blocked by",
      "stumbled upon",
      "discovered"
    ],
    objects: [
      "canyon",
      "cliff",
      "river",
      "hedge",
      "waste"
    ],
    activities: [
      "journey",
      "exertion",
      "trek"
    ],
    resolvers: [
      ["traversed", "failed to traverse"],
      ["crossed", "failed to cross"],
      ["passed through", "failed to pass through"]
    ]
  },
  "ENTITY": {
    discovery: [
      "snuck up on",
      "were confronted by",
      "met",
      "came across",
      "were ambushed by"
    ],
    objects: [
      "beast",
      "band of brigands",
      "tunnel dweller",
      "bird folk",
      "elemental"
    ],
    activities: [
      "negotiation",
      "battle",
      "stand off",
      "game of wits",
      "contest"
    ],
    resolvers: [
      ["parted ways with", "were driven back by"],
      ["defeated", "were defeated by"],
      ["passed by", "failled to pass"],
      ["moved on from", "were forced to turn back by"]
    ]
  }
}

export const boonTypes = {
  discovery: [
    "came upon",
    "stumbled upon",
    "discovered",
    "happened on",
    "found"
  ],
  objects: [
    "shrine",
    "haven",
    "wanderer",
    "oasis",
    "dwelling"
  ],
  activities: [
    "meditation",
    "nap",
    "meal",
    "enchantment",
    "blessing"
  ],
  resolvers: [
    ["moved on from"],
    ["passed through"]
  ]
}

// Obstacles //

interface ResultCountOdds {
  0: number, 
  1: number, 
  2: number,
  3: number
}

export const numberOfResultsOdds: { 
  [difficulty: number]: ResultCountOdds;
  1: ResultCountOdds; 
  2: ResultCountOdds; 
  3: ResultCountOdds; 
  4: ResultCountOdds;
} = {
  1: { // for obstacle with difficulty 1:
    0: 50, // 50% chance for 0 results
    1: 90, // 40% chance for 1 result, etc.
    2: 99,
    3: 100
  },
  2: {
    0: 35,
    1: 85,
    2: 98,
    3: 100
  },
  3: {
    0: 20,
    1: 70,
    2: 96,
    3: 100
  },
  4: {
    0: 5,
    1: 45,
    2: 95,
    3: 100
  }
}

interface ResultOdds {
  [resultType: string]: number;
  "INJURY": number;
  "DEATH": number;
  "LOOT": number;
  "SKILL": number;
  "TRAIT": 100;
}

export const typeOfResultOdds: {
  0: ResultOdds; 1: ResultOdds; 2: ResultOdds;
} = {
  0: {
    "INJURY": 85,
    "DEATH": 90,
    "LOOT": 91,
    "SKILL": 95,
    "TRAIT": 100
  },
  1: {
    "INJURY": 40,
    "DEATH": 41,
    "LOOT": 81,
    "SKILL": 90,
    "TRAIT": 100
  },
  2: {
    "INJURY": 15,
    "DEATH": 15,
    "LOOT": 75,
    "SKILL": 90,
    "TRAIT": 100
  }
}

export const Injuries: { text: string, traits: string[] }[] = [
  {
    text: "broke *depPossessive* leg", // verb phrase
    traits: ["peg leg"]
  },
  {
    text: "was frightened half to death",
    traits: ["anxiety"]
  },
  {
    text: "suffered slash wounds",
    traits: ["cowardice", "martyr complex"]
  },
  {
    text: "bruised *depPossessive* ribs",
    traits: ["weakness"]
  },
  {
    text: "dislocated *depPossessive* shoulder",
    traits: ["weakness"]
  },
  {
    text: "got blasted eardrums",
    traits: ["deafness"]
  },
  {
    text: "had *depPossessive* confidence shaken",
    traits: ["self-doubt"]
  },
  {
    text: "had *depPossessive* arm crushed",
    traits: ["prosthetic arm"]
  },
  {
    text: "got fried nerves",
    traits: ["aggressive impulses"]
  },
  {
    text: "was stabbed in the torso",
    traits: ["cowardice", "martyr complex"]
  }
]

/*
Simple HP system = 
- 3 injuries: knocked out for the rest of the adventure
- map injuries to the traits they can get
- each time you get an injury, there's a small chance to die instead
- this chance goes up with current number of injuries you have
- if whole party is knocked out, they all die (unless?)
- when you survive an adventure with an injury, chance to get a permanent injury trait
- otherwise, injuries are healed at end of adventure (rather, they don't persist)

// They [verb] [adjectives] [type] [name] [additions]
// They [stumbled upon] a [man-eating] [puzzlebox] [, "The Most Stark Horcrux",] which was [host to a dragon's spirit]. 
// adjectives and additions are connected to relevant skills / traits?
export interface Obstacle {
  difficulty: number; // 1-4?
  verb: string; 
  firstAdjective: string;
  secondAdjective?: string;
  type: string;
  firstName?: string;
  lastName?: string;
  additions: string[];
}

// [Trait triggers].
// The [trait] [name] [positive trait verb / negative trait verb].
// Gerald's [trait] [verb]
// [Skill  triggers]. 
// [name]'s [skill] skills [come in handy | get in the way].
// [Obstacle outcome]. 
// After a [adjs] [type-specific action-noun], they [failed to?] [type-specific verb] the [object].
// [Result events]
// [[name] [outcome]].
// George breaks his femur. Lina discovers Ancient Armor!
export interface Outcome {
  success: number; // 0: costly failure, 1: costly success, 2: full success
  traitTriggers: TraitTrigger[];
  skillTriggers: SkillTrigger[];
  adjective: string;
  action: string;
  failure?: boolean;
  verb: string;
  obstacle: Obstacle;
  results: Result[];
}

interface TraitTrigger {
  characterName: Name;
  trait: string;
  verb: string;
}

interface SkillTrigger {
  characterName: Name;
  skill: string;
  verb: string;
}

interface Result {
  characterName: Name;
  type: ResultType;
  verb: string;
  object: string;
}

enum ResultType {
  Injury,
  Death,
  Loot,
  Skill,
  Trait,
}
*/

export const questObstacleMap: { [goalType: string]: ObstacleType } = {
  "DEFEAT": ObstacleType.entity,
  "EXPLORE": ObstacleType.obstacle,
  "RETRIEVE": ObstacleType.puzzle,
  "DEFEND": ObstacleType.entity,
  "BEFRIEND": ObstacleType.entity
}

// Quest Sources //

export const questDifficulty: number[] = [
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  3,
  3,
  4
]

export const questGoalsAndInfo: {
  [goal: string]: {
    objectives: string[];
    resolvers: string[][];
  }
} = {
  "defeat": { 
    objectives: [
      "ogre",
      "mimic",
      "wyrm",
      "warlock",
      "swarm",
      "psychopomp"
    ],
    resolvers: [
      ["defeated", "were defeated by"],
      ["conquered", "were conquered by"],
      ["overpowered", "were overpowered by"],
      ["dunked on", "got dunked on by"]
    ]
  },
  "explore": {
    objectives: [
      "dunes",
      "caves",
      "maze",
      "hidden passage",
      "ruins"
    ],
    resolvers: [
      ["navigated", "were unable to navigate"],
      ["mapped out", "got lost in"],
      ["explored", "ran out of supplies in"],
      ["surveiled", "were disoriented by"]
    ]
  },
  "retrieve": {
    objectives: [
      "relic",
      "prisoner",
      "gemstone",
      "tome",
      "secret",
      "egregore"
    ],
    resolvers: [
      ["retrieved", "could not retrieve"],
      ["returned with", "left without"],
      ["acquired", "did not acquire"],
      ["grabbed", "never found"]
    ]
  },
  "defend": {
    objectives: [
      "fortress",
      "walls",
      "outskirts",
      "sanctum",
      "caravan",
      "mindscape"
    ],
    resolvers: [
      ["defended", "failed to defend"],
      ["protected", "could not to protect"],
      ["kept safe", "failed to keep safe"],
      ["safe-guarded", "could not safe-guard"]
    ]
  },
  "befriend": {
    objectives: [
      "lord",
      "doctor",
      "priest",
      "fiend",
      "nephilim"
    ],
    resolvers: [
      ["befriended", "offended"],
      ["gained favor with", "angered"],
      ["struck a deal with", "annoyed"],
      ["found common ground with", "made an enemy of"],
    ]
  }
}

export const genericFirstAdjectives: string[] = [
  "entrancing",
  "invisible",
  "violent",
  "voracious",
  "lightless",
  "sharp",
  "many-eyed",
  "succulent",
  "decrepit",
  "crepuscular"
]

export const genericSecondAdjectives: string[] = [
  "reknowned",
  "ancient",
  "magical",
  "unspeakable",
  "cursed",
  "deathly",
  "impossible",
  "horrifying",
  "irresistible",
  "black-hearted"
]

export const genericFirstName: string[] = [
  "Melifluent",
  "Carcosan",
  "Asla-Kratom",
  "Xtophila",
  "Pillskin",
  "Vivisected",
  "Yule",
  "Edible",
  "Diphonic",
  "Blistered"
]

export const genericLastName: string[] = [
  "Butcher",
  "Nail",
  "Fecund",
  "Ellishment",
  "Prant",
  "Clopse",
  "Quartzile",
  "Ulula",
  "Osprin",
  "Limpet"
]

export const questLocationName: string[] = [
  "Boreal",
  "Craven",
  "Geometric",
  "Can-ton",
  "Darshish",
  "Illusid",
  "Headless",
  "Macrosign",
  "Red",
  "Jarred"
]

export const questLocationType: string[] = [
  "valley",
  "pass",
  "summit",
  "sea",
  "desert",
  "village",
  "city",
  "crypt",
  "market",
  "forest"
]

// Other //

export const pronounsSource: Pronouns[] = [
  {
    subject: "she",
    object: "her",
    depPossessive: "her",
    indPossessive: "hers",
    reflexive: "herself"
  },
  {
    subject: "he",
    object: "him",
    depPossessive: "his",
    indPossessive: "his",
    reflexive: "himself"
  },
  {
    subject: "they",
    object: "them",
    depPossessive: "their",
    indPossessive: "theirs",
    reflexive: "themself"
  },
  {
    subject: "it",
    object: "it",
    depPossessive: "its",
    indPossessive: "its",
    reflexive: "itself"
  },
]

/*
 text: "broke *depPossessive* leg", // verb phrase
    traits: ["peg leg"]
  },
  {
    text: "was frightened half to death",
    traits: ["anxiety"]
  },
  {
    text: "suffered slash wounds",
    traits: ["cowardice", "martyr complex"]
  },
  {
    text: "bruised *depPossessive* ribs",
    traits: ["weakness"]
  },
  {
    text: "dislocated *depPossessive* shoulder",
    traits: ["weakness"]
  },
  {
    text: "got blasted eardrums",
    traits: ["deafness"]
  },
  {
    text: "had *depPossessive* confidence shaken",
    traits: ["self-doubt"]
  },
  {
    text: "had *depPossessive* arm crushed",
    traits: ["prosthetic arm"]
  },
  {
    text: "got fried nerves",
    traits: ["aggressive impulses"]
  },
  {
    text: "was stabbed in the torso",
    traits: ["cowardice", "martyr complex"]
*/

export const traits: { 
  [trait: string]: { 
    positiveTrigger: string | null, 
    negativeTrigger: string | null 
  } 
} = {
  "peg leg": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "anxiety": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "weakness": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "deafness": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "self-doubt": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "prosthetic arm": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "aggressive impulses": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "cowardice": {
    positiveTrigger: "",
    negativeTrigger: ""
  },
  "greed": {
    positiveTrigger: "greedily spots something no one else saw",
    negativeTrigger: "lingers too long looking for treasure"
  },
  "dragon obsession": {
    positiveTrigger: "has a deep understanding of dragons",
    negativeTrigger: "can't get over *depPossesive* dragon obsession"
  },
  "gambling addiction": {
    positiveTrigger: "is willing to risk it all",
    negativeTrigger: "takes a foolish gamble"
  },
  "martyr complex": {
    positiveTrigger: "sacrifices for the good of the party",
    negativeTrigger: "seems too willing too sacrifice *reflexive*"
  },
  "optimistism": {
    positiveTrigger: "helps everyone see the bright side",
    negativeTrigger: "is taking things too lightly"
  },
  "unluckiness": {
    positiveTrigger: null,
    negativeTrigger: "can't catch a break"
  },
  "trauma": {
    positiveTrigger: "remembers not to make the same mistakes again",
    negativeTrigger: "is haunted by their past"
  },
  "arachnophobia": {
    positiveTrigger: null,
    negativeTrigger: "is terrified of spiders"
  },
  "quick-wit": {
    positiveTrigger: "conjures smiles with a clever joke",
    negativeTrigger: "doesn't know when to stop talking"
  },
  "elegance": {
    positiveTrigger: "moves with cat-like elegance",
    negativeTrigger: null
  }
}

export const skills: string[] = [
  "ropes",
  "horses",
  "baking",
  "archeology",
  "arcane Arts",
  "marketing",
  "lying",
  "swords",
  "archery",
  "portraiture"
]

export const guildNames: string[] = [
  "Harcourt Smithy",
  "Cherished Heart Temple",
  "Marsh's Sewerworks",
  "Royal Orchestra Theatre",
  "Union of Scientists",
  "Platinum Branch Club",
  "Cult of 973",
  "Klaxon Messengerhall",
  "Hall of Heads",
  "Zoanthropic Lodge"
]
 
export const guildMottos: string[] = [
  "Sixteen of One, None of the Other",
  "Until our Ancient Lord Awakes",
  "Where We go, They Follow",
  "Consume, Subsume",
  "Birth, Death, Rebirth",
  "Bring Back the Future",
  "Truth, Discovery, and Laughter",
  "Bark at the Moon",
  "Heads High into the Night",
  "Four Hundrend Thirty Seven"
]

export const guildLocations: string[] = [
  "Farshi District",
  "the Dregs",
  "Ulster's Jeweltown",
  "the Flying Stones",
  "Varajao District",
  "Karkowa District",
  "the Last Stop",
  "the basement of Porcine Castle",
  "North Bank Street",
  "Raft Town"
]