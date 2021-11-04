import { Pronouns, ObstacleType, ResultType, Success } from '../interfaces'

// Outcome Sources // 

export const activityAdjectives = {
  0: [ // failed
    "an exhausting",
    "a misjudged",
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
    1: 60,
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
    "LOOT": 97,
    "SKILL": 98,
    "TRAIT": 100
  },
  1: {
    "INJURY": 40,
    "DEATH": 41,
    "LOOT": 93,
    "SKILL": 97,
    "TRAIT": 100
  },
  2: {
    "INJURY": 15,
    "DEATH": 15,
    "LOOT": 90,
    "SKILL": 95,
    "TRAIT": 100
  }
}

export const Injuries: { text: string, traits: string[] }[] = [
  {
    text: "broke *depPossessive* leg", // verb phrase
    traits: ["a peg leg"]
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
    traits: ["a prosthetic arm"]
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

// Obstacle Sources // 

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
      "hundred guesses"
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
      "attempt",
      "exertion",
      "trek"
    ],
    resolvers: [
      ["traversed", "failed to traverse"],
      ["crossed", "failed to cross"],
      ["overcame", "failed to overcome"]
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
      "brigands",
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

/*
Simple HP system = 
- 3 injuries: knocked out for the rest of the adventure
- map injuries to the traits they can get
- each time you get an injury, there's a small chance to die instead
- this chance goes up with current number of injuries you have
- if whole party is knocked out, they all die (unless?)
- when you survive an adventure with an injury, chance to get a permanent injury trait
- otherwise, injuries are healed at end of adventure (rather, they don't persist)
*/

export const questObstacleMap: { [goalType: string]: ObstacleType } = {
  "DEFEAT": ObstacleType.entity,
  "EXPLORE": ObstacleType.obstacle,
  "RETRIEVE": ObstacleType.puzzle,
  "DEFEND": ObstacleType.obstacle,
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

export const questTypesAndInfo: {
  [goal: string]: {
    objectives: string[];
    activities: string[];
    resolvers: string[][];
  }
} = {
  "defeat": { 
    objectives: [
      "ogre",
      "giant spider",
      "wyrm",
      "warlock",
      "swarm",
      "psychopomp"
    ],
    activities: [ // after a ____
      "battle",
      "contest",
      "struggle"
    ],
    resolvers: [
      ["defeated", "were defeated by"],
      ["conquered", "were conquered by"],
      ["overpowered", "were overpowered by"],
      ["dunked on", "got dunked on by"]
    ]
  },
  "explore": {
    // script cares about ending in s or beginning with a vowel
    objectives: [
      "dunes",
      "caves",
      "maze",
      "hidden passage",
      "ruins"
    ],
    activities: [ // after a ____
      "journey",
      "reconnoiter",
      "exploration"
    ],
    resolvers: [
      ["successfully navigated", "were unable to navigate"],
      ["completely mapped out", "got lost in"],
      ["fully explored", "ran out of supplies in"],
      ["surveiled all of", "were disoriented by"]
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
    activities: [ // after a ____
      "search",
      "mission",
      "infiltration"
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
      "citadel",
      "walls",
      "outskirts",
      "sanctum",
      "caravan",
      "mindscape"
    ],
    activities: [ // after a ____
      "overwatch",
      "attempt",
      "battle"
    ],
    resolvers: [
      ["defended", "failed to defend"],
      ["protected", "could not to protect"],
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
    activities: [ // after a ____
      "conversation",
      "audience",
      "introduction"
    ],
    resolvers: [
      ["befriended", "offended"],
      ["gained favor with", "angered"],
      ["struck a deal with", "annoyed"],
      ["found common ground with", "made an enemy of"]
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
  }
]

import * as triggerMapJson from '../../../csv-to-json/json/triggerMap.json'

export const triggerMap: {
  [keystring: string]: // string to search obstacle text for
    {
      chance: number; // percent chance to trigger
      modifier: number, // amount to adjust roll by +/- (5, 10, 15, 20, 25, 30)
      name: string, // name of trait, skill, loot word
      type: "skills" | "loot" | "traits"
    }[]
  
} = JSON.parse(JSON.stringify(triggerMapJson))

export const traits: { 
  [trait: string]: { 
    positiveTrigger: string | null, 
    negativeTrigger: string | null 
  } 
} = {
  "a peg leg": {
    positiveTrigger: "protected by *depPossesive* peg leg",
    negativeTrigger: "hampered by *depPossesive* peg leg"
  },
  "anxiety": {
    positiveTrigger: null,
    negativeTrigger: "feels anxious"
  },
  "weakness": {
    positiveTrigger: null,
    negativeTrigger: "feels weak"
  },
  "deafness": {
    positiveTrigger: "is unharmed by the sound",
    negativeTrigger: "cannot hear a thing"
  },
  "self-doubt": {
    positiveTrigger: null,
    negativeTrigger: "is consumed by self-doubt"
  },
  "a prosthetic arm": {
    positiveTrigger: "uses *depPossesive* prosthetic arm",
    negativeTrigger: "struggles with *depPossesive* prosthetic arm"
  },
  "aggressive impulses": {
    positiveTrigger: "charges forward fearlessly",
    negativeTrigger: "rushes in too eagerly"
  },
  "cowardice": {
    positiveTrigger: null,
    negativeTrigger: "is frozen in fear"
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
  "monsterphobia": {
    positiveTrigger: null,
    negativeTrigger: "is terrified of strange beasts"
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

// Bob took advantage of his _____ skill.
export const skills: string[] = [
  "Ropes",
  "Horses",
  "Baking",
  "Archeology",
  "Arcane Arts",
  "Marketing",
  "Deception",
  "Swords",
  "Archery",
  "Portraiture"
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