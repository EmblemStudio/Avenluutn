import { Pronouns } from '../interfaces'

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

export const questVerbsAndObjectives: { [verb: string]: string[] } = {
  "defeat": [
    "ogre",
    "mimic",
    "wyrm",
    "warlock",
    "swarm",
    "psychopomp"
  ],
  "explore": [
    "dunes",
    "caves",
    "maze",
    "hidden passage",
    "ruins"
  ],
  "retrieve": [
    "relic",
    "prisoner",
    "gemstone",
    "tome",
    "secret",
    "egregore"
  ],
  "defend": [
    "fortress",
    "walls",
    "outskirts",
    "sanctum",
    "caravan",
    "mindscape"
  ],
  "befriend": [
    "lord",
    "doctor",
    "priest",
    "fiend",
    "nephilim"
  ]
}

export const questFirstAdjective: string[] = [
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

export const questSecondAdjective: string[] = [
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

export const questFirstName: string[] = [
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

export const questLastName: string[] = [
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

export const traits: string[] = [
  "Scoundrel",
  "Dragon Enthusiast",
  "Gambler",
  "Martyr",
  "Optimist",
  "Unlucky",
  "Traumatized",
  "Arachnophobic",
  "Quick-witted",
  "Elegant"
]

export const skills: string[] = [
  "Ropes",
  "Horses",
  "Baking",
  "Archeology",
  "Arcane Arts",
  "Marketing",
  "Lying",
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