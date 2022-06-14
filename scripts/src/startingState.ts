import { State } from "./utils";

/*
  Starting state from:
  network: "polygon",
  narrator: "0"
  + rat guild
  + new recruits
*/

export const startingState: State = {
  "guilds": [
    {
      "adventurerCredits": {},
      "adventurers": {
        "1": {
          "age": 62,
          "class": [
            "Cleric"
          ],
          "id": 1,
          "loot": [
            "Chain Gloves",
            "Crown"
          ],
          "name": {
            "firstName": "Rita",
            "id": 7247,
            "lastName": "Plain",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Ropework",
            "Deception"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 4,
            "magic": 2,
            "resourcefulness": 1,
            "strength": 3,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "martyr complex",
            "cowardice"
          ]
        },
        "2": {
          "age": 97,
          "class": [
            "Sorcerer"
          ],
          "id": 2,
          "loot": [
            "Club",
            "Amulet",
            "Silk Slippers",
            "Greaves of Giants",
            "Gold Ring of Detection",
            "Necklace"
          ],
          "name": {
            "firstName": "Kyle",
            "id": 2056,
            "lastName": "Marblemaw",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Haberdashery",
            "Horsemanship",
            "Disguise"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 3,
            "magic": 3,
            "resourcefulness": 1,
            "strength": 3,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "greed",
            "great destiny"
          ]
        },
        "3": {
          "age": 69,
          "class": [
            "Warlock"
          ],
          "id": 3,
          "loot": [
            "Studded Leather Belt"
          ],
          "name": {
            "firstName": "Gawel",
            "id": 2697,
            "lastName": "Gresham",
            "middleName": "from",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Haberdashery",
            "Horsemanship"
          ],
          "species": [
            "Gnome"
          ],
          "stats": {
            "agility": 1,
            "magic": 1,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "cowardice"
          ]
        },
        "7": {
          "age": 54,
          "class": [
            "Monk"
          ],
          "id": 7,
          "loot": [
            "\"Sorrow Peak\" Shoes of Fury +1",
            "\"Dusk Whisper\" Amulet of the Fox",
            "\"Ghoul Whisper\" Ghost Wand of Titans",
            "Pendant of Enlightenment"
          ],
          "name": {
            "firstName": "Satoshi",
            "id": 1537,
            "lastName": "Geisler",
            "middleName": "",
            "prefix": "Master",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Leadership"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 2,
            "magic": 0,
            "resourcefulness": 3,
            "strength": 2,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "monsterphobia"
          ]
        },
        "8": {
          "age": 104,
          "class": [
            "Bard"
          ],
          "id": 8,
          "loot": [
            "Silk Gloves",
            "Pendant",
            "Titanium Ring of the Twins",
            "Shoes"
          ],
          "name": {
            "firstName": "Darda",
            "id": 149,
            "lastName": "K",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Navigation"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 3,
            "resourcefulness": 2,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "monsterphobia",
            "greed",
            "aggressive impulses",
            "weakness"
          ]
        },
        "9": {
          "age": 50,
          "class": [
            "Rogue"
          ],
          "id": 9,
          "loot": [
            "Platinum Ring",
            "Divine Hood",
            "Dragonskin Armor",
            "Necklace",
            "Gold Ring of Anger"
          ],
          "name": {
            "firstName": "Betty",
            "id": 228,
            "lastName": "Jenkins",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Archery",
            "Ancient Lore"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 1,
            "magic": 2,
            "resourcefulness": 1,
            "strength": 0,
            "toughness": 1
          },
          "stories": [],
          "traits": []
        },
        "10": {
          "age": 40,
          "class": [
            "Monk"
          ],
          "id": 10,
          "loot": [
            "Necklace",
            "Studded Leather Boots",
            "Linen Sash",
            "Chain Boots",
            "Heavy Boots",
            "Leather Cap",
            "Leather Boots of Anger"
          ],
          "name": {
            "firstName": "Malok",
            "id": 170,
            "lastName": "Kulechov",
            "middleName": "state",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Leadership"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 4,
            "magic": 0,
            "resourcefulness": 4,
            "strength": 0,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "gambling addiction"
          ]
        },
        "11": {
          "age": 66,
          "class": [
            "Paladin"
          ],
          "id": 11,
          "loot": [
            "Necklace",
            "Amulet",
            "War Cap"
          ],
          "name": {
            "firstName": "Vitalik",
            "id": 2469,
            "lastName": "Wintermute",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Marketing",
            "Horsemanship"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 4,
            "magic": 0,
            "resourcefulness": 2,
            "strength": 3,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "aggressive impulses",
            "unluckiness",
            "anxiety"
          ]
        },
        "12": {
          "age": 72,
          "class": [
            "Ranger"
          ],
          "id": 12,
          "loot": [
            "Shirt",
            "\"Dusk Sun\" Tome of the Fox",
            "Dragonskin Belt",
            "Pendant of Protection"
          ],
          "name": {
            "firstName": "Vitalik",
            "id": 4727,
            "lastName": "Wixx",
            "middleName": "first of",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Streetwise",
            "Metallurgy"
          ],
          "species": [
            "Halfling"
          ],
          "stats": {
            "agility": 3,
            "magic": 2,
            "resourcefulness": 3,
            "strength": 4,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "a peg leg",
            "quick-wit"
          ]
        },
        "13": {
          "age": 99,
          "class": [
            "Sorcerer"
          ],
          "id": 13,
          "loot": [
            "Cap of Brilliance",
            "Gold Ring",
            "Wool Shoes",
            "Ancient Helm of Perfection",
            "Scimitar of Detection"
          ],
          "name": {
            "firstName": "Csilla",
            "id": 8017,
            "lastName": "Goncalves",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Baking"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 3,
            "magic": 4,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "cowardice"
          ]
        },
        "74": {
          "name": {
            "id": 1540,
            "prefix": "",
            "firstName": "Elisabeth",
            "middleName": "",
            "lastName": "Kjeldsen",
            "suffix": ""
          },
          "pronouns": {
            "subject": "she",
            "object": "her",
            "depPossessive": "her",
            "indPossessive": "hers",
            "reflexive": "herself"
          },
          "species": [
            "Human"
          ],
          "age": 32,
          "traits": [],
          "id": 74,
          "class": [
            "Fighter"
          ],
          "stats": {
            "strength": 2,
            "magic": 2,
            "agility": 0,
            "resourcefulness": 0,
            "toughness": 4
          },
          "skills": [
            "Leadership"
          ],
          "loot": [
            "Full Helm"
          ],
          "stories": []
        }
      },
      "bard": {
        "age": 73,
        "name": {
          "firstName": "Monica",
          "id": 2148,
          "lastName": "Araujo",
          "middleName": "",
          "prefix": "",
          "suffix": "the Mad"
        },
        "pronouns": {
          "depPossessive": "her",
          "indPossessive": "hers",
          "object": "her",
          "reflexive": "herself",
          "subject": "she"
        },
        "species": [
          "Dragonborn"
        ],
        "traits": [
          "monsterphobia",
          "anxiety"
        ]
      },
      "gold": 0,
      "graveyard": {
        "4": {
          "age": 58,
          "class": [
            "Paladin"
          ],
          "id": 4,
          "loot": [
            "Dragonskin Gloves",
            "Bronze Ring"
          ],
          "name": {
            "firstName": "Chinwemma",
            "id": 2113,
            "lastName": "Lopez",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Ancient Lore"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 1,
            "magic": 3,
            "resourcefulness": 1,
            "strength": 2,
            "toughness": 0
          },
          "stories": [],
          "traits": []
        },
        "5": {
          "age": 79,
          "class": [
            "Ranger"
          ],
          "id": 5,
          "loot": [
            "Ornate Chestplate",
            "Necklace",
            "Ornate Gauntlets",
            "Demon Crown",
            "Linen Hood",
            "Cap",
            "Hard Leather Boots",
            "Chronicle"
          ],
          "name": {
            "firstName": "Kyle",
            "id": 5662,
            "lastName": "Buterin",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Archeology",
            "Deception",
            "Disguise"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 3,
            "magic": 0,
            "resourcefulness": 3,
            "strength": 1,
            "toughness": 3
          },
          "stories": [],
          "traits": [
            "monsterphobia",
            "optimistism",
            "dragon obsession"
          ]
        },
        "6": {
          "age": 103,
          "class": [
            "Bard"
          ],
          "id": 6,
          "loot": [
            "Cap",
            "Linen Robe of Reflection",
            "\"Gloom Bite\" Gloves of Titans +1"
          ],
          "name": {
            "firstName": "Daealla",
            "id": 564,
            "lastName": "Gannon",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Portraiture"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 2,
            "magic": 0,
            "resourcefulness": 4,
            "strength": 1,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "elegance"
          ]
        }
      },
      "id": 0,
      "location": "Varajao District",
      "motto": "Sixteen of One, None of the Other",
      "name": "Marsh's Sewerworks"
    },
    {
      "adventurerCredits": {},
      "adventurers": {
        "14": {
          "age": 31,
          "class": [
            "Monk"
          ],
          "id": 14,
          "loot": [
            "Dragon's Crown",
            "Heavy Belt",
            "Wand",
            "Platinum Ring",
            "Silver Ring"
          ],
          "name": {
            "firstName": "Isak",
            "id": 3421,
            "lastName": "Skotnik",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Metallurgy"
          ],
          "species": [
            "Half-Elf"
          ],
          "stats": {
            "agility": 2,
            "magic": 2,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": []
        },
        "15": {
          "age": 42,
          "class": [
            "Ranger"
          ],
          "id": 15,
          "loot": [
            "Demonhide Belt",
            "\"Vengeance Whisper\" Ghost Wand of the Fox",
            "Wool Sash of Vitriol",
            "Silver Ring",
            "Divine Slippers",
            "Robe of Titans",
            "Ornate Gauntlets",
            "Wool Sash",
            "Hard Leather Armor",
            "Necklace"
          ],
          "name": {
            "firstName": "Rasmus",
            "id": 7241,
            "lastName": "Zhu",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Metallurgy"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 4,
            "magic": 4,
            "resourcefulness": 4,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "cowardice",
            "anxiety",
            "a prosthetic arm",
            "martyr complex"
          ]
        },
        "16": {
          "age": 99,
          "class": [
            "Cleric"
          ],
          "id": 16,
          "loot": [
            "Hard Leather Armor",
            "Scimitar",
            "Divine Gloves",
            "Dragonskin Boots of Giants",
            "Crown",
            "\"Pain Whisper\" Brightsilk Sash of Power",
            "Amulet",
            "Studded Leather Belt",
            "Divine Hood",
            "Silver Ring"
          ],
          "name": {
            "firstName": "Satoshi",
            "id": 6782,
            "lastName": "Mancini",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Politics"
          ],
          "species": [
            "Gnome"
          ],
          "stats": {
            "agility": 1,
            "magic": 1,
            "resourcefulness": 0,
            "strength": 2,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "unluckiness"
          ]
        },
        "17": {
          "age": 66,
          "class": [
            "Wizard"
          ],
          "id": 17,
          "loot": [
            "Heavy Belt",
            "Silver Ring",
            "Chain Gloves",
            "Dragonskin Belt of Titans",
            "Leather Gloves",
            "\"Victory Shout\" Hard Leather Armor of Protection +1",
            "\"Rune Root\" Platinum Ring of Vitriol",
            "Wand of Rage",
            "Dragonskin Armor of Detection",
            "Pendant",
            "Demonhide Belt of Protection",
            "Wool Shoes",
            "Pendant",
            "Heavy Belt",
            "Silk Robe"
          ],
          "name": {
            "firstName": "Dennis",
            "id": 221,
            "lastName": "Gotou",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Alchemy",
            "Portraiture",
            "Acrobatics",
            "Deception"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 1,
            "magic": 1,
            "resourcefulness": 1,
            "strength": 0,
            "toughness": 3
          },
          "stories": [],
          "traits": [
            "cowardice"
          ]
        },
        "18": {
          "age": 68,
          "class": [
            "Cleric"
          ],
          "id": 18,
          "loot": [
            "Tome of Fury",
            "Gold Ring"
          ],
          "name": {
            "firstName": "Jessica",
            "id": 1927,
            "lastName": "Marblemaw",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Horsemanship",
            "Investigation"
          ],
          "species": [
            "Gnome"
          ],
          "stats": {
            "agility": 3,
            "magic": 4,
            "resourcefulness": 0,
            "strength": 4,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "monsterphobia"
          ]
        },
        "19": {
          "age": 37,
          "class": [
            "Monk"
          ],
          "id": 19,
          "loot": [
            "Silk Sash",
            "Crown of Vitriol"
          ],
          "name": {
            "firstName": "Andre",
            "id": 978,
            "lastName": "Kiss",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Ropework",
            "Swordskill",
            "Investigation",
            "Ancient Lore"
          ],
          "species": [
            "Gnome"
          ],
          "stats": {
            "agility": 1,
            "magic": 3,
            "resourcefulness": 4,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "anxiety"
          ]
        },
        "20": {
          "age": 76,
          "class": [
            "Wizard"
          ],
          "id": 20,
          "loot": [
            "Amulet",
            "\"Armageddon Grasp\" Hard Leather Belt of Rage +1",
            "Platinum Ring",
            "Holy Chestplate",
            "Studded Leather Armor of Power",
            "Necklace of Anger",
            "Titanium Ring"
          ],
          "name": {
            "firstName": "Irene",
            "id": 716,
            "lastName": "Thatcher",
            "middleName": "",
            "prefix": "",
            "suffix": "the Lawgiver"
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Ancient Lore",
            "Navigation"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 2,
            "resourcefulness": 1,
            "strength": 0,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "quick-wit",
            "great destiny",
            "greed"
          ]
        },
        "22": {
          "age": 90,
          "class": [
            "Monk"
          ],
          "id": 22,
          "loot": [
            "Necklace",
            "\"Plague Sun\" Heavy Gloves of Fury",
            "Titanium Ring",
            "Ornate Gauntlets",
            "Silk Slippers",
            "Chain Gloves",
            "Dragonskin Belt",
            "Cap",
            "Crown of Enlightenment"
          ],
          "name": {
            "firstName": "Noah",
            "id": 3747,
            "lastName": "Maki",
            "middleName": "",
            "prefix": "King",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Arcane Arts",
            "Marketing",
            "Navigation"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 0,
            "magic": 2,
            "resourcefulness": 2,
            "strength": 4,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "a prosthetic arm"
          ]
        },
        "23": {
          "age": 50,
          "class": [
            "Cleric"
          ],
          "id": 23,
          "loot": [
            "Heavy Gloves",
            "Necklace",
            "Plate Mail of Detection",
            "Robe of the Fox"
          ],
          "name": {
            "firstName": "Yuukou",
            "id": 2514,
            "lastName": "Okwuoma",
            "middleName": "chadde",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Politics",
            "Metallurgy"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 1,
            "resourcefulness": 3,
            "strength": 4,
            "toughness": 4
          },
          "stories": [],
          "traits": []
        },
        "24": {
          "age": 100,
          "class": [
            "Rogue"
          ],
          "id": 24,
          "loot": [
            "Chain Mail of Enlightenment",
            "\"Woe Shout\" Plated Belt of Detection +1",
            "Quarterstaff",
            "Demonhide Boots",
            "Platinum Ring",
            "Dragon's Crown",
            "Silk Slippers"
          ],
          "name": {
            "firstName": "Annabelle",
            "id": 4868,
            "lastName": "Nigiri",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Swimming",
            "Streetwise"
          ],
          "species": [
            "Half-Elf"
          ],
          "stats": {
            "agility": 3,
            "magic": 2,
            "resourcefulness": 1,
            "strength": 4,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "anxiety",
            "cowardice"
          ]
        },
        "75": {
          "name": {
            "id": 6555,
            "prefix": "",
            "firstName": "Stanislaus",
            "middleName": "",
            "lastName": "McLellan",
            "suffix": ""
          },
          "pronouns": {
            "subject": "they",
            "object": "them",
            "depPossessive": "their",
            "indPossessive": "theirs",
            "reflexive": "themself"
          },
          "species": [
            "Half-Elf"
          ],
          "age": 24,
          "traits": [],
          "id": 75,
          "class": [
            "Barbarian"
          ],
          "stats": {
            "strength": 3,
            "magic": 2,
            "agility": 2,
            "resourcefulness": 3,
            "toughness": 2
          },
          "skills": [
            "Portraiture"
          ],
          "loot": [
            "Chain Gloves"
          ],
          "stories": []
        }
      },
      "bard": {
        "age": 52,
        "name": {
          "firstName": "Laura",
          "id": 940,
          "lastName": "Oliveira",
          "middleName": "",
          "prefix": "",
          "suffix": ""
        },
        "pronouns": {
          "depPossessive": "their",
          "indPossessive": "theirs",
          "object": "them",
          "reflexive": "themself",
          "subject": "they"
        },
        "species": [
          "Gnome"
        ],
        "traits": [
          "gambling addiction",
          "great destiny"
        ]
      },
      "gold": 0,
      "graveyard": {
        "21": {
          "age": 71,
          "class": [
            "Bard"
          ],
          "id": 21,
          "loot": [
            "Leather Cap",
            "Wool Sash"
          ],
          "name": {
            "firstName": "Andre",
            "id": 1506,
            "lastName": "Wintermute",
            "middleName": "",
            "prefix": "Professor",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Ancient Lore",
            "Alchemy",
            "Baking",
            "Portraiture",
            "Leadership"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 0,
            "magic": 1,
            "resourcefulness": 1,
            "strength": 0,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "unluckiness",
            "a peg leg"
          ]
        }
      },
      "id": 1,
      "location": "the Flying Stones",
      "motto": "Does not Mean What You Think it Means",
      "name": "Royal Orchestra Theatre"
    },
    {
      "adventurerCredits": {},
      "adventurers": {
        "25": {
          "age": 32,
          "class": [
            "Bard"
          ],
          "id": 25,
          "loot": [
            "Necklace",
            "Chronicle of Giants",
            "Linen Gloves",
            "Silk Slippers"
          ],
          "name": {
            "firstName": "Zaki",
            "id": 3502,
            "lastName": "Gresham",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Marketing"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 1,
            "magic": 3,
            "resourcefulness": 1,
            "strength": 4,
            "toughness": 0
          },
          "stories": [],
          "traits": []
        },
        "26": {
          "age": 25,
          "class": [
            "Barbarian"
          ],
          "id": 26,
          "loot": [
            "Amulet",
            "Dragonskin Belt of Titans",
            "Scimitar of Skill"
          ],
          "name": {
            "firstName": "John",
            "id": 7634,
            "lastName": "Henrichon",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Streetwise"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 4,
            "magic": 3,
            "resourcefulness": 3,
            "strength": 4,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "elegance"
          ]
        },
        "27": {
          "age": 89,
          "class": [
            "Barbarian"
          ],
          "id": 27,
          "loot": [
            "Ornate Greaves",
            "Wool Shoes"
          ],
          "name": {
            "firstName": "Matthew",
            "id": 5205,
            "lastName": "Humblecut",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Ropework",
            "Leadership",
            "Tracking",
            "Acrobatics",
            "Marketing"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 3,
            "magic": 3,
            "resourcefulness": 1,
            "strength": 1,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "dragon obsession",
            "unluckiness",
            "deafness"
          ]
        },
        "28": {
          "age": 94,
          "class": [
            "Warlock"
          ],
          "id": 28,
          "loot": [
            "Holy Greaves of Reflection",
            "Shoes",
            "Demonhide Boots"
          ],
          "name": {
            "firstName": "Miguel",
            "id": 1740,
            "lastName": "Maki",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Deception",
            "Ropework",
            "Alchemy",
            "Archery",
            "Swordskill"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 2,
            "magic": 4,
            "resourcefulness": 4,
            "strength": 1,
            "toughness": 4
          },
          "stories": [],
          "traits": []
        },
        "29": {
          "age": 50,
          "class": [
            "Barbarian"
          ],
          "id": 29,
          "loot": [
            "Linen Hood",
            "Dragonskin Boots",
            "Leather Cap of Fury",
            "Chain Mail",
            "Warhammer"
          ],
          "name": {
            "firstName": "Bolethe",
            "id": 2415,
            "lastName": "Nakamoto",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Politics",
            "Portraiture",
            "Streetwise"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 1,
            "magic": 4,
            "resourcefulness": 2,
            "strength": 4,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "great destiny"
          ]
        },
        "30": {
          "age": 83,
          "class": [
            "Paladin"
          ],
          "id": 30,
          "loot": [
            "Grave Wand",
            "Amulet",
            "Demon's Hands",
            "Studded Leather Gloves",
            "Linen Gloves of Rage"
          ],
          "name": {
            "firstName": "Chukwuebuka",
            "id": 1438,
            "lastName": "Egede",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Investigation"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 3,
            "magic": 2,
            "resourcefulness": 4,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "self-doubt"
          ]
        },
        "31": {
          "age": 82,
          "class": [
            "Paladin"
          ],
          "id": 31,
          "loot": [
            "Silk Sash",
            "Grave Wand",
            "Plate Mail of Brilliance"
          ],
          "name": {
            "firstName": "Astra",
            "id": 1936,
            "lastName": "K",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Swimming",
            "Haberdashery"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 4,
            "magic": 0,
            "resourcefulness": 0,
            "strength": 1,
            "toughness": 3
          },
          "stories": [],
          "traits": []
        },
        "32": {
          "age": 101,
          "class": [
            "Bard"
          ],
          "id": 32,
          "loot": [
            "Necklace",
            "Leather Cap",
            "Hard Leather Armor of Brilliance",
            "Ornate Helm",
            "Pendant",
            "Linen Hood"
          ],
          "name": {
            "firstName": "Chishou",
            "id": 6035,
            "lastName": "Sandgreen",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Swordskill",
            "Politics"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 1,
            "magic": 0,
            "resourcefulness": 3,
            "strength": 3,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "weakness",
            "anxiety"
          ]
        },
        "33": {
          "age": 86,
          "class": [
            "Bard"
          ],
          "id": 33,
          "loot": [
            "Bronze Ring of the Twins",
            "Mesh Belt of Rage",
            "\"Carrion Sun\" Titanium Ring of the Fox",
            "Leather Belt",
            "Full Helm",
            "Necklace",
            "Hard Leather Gloves",
            "Leather Cap of Anger",
            "Titanium Ring of Detection"
          ],
          "name": {
            "firstName": "Robert",
            "id": 959,
            "lastName": "Plain",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Ancient Lore",
            "Baking",
            "Politics"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 3,
            "magic": 3,
            "resourcefulness": 0,
            "strength": 1,
            "toughness": 3
          },
          "stories": [],
          "traits": [
            "anxiety",
            "great destiny"
          ]
        },
        "34": {
          "age": 75,
          "class": [
            "Barbarian"
          ],
          "id": 34,
          "loot": [
            "Linen Shoes"
          ],
          "name": {
            "firstName": "Carly",
            "id": 5912,
            "lastName": "Berg",
            "middleName": "",
            "prefix": "",
            "suffix": "the Fighter"
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Horsemanship"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 1,
            "magic": 0,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "unluckiness",
            "weakness"
          ]
        },
        "35": {
          "age": 79,
          "class": [
            "Barbarian"
          ],
          "id": 35,
          "loot": [
            "Holy Gauntlets",
            "Leather Gloves",
            "Falchion"
          ],
          "name": {
            "firstName": "Bellas",
            "id": 7959,
            "lastName": "Araujo",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Ancient Lore"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 2,
            "magic": 0,
            "resourcefulness": 0,
            "strength": 0,
            "toughness": 3
          },
          "stories": [],
          "traits": [
            "monsterphobia"
          ]
        },
        "36": {
          "age": 93,
          "class": [
            "Barbarian"
          ],
          "id": 36,
          "loot": [
            "Necklace",
            "Demon Husk"
          ],
          "name": {
            "firstName": "Abigail",
            "id": 6472,
            "lastName": "Took-Took",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Haberdashery",
            "Archery",
            "Alchemy",
            "Acrobatics",
            "Baking"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 0,
            "resourcefulness": 4,
            "strength": 3,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "unluckiness"
          ]
        },
        "76": {
          "name": {
            "id": 7192,
            "prefix": "",
            "firstName": "Geoffrey",
            "middleName": "",
            "lastName": "Collymore",
            "suffix": ""
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Halfling"
          ],
          "age": 72,
          "traits": [],
          "id": 76,
          "class": [
            "Druid"
          ],
          "stats": {
            "strength": 2,
            "magic": 4,
            "agility": 1,
            "resourcefulness": 4,
            "toughness": 2
          },
          "skills": [
            "Leadership"
          ],
          "loot": [
            "Pendant"
          ],
          "stories": []
        }
      },
      "bard": {
        "age": 32,
        "name": {
          "firstName": "Satoshi",
          "id": 2722,
          "lastName": "Ford",
          "middleName": "",
          "prefix": "",
          "suffix": ""
        },
        "pronouns": {
          "depPossessive": "her",
          "indPossessive": "hers",
          "object": "her",
          "reflexive": "herself",
          "subject": "she"
        },
        "species": [
          "Half-Elf"
        ],
        "traits": [
          "optimistism",
          "greed"
        ]
      },
      "gold": 0,
      "graveyard": {},
      "id": 2,
      "location": "the Last Stop",
      "motto": "Where We go, They Follow",
      "name": "Cherished Heart Temple"
    },
    {
      "adventurerCredits": {},
      "adventurers": {
        "37": {
          "age": 63,
          "class": [
            "Fighter"
          ],
          "id": 37,
          "loot": [
            "Pendant of the Fox",
            "Divine Robe",
            "Gauntlets",
            "\"Woe Bite\" Silk Sash of Enlightenment +1"
          ],
          "name": {
            "firstName": "Rosvita",
            "id": 948,
            "lastName": "Kufersin",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Alchemy"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 2,
            "magic": 2,
            "resourcefulness": 3,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "a peg leg",
            "great destiny",
            "unluckiness"
          ]
        },
        "39": {
          "age": 73,
          "class": [
            "Paladin"
          ],
          "id": 39,
          "loot": [
            "Book of the Twins",
            "Platinum Ring",
            "Heavy Boots",
            "Linen Sash",
            "Holy Gauntlets",
            "Gauntlets",
            "\"Tempest Peak\" Leather Cap of Enlightenment +1"
          ],
          "name": {
            "firstName": "Noah",
            "id": 7854,
            "lastName": "Kwiatkowski",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Metallurgy",
            "Ancient Lore",
            "Politics",
            "Portraiture",
            "Haberdashery",
            "Archery"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 2,
            "magic": 0,
            "resourcefulness": 2,
            "strength": 1,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "optimistism",
            "gambling addiction",
            "greed",
            "elegance",
            "a peg leg"
          ]
        },
        "40": {
          "age": 82,
          "class": [
            "Sorcerer"
          ],
          "id": 40,
          "loot": [
            "Demon Crown of the Twins",
            "Demonhide Belt",
            "Titanium Ring",
            "Short Sword of the Twins",
            "Divine Slippers",
            "Hood"
          ],
          "name": {
            "firstName": "Hilarij",
            "id": 4951,
            "lastName": "Hendrix",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Navigation",
            "Archery",
            "Alchemy"
          ],
          "species": [
            "Dwarf"
          ],
          "stats": {
            "agility": 2,
            "magic": 1,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "cowardice",
            "dragon obsession",
            "unluckiness"
          ]
        },
        "41": {
          "age": 63,
          "class": [
            "Cleric"
          ],
          "id": 41,
          "loot": [
            "Falchion"
          ],
          "name": {
            "firstName": "Amou",
            "id": 6074,
            "lastName": "Nystrom",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Ancient Lore"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 1,
            "magic": 3,
            "resourcefulness": 4,
            "strength": 1,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "a peg leg"
          ]
        },
        "43": {
          "age": 97,
          "class": [
            "Sorcerer"
          ],
          "id": 43,
          "loot": [
            "Quarterstaff",
            "\"Shimmering Bender\" Pendant of Power +1",
            "Ancient Helm of Vitriol",
            "Chain Gloves",
            "Holy Gauntlets",
            "\"Vortex Sun\" War Belt of Perfection"
          ],
          "name": {
            "firstName": "Changpeng",
            "id": 2581,
            "lastName": "Humblecut",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Politics",
            "Swordskill"
          ],
          "species": [
            "Gnome"
          ],
          "stats": {
            "agility": 0,
            "magic": 1,
            "resourcefulness": 0,
            "strength": 3,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "unluckiness",
            "deafness"
          ]
        },
        "44": {
          "age": 103,
          "class": [
            "Barbarian"
          ],
          "id": 44,
          "loot": [
            "Brightsilk Sash",
            "\"Carrion Glow\" Scimitar of Rage",
            "\"Oblivion Moon\" Pendant of Vitriol +1",
            "Pendant"
          ],
          "name": {
            "firstName": "James",
            "id": 795,
            "lastName": "Enoksen",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Archeology"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 3,
            "magic": 1,
            "resourcefulness": 2,
            "strength": 0,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "a prosthetic arm",
            "quick-wit"
          ]
        },
        "45": {
          "age": 83,
          "class": [
            "Warlock"
          ],
          "id": 45,
          "loot": [
            "Linen Sash",
            "Dragonskin Belt",
            "Maul of Fury",
            "Platinum Ring of Enlightenment",
            "Amulet",
            "Necklace",
            "Divine Gloves"
          ],
          "name": {
            "firstName": "Su",
            "id": 7190,
            "lastName": "Quenneville",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Haberdashery",
            "Leadership"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 2,
            "magic": 2,
            "resourcefulness": 3,
            "strength": 3,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "a prosthetic arm",
            "dragon obsession"
          ]
        },
        "46": {
          "age": 86,
          "class": [
            "Cleric"
          ],
          "id": 46,
          "loot": [
            "Amulet",
            "Ornate Chestplate",
            "Heavy Belt",
            "Platinum Ring of Fury",
            "Mesh Belt of the Twins",
            "Holy Chestplate of Enlightenment",
            "Necklace of the Twins"
          ],
          "name": {
            "firstName": "Vesryn",
            "id": 6968,
            "lastName": "Yellen",
            "middleName": "",
            "prefix": "",
            "suffix": "da gay"
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Politics",
            "Horsemanship"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 3,
            "magic": 4,
            "resourcefulness": 4,
            "strength": 3,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "monsterphobia",
            "martyr complex",
            "quick-wit"
          ]
        },
        "47": {
          "age": 75,
          "class": [
            "Sorcerer"
          ],
          "id": 47,
          "loot": [
            "Divine Gloves",
            "Gauntlets of Anger",
            "Platinum Ring",
            "Dragonskin Gloves",
            "War Belt",
            "Book"
          ],
          "name": {
            "firstName": "Molly",
            "id": 3951,
            "lastName": "Pelletier",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Archery"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 0,
            "resourcefulness": 4,
            "strength": 2,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "optimistism",
            "greed",
            "martyr complex",
            "a prosthetic arm",
            "dragon obsession"
          ]
        },
        "48": {
          "age": 28,
          "class": [
            "Wizard"
          ],
          "id": 48,
          "loot": [
            "Ornate Belt",
            "Quarterstaff",
            "Dragonskin Gloves of Power",
            "Demon's Hands",
            "Silk Slippers",
            "Ancient Helm"
          ],
          "name": {
            "firstName": "Kerstin",
            "id": 4441,
            "lastName": "Skotnik",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Alchemy",
            "Streetwise",
            "Archeology",
            "Swimming"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 1,
            "magic": 1,
            "resourcefulness": 0,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "quick-wit",
            "aggressive impulses",
            "greed"
          ]
        },
        "77": {
          "name": {
            "id": 3019,
            "prefix": "",
            "firstName": "Quintus",
            "middleName": "",
            "lastName": "Kiss",
            "suffix": ""
          },
          "pronouns": {
            "subject": "she",
            "object": "her",
            "depPossessive": "her",
            "indPossessive": "hers",
            "reflexive": "herself"
          },
          "species": [
            "Dragonborn"
          ],
          "age": 46,
          "traits": [],
          "id": 77,
          "class": [
            "Bard"
          ],
          "stats": {
            "strength": 2,
            "magic": 3,
            "agility": 1,
            "resourcefulness": 0,
            "toughness": 2
          },
          "skills": [
            "Arcane Arts"
          ],
          "loot": [
            "\"Woe Grasp\" Demonhide Belt of Skill +1"
          ],
          "stories": []
        }
      },
      "bard": {
        "age": 86,
        "name": {
          "firstName": "Jody",
          "id": 1913,
          "lastName": "Gresham",
          "middleName": "",
          "prefix": "",
          "suffix": ""
        },
        "pronouns": {
          "depPossessive": "their",
          "indPossessive": "theirs",
          "object": "them",
          "reflexive": "themself",
          "subject": "they"
        },
        "species": [
          "Halfling"
        ],
        "traits": [
          "greed",
          "great destiny"
        ]
      },
      "gold": 0,
      "graveyard": {
        "38": {
          "age": 79,
          "class": [
            "Sorcerer"
          ],
          "id": 38,
          "loot": [
            "Ornate Greaves",
            "Hood",
            "Studded Leather Armor"
          ],
          "name": {
            "firstName": "Ravil",
            "id": 1876,
            "lastName": "Woods",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Leadership"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 2,
            "magic": 3,
            "resourcefulness": 3,
            "strength": 1,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "quick-wit"
          ]
        },
        "42": {
          "age": 98,
          "class": [
            "Barbarian"
          ],
          "id": 42,
          "loot": [
            "Amulet",
            "Wand",
            "Leather Boots of Brilliance",
            "Ornate Gauntlets",
            "Titanium Ring of Brilliance"
          ],
          "name": {
            "firstName": "Isak",
            "id": 4903,
            "lastName": "Izmaylov",
            "middleName": "in",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Ropework"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 4,
            "magic": 4,
            "resourcefulness": 3,
            "strength": 0,
            "toughness": 1
          },
          "stories": [],
          "traits": []
        }
      },
      "id": 3,
      "location": "the Flying Stones",
      "motto": "Prosperity at Any Cost",
      "name": "Platinum Branch Club"
    },
    {
      "adventurerCredits": {},
      "adventurers": {
        "49": {
          "age": 21,
          "class": [
            "Warlock"
          ],
          "id": 49,
          "loot": [
            "Dragonskin Armor",
            "Bronze Ring of Detection",
            "Linen Shoes",
            "Leather Armor",
            "Gloves",
            "Chain Gloves"
          ],
          "name": {
            "firstName": "Mary",
            "id": 5897,
            "lastName": "Yearwood",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Alchemy"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 2,
            "resourcefulness": 0,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": []
        },
        "50": {
          "age": 84,
          "class": [
            "Wizard"
          ],
          "id": 50,
          "loot": [
            "Studded Leather Belt",
            "Leather Boots",
            "Hard Leather Belt"
          ],
          "name": {
            "firstName": "Darfin",
            "id": 4174,
            "lastName": "Lopez",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Marketing",
            "Metallurgy"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 4,
            "magic": 4,
            "resourcefulness": 1,
            "strength": 3,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "dragon obsession"
          ]
        },
        "51": {
          "age": 65,
          "class": [
            "Paladin"
          ],
          "id": 51,
          "loot": [
            "Linen Hood",
            "Dragonskin Armor of Reflection",
            "Amulet",
            "Demonhide Belt of Detection",
            "Greaves",
            "\"Apocalypse Root\" Quarterstaff of Skill",
            "Divine Robe of Vitriol"
          ],
          "name": {
            "firstName": "Caspian",
            "id": 1069,
            "lastName": "Thatcher",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Swimming"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 1,
            "magic": 1,
            "resourcefulness": 4,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "cowardice",
            "great destiny",
            "anxiety"
          ]
        },
        "52": {
          "age": 38,
          "class": [
            "Cleric"
          ],
          "id": 52,
          "loot": [
            "Full Helm",
            "Hard Leather Armor",
            "Hard Leather Armor of Fury",
            "Mace of the Twins"
          ],
          "name": {
            "firstName": "Dioscoro",
            "id": 539,
            "lastName": "Rodrigue",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Baking"
          ],
          "species": [
            "Half-Elf"
          ],
          "stats": {
            "agility": 0,
            "magic": 2,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "self-doubt",
            "weakness"
          ]
        },
        "53": {
          "age": 56,
          "class": [
            "Cleric"
          ],
          "id": 53,
          "loot": [
            "\"Cataclysm Bite\" Silk Sash of Perfection +1",
            "Warhammer",
            "Silver Ring",
            "Pendant of Giants",
            "Divine Slippers",
            "Greaves",
            "Scimitar",
            "Katana"
          ],
          "name": {
            "firstName": "Satoshi",
            "id": 2265,
            "lastName": "Lelkova",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Deception",
            "Streetwise",
            "Marketing"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 0,
            "magic": 3,
            "resourcefulness": 1,
            "strength": 1,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "self-doubt",
            "deafness"
          ]
        },
        "54": {
          "age": 56,
          "class": [
            "Barbarian"
          ],
          "id": 54,
          "loot": [
            "Heavy Boots of Power",
            "\"Gloom Shout\" Grave Wand of Detection +1",
            "Gold Ring",
            "Ornate Greaves"
          ],
          "name": {
            "firstName": "Matthew",
            "id": 2030,
            "lastName": "Sandgreen",
            "middleName": "",
            "prefix": "Queen",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Haberdashery"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 2,
            "magic": 1,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 0
          },
          "stories": [],
          "traits": [
            "weakness"
          ]
        },
        "55": {
          "age": 104,
          "class": [
            "Monk"
          ],
          "id": 55,
          "loot": [
            "Plated Belt",
            "Ornate Belt",
            "Pendant",
            "Wand",
            "Linen Gloves",
            "Gloves of Enlightenment"
          ],
          "name": {
            "firstName": "Bogdan",
            "id": 7472,
            "lastName": "Finnegan",
            "middleName": "",
            "prefix": "Private",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Acrobatics",
            "Politics",
            "Alchemy",
            "Horsemanship"
          ],
          "species": [
            "Half-Orc"
          ],
          "stats": {
            "agility": 3,
            "magic": 0,
            "resourcefulness": 4,
            "strength": 2,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "elegance"
          ]
        },
        "56": {
          "age": 80,
          "class": [
            "Paladin"
          ],
          "id": 56,
          "loot": [
            "Crown",
            "Necklace"
          ],
          "name": {
            "firstName": "Ebony",
            "id": 3717,
            "lastName": "Aliyeva",
            "middleName": "of",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Archeology"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 3,
            "magic": 3,
            "resourcefulness": 3,
            "strength": 4,
            "toughness": 2
          },
          "stories": [],
          "traits": [
            "trauma"
          ]
        },
        "57": {
          "age": 73,
          "class": [
            "Bard"
          ],
          "id": 57,
          "loot": [
            "Amulet",
            "Dragonskin Armor"
          ],
          "name": {
            "firstName": "Anastazja",
            "id": 508,
            "lastName": "Hakugi",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Marketing"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 0,
            "magic": 2,
            "resourcefulness": 3,
            "strength": 1,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "aggressive impulses"
          ]
        },
        "58": {
          "age": 31,
          "class": [
            "Bard"
          ],
          "id": 58,
          "loot": [
            "\"Soul Roar\" Ornate Greaves of the Fox",
            "Leather Armor of Perfection",
            "Leather Cap",
            "Demonhide Belt"
          ],
          "name": {
            "firstName": "Archibaldo",
            "id": 2094,
            "lastName": "Crassus",
            "middleName": "",
            "prefix": "Khal",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Acrobatics",
            "Marketing",
            "Politics"
          ],
          "species": [
            "Elf"
          ],
          "stats": {
            "agility": 4,
            "magic": 2,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 3
          },
          "stories": [],
          "traits": [
            "optimistism"
          ]
        },
        "59": {
          "age": 78,
          "class": [
            "Warlock"
          ],
          "id": 59,
          "loot": [
            "Hard Leather Gloves of Fury",
            "Silk Gloves of Giants",
            "Hard Leather Boots"
          ],
          "name": {
            "firstName": "Sarah",
            "id": 4273,
            "lastName": "Cromwell",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Acrobatics",
            "Tracking"
          ],
          "species": [
            "Tiefling"
          ],
          "stats": {
            "agility": 2,
            "magic": 1,
            "resourcefulness": 1,
            "strength": 4,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "anxiety"
          ]
        },
        "60": {
          "age": 50,
          "class": [
            "Bard"
          ],
          "id": 60,
          "loot": [
            "Ornate Belt",
            "Chain Boots",
            "Plate Mail"
          ],
          "name": {
            "firstName": "Ivan",
            "id": 216,
            "lastName": "Henrichon",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "their",
            "indPossessive": "theirs",
            "object": "them",
            "reflexive": "themself",
            "subject": "they"
          },
          "skills": [
            "Swordskill",
            "Baking"
          ],
          "species": [
            "Human"
          ],
          "stats": {
            "agility": 1,
            "magic": 2,
            "resourcefulness": 1,
            "strength": 3,
            "toughness": 4
          },
          "stories": [],
          "traits": [
            "greed"
          ]
        },
        "61": {
          "age": 68,
          "class": [
            "Cleric"
          ],
          "id": 61,
          "loot": [
            "Wool Sash",
            "Amulet of Protection",
            "\"Behemoth Sun\" Amulet of the Fox",
            "Shoes",
            "Grimoire"
          ],
          "name": {
            "firstName": "Dzemail",
            "id": 3466,
            "lastName": "Kiss",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "his",
            "indPossessive": "his",
            "object": "him",
            "reflexive": "himself",
            "subject": "he"
          },
          "skills": [
            "Archery",
            "Alchemy"
          ],
          "species": [
            "Dragonborn"
          ],
          "stats": {
            "agility": 3,
            "magic": 4,
            "resourcefulness": 2,
            "strength": 2,
            "toughness": 2
          },
          "stories": [],
          "traits": []
        },
        "62": {
          "age": 98,
          "class": [
            "Monk"
          ],
          "id": 62,
          "loot": [
            "Brightsilk Sash",
            "Gold Ring of the Fox",
            "Grimoire",
            "Platinum Ring",
            "Silk Sash"
          ],
          "name": {
            "firstName": "Annabelle",
            "id": 1028,
            "lastName": "Jackson",
            "middleName": "",
            "prefix": "",
            "suffix": ""
          },
          "pronouns": {
            "depPossessive": "her",
            "indPossessive": "hers",
            "object": "her",
            "reflexive": "herself",
            "subject": "she"
          },
          "skills": [
            "Archeology"
          ],
          "species": [
            "Halfling"
          ],
          "stats": {
            "agility": 2,
            "magic": 1,
            "resourcefulness": 3,
            "strength": 4,
            "toughness": 1
          },
          "stories": [],
          "traits": [
            "gambling addiction",
            "aggressive impulses"
          ]
        },
        "78": {
          "name": {
            "id": 4699,
            "prefix": "",
            "firstName": "Chinyelu",
            "middleName": "",
            "lastName": "Nakamoto",
            "suffix": ""
          },
          "pronouns": {
            "subject": "they",
            "object": "them",
            "depPossessive": "their",
            "indPossessive": "theirs",
            "reflexive": "themself"
          },
          "species": [
            "Dragonborn"
          ],
          "age": 59,
          "traits": [],
          "id": 78,
          "class": [
            "Monk"
          ],
          "stats": {
            "strength": 1,
            "magic": 2,
            "agility": 0,
            "resourcefulness": 0,
            "toughness": 0
          },
          "skills": [
            "Baking"
          ],
          "loot": [
            "Short Sword"
          ],
          "stories": []
        }
      },
      "bard": {
        "age": 80,
        "name": {
          "firstName": "Laura",
          "id": 4099,
          "lastName": "Humblecut",
          "middleName": "",
          "prefix": "",
          "suffix": ""
        },
        "pronouns": {
          "depPossessive": "his",
          "indPossessive": "his",
          "object": "him",
          "reflexive": "himself",
          "subject": "he"
        },
        "species": [
          "Dragonborn"
        ],
        "traits": [
          "a peg leg",
          "martyr complex"
        ]
      },
      "gold": 0,
      "graveyard": {},
      "id": 4,
      "location": "the Dregs",
      "motto": "Four Hundrend Thirty Seven",
      "name": "Hall of Heads"
    },
    {
      "id": 5,
      "name": "Klaxon Messengerhall",
      "motto": "Heads High into the Night",
      "location": "the Dregs",
      "bard": {
        "name": {
          "id": 1453,
          "prefix": "",
          "firstName": "Joseph",
          "middleName": "",
          "lastName": "Hermanns",
          "suffix": ""
        },
        "pronouns": {
          "subject": "she",
          "object": "her",
          "depPossessive": "her",
          "indPossessive": "hers",
          "reflexive": "herself"
        },
        "species": [
          "Rat"
        ],
        "age": 3,
        "traits": [
          "greed",
          "elegance"
        ]
      },
      "adventurers": {
        "63": {
          "name": {
            "id": 7437,
            "prefix": "",
            "firstName": "Jessica",
            "middleName": "",
            "lastName": "Leehy",
            "suffix": ""
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Rat"
          ],
          "age": 1,
          "traits": [],
          "id": 63,
          "class": [
            "Druid"
          ],
          "stats": {
            "strength": 0,
            "magic": 4,
            "agility": 0,
            "resourcefulness": 3,
            "toughness": 1
          },
          "skills": [
            "Haberdashery"
          ],
          "loot": [
            "Cap"
          ],
          "stories": []
        },
        "64": {
          "name": {
            "id": 7230,
            "prefix": "",
            "firstName": "Abdelhak",
            "middleName": "",
            "lastName": "Davis",
            "suffix": ""
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Rat"
          ],
          "age": 4,
          "traits": [],
          "id": 64,
          "class": [
            "Rogue"
          ],
          "stats": {
            "strength": 4,
            "magic": 1,
            "agility": 2,
            "resourcefulness": 2,
            "toughness": 0
          },
          "skills": [
            "Tracking"
          ],
          "loot": [
            "Studded Leather Belt"
          ],
          "stories": []
        },
        "65": {
          "name": {
            "id": 3650,
            "prefix": "",
            "firstName": "Gawel",
            "middleName": "",
            "lastName": "Nakamoto",
            "suffix": ""
          },
          "pronouns": {
            "subject": "she",
            "object": "her",
            "depPossessive": "her",
            "indPossessive": "hers",
            "reflexive": "herself"
          },
          "species": [
            "Rat"
          ],
          "age": 11,
          "traits": [],
          "id": 65,
          "class": [
            "Bard"
          ],
          "stats": {
            "strength": 1,
            "magic": 3,
            "agility": 2,
            "resourcefulness": 4,
            "toughness": 0
          },
          "skills": [
            "Alchemy"
          ],
          "loot": [
            "Leather Boots"
          ],
          "stories": []
        },
        "66": {
          "name": {
            "id": 5486,
            "prefix": "",
            "firstName": "Chinyelu",
            "middleName": "chadde",
            "lastName": "West",
            "suffix": ""
          },
          "pronouns": {
            "subject": "she",
            "object": "her",
            "depPossessive": "her",
            "indPossessive": "hers",
            "reflexive": "herself"
          },
          "species": [
            "Rat"
          ],
          "age": 5,
          "traits": [],
          "id": 66,
          "class": [
            "Druid"
          ],
          "stats": {
            "strength": 0,
            "magic": 1,
            "agility": 4,
            "resourcefulness": 1,
            "toughness": 4
          },
          "skills": [
            "Alchemy"
          ],
          "loot": [
            "Amulet of Giants"
          ],
          "stories": []
        },
        "67": {
          "name": {
            "id": 5968,
            "prefix": "",
            "firstName": "Darda",
            "middleName": "",
            "lastName": "Izmaylov",
            "suffix": ""
          },
          "pronouns": {
            "subject": "they",
            "object": "them",
            "depPossessive": "their",
            "indPossessive": "theirs",
            "reflexive": "themself"
          },
          "species": [
            "Rat"
          ],
          "age": 9,
          "traits": [],
          "id": 67,
          "class": [
            "Druid"
          ],
          "stats": {
            "strength": 3,
            "magic": 0,
            "agility": 0,
            "resourcefulness": 0,
            "toughness": 3
          },
          "skills": [
            "Investigation"
          ],
          "loot": [
            "Platinum Ring"
          ],
          "stories": []
        },
        "68": {
          "name": {
            "id": 647,
            "prefix": "",
            "firstName": "Michael",
            "middleName": "",
            "lastName": "Ford",
            "suffix": ""
          },
          "pronouns": {
            "subject": "they",
            "object": "them",
            "depPossessive": "their",
            "indPossessive": "theirs",
            "reflexive": "themself"
          },
          "species": [
            "Rat"
          ],
          "age": 6,
          "traits": [],
          "id": 68,
          "class": [
            "Wizard"
          ],
          "stats": {
            "strength": 1,
            "magic": 1,
            "agility": 2,
            "resourcefulness": 0,
            "toughness": 2
          },
          "skills": [
            "Portraiture"
          ],
          "loot": [
            "Heavy Gloves of Giants"
          ],
          "stories": []
        },
        "69": {
          "name": {
            "id": 2316,
            "prefix": "",
            "firstName": "Hana",
            "middleName": "",
            "lastName": "Crassus",
            "suffix": ""
          },
          "pronouns": {
            "subject": "they",
            "object": "them",
            "depPossessive": "their",
            "indPossessive": "theirs",
            "reflexive": "themself"
          },
          "species": [
            "Rat"
          ],
          "age": 7,
          "traits": [],
          "id": 69,
          "class": [
            "Warlock"
          ],
          "stats": {
            "strength": 1,
            "magic": 4,
            "agility": 4,
            "resourcefulness": 2,
            "toughness": 3
          },
          "skills": [
            "Disguise"
          ],
          "loot": [
            "Warhammer"
          ],
          "stories": []
        },
        "70": {
          "name": {
            "id": 6047,
            "prefix": "",
            "firstName": "Ambrogino",
            "middleName": "",
            "lastName": "Tjangamarra",
            "suffix": ""
          },
          "pronouns": {
            "subject": "she",
            "object": "her",
            "depPossessive": "her",
            "indPossessive": "hers",
            "reflexive": "herself"
          },
          "species": [
            "Rat"
          ],
          "age": 2,
          "traits": [],
          "id": 70,
          "class": [
            "Warlock"
          ],
          "stats": {
            "strength": 2,
            "magic": 0,
            "agility": 1,
            "resourcefulness": 1,
            "toughness": 3
          },
          "skills": [
            "Marketing"
          ],
          "loot": [
            "Dragonskin Gloves of Power"
          ],
          "stories": []
        },
        "71": {
          "name": {
            "id": 2451,
            "prefix": "",
            "firstName": "Martin Davorin",
            "middleName": "",
            "lastName": "Cromwell",
            "suffix": ""
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Rat"
          ],
          "age": 12,
          "traits": [],
          "id": 71,
          "class": [
            "Ranger"
          ],
          "stats": {
            "strength": 4,
            "magic": 0,
            "agility": 1,
            "resourcefulness": 0,
            "toughness": 3
          },
          "skills": [
            "Ancient Lore"
          ],
          "loot": [
            "Leather Gloves"
          ],
          "stories": []
        },
        "72": {
          "name": {
            "id": 450,
            "prefix": "",
            "firstName": "Bella",
            "middleName": "",
            "lastName": "Adler",
            "suffix": "Jr."
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Rat"
          ],
          "age": 1,
          "traits": [],
          "id": 72,
          "class": [
            "Monk"
          ],
          "stats": {
            "strength": 3,
            "magic": 2,
            "agility": 2,
            "resourcefulness": 0,
            "toughness": 4
          },
          "skills": [
            "Swordskill"
          ],
          "loot": [
            "Chain Mail"
          ],
          "stories": []
        },
        "73": {
          "name": {
            "id": 7787,
            "prefix": "",
            "firstName": "Efraim",
            "middleName": "amogsus",
            "lastName": "Ashbluff",
            "suffix": "the Fighter"
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Rat"
          ],
          "age": 3,
          "traits": [],
          "id": 73,
          "class": [
            "Paladin"
          ],
          "stats": {
            "strength": 4,
            "magic": 0,
            "agility": 1,
            "resourcefulness": 3,
            "toughness": 4
          },
          "skills": [
            "Metallurgy"
          ],
          "loot": [
            "Pendant"
          ],
          "stories": []
        },
        "79": {
          "name": {
            "id": 826,
            "prefix": "",
            "firstName": "Mohammed",
            "middleName": "",
            "lastName": "Goncalves",
            "suffix": ""
          },
          "pronouns": {
            "subject": "he",
            "object": "him",
            "depPossessive": "his",
            "indPossessive": "his",
            "reflexive": "himself"
          },
          "species": [
            "Elf"
          ],
          "age": 81,
          "traits": [],
          "id": 79,
          "class": [
            "Fighter"
          ],
          "stats": {
            "strength": 4,
            "magic": 1,
            "agility": 4,
            "resourcefulness": 1,
            "toughness": 2
          },
          "skills": [
            "Politics"
          ],
          "loot": [
            "Divine Gloves"
          ],
          "stories": []
        }
      },
      "graveyard": {},
      "adventurerCredits": {},
      "gold": 0
    }
  ]
}