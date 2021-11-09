"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildLocations = exports.guildMottos = exports.guildNames = exports.skills = exports.traits = exports.triggerMap = exports.pronounsSource = exports.questLocationType = exports.questLocationName = exports.genericLastName = exports.genericFirstName = exports.genericSecondAdjectives = exports.genericFirstAdjectives = exports.questTypesAndInfo = exports.questDifficulty = exports.questObstacleMap = exports.boonTypes = exports.obstacleInfo = exports.Injuries = exports.typeOfResultOdds = exports.numberOfResultsOdds = exports.activityAdjectives = void 0;
const interfaces_1 = require("../interfaces");
// Outcome Sources // 
exports.activityAdjectives = {
    0: [
        "an exhausting",
        "a misjudged",
        "a rough",
        "a weak",
        "a bungled",
        "a misguided",
        "an out-of-control",
        "a doomed"
    ],
    1: [
        "a fraught",
        "a challenging",
        "a trying",
        "an epic",
        "a hard-earned",
        "a strenuous",
        "a grueling",
        "a testing"
    ],
    2: [
        "a successful",
        "a triumphant",
        "a dominating",
        "an easy",
        "an excellent",
        "a breezy",
        "a powerful",
        "a strong"
    ]
};
exports.numberOfResultsOdds = {
    1: {
        0: 50,
        1: 90,
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
};
exports.typeOfResultOdds = {
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
};
exports.Injuries = [
    {
        text: "broke *depPossessive* leg",
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
];
// Obstacle Sources // 
exports.obstacleInfo = {
    "PUZZLE": {
        discovery: [
            "stumbled upon",
            "discovered",
            "were blocked by",
            "had to solve"
        ],
        objects: [
            "puzzlebox",
            "maze",
            "locked gate",
            "dead end"
        ],
        activities: [
            "brainstorm",
            "attempt",
            "hundred guesses"
        ],
        resolvers: [
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
};
exports.boonTypes = {
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
};
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
exports.questObstacleMap = {
    "DEFEAT": interfaces_1.ObstacleType.entity,
    "EXPLORE": interfaces_1.ObstacleType.obstacle,
    "RETRIEVE": interfaces_1.ObstacleType.puzzle,
    "DEFEND": interfaces_1.ObstacleType.obstacle,
    "BEFRIEND": interfaces_1.ObstacleType.entity
};
// Quest Sources //
exports.questDifficulty = [
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
];
exports.questTypesAndInfo = {
    "defeat": {
        objectives: [
            "ogre",
            "giant spider",
            "wyrm",
            "warlock",
            "swarm",
            "psychopomp"
        ],
        activities: [
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
        activities: [
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
        activities: [
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
        activities: [
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
        activities: [
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
};
exports.genericFirstAdjectives = [
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
];
exports.genericSecondAdjectives = [
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
];
exports.genericFirstName = [
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
];
exports.genericLastName = [
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
];
exports.questLocationName = [
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
];
exports.questLocationType = [
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
];
// Other //
exports.pronounsSource = [
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
];
const triggerMapJson = require("../../../csv-to-json/json/triggerMap.json");
exports.triggerMap = JSON.parse(JSON.stringify(triggerMapJson));
exports.traits = {
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
};
// Bob took advantage of his _____ skill.
exports.skills = [
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
];
exports.guildNames = [
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
];
exports.guildMottos = [
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
];
exports.guildLocations = [
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
];
