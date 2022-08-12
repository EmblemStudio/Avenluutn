const weapons = [
  "Warhammer",
  "Quarterstaff",
  "Maul",
  "Mace",
  "Club",
  "Katana",
  "Falchion",
  "Scimitar",
  "Long Sword",
  "Short Sword",
  "Ghost Wand",
  "Grave Wand",
  "Bone Wand",
  "Wand",
  "Grimoire",
  "Chronicle",
  "Tome",
  "Book"
]

const chestArmor = [
  "Divine Robe",
  "Silk Robe",
  "Linen Robe",
  "Robe",
  "Shirt",
  "Demon Husk",
  "Dragonskin Armor",
  "Studded Leather Armor",
  "Hard Leather Armor",
  "Leather Armor",
  "Holy Chestplate",
  "Ornate Chestplate",
  "Plate Mail",
  "Chain Mail",
  "Ring Mail"
]

const headArmor = [
  "Ancient Helm",
  "Ornate Helm",
  "Great Helm",
  "Full Helm",
  "Helm",
  "Demon Crown",
  "Dragon's Crown",
  "War Cap",
  "Leather Cap",
  "Cap",
  "Crown",
  "Divine Hood",
  "Silk Hood",
  "Linen Hood",
  "Hood"
]

const waistArmor = [
   "Ornate Belt",
   "War Belt",
   "Plated Belt",
   "Mesh Belt",
   "Heavy Belt",
   "Demonhide Belt",
   "Dragonskin Belt",
   "Studded Leather Belt",
   "Hard Leather Belt",
   "Leather Belt",
   "Brightsilk Sash",
   "Silk Sash",
   "Wool Sash",
   "Linen Sash",
   "Sash"
]

const footArmor = [
  "Holy Greaves",
  "Ornate Greaves",
  "Greaves",
  "Chain Boots",
  "Heavy Boots",
  "Demonhide Boots",
  "Dragonskin Boots",
  "Studded Leather Boots",
  "Hard Leather Boots",
  "Leather Boots",
  "Divine Slippers",
  "Silk Slippers",
  "Wool Shoes",
  "Linen Shoes",
  "Shoes"
]

const handArmor = [
  "Holy Gauntlets",
  "Ornate Gauntlets",
  "Gauntlets",
  "Chain Gloves",
  "Heavy Gloves",
  "Demon's Hands",
  "Dragonskin Gloves",
  "Studded Leather Gloves",
  "Hard Leather Gloves",
  "Leather Gloves",
  "Divine Gloves",
  "Silk Gloves",
  "Wool Gloves",
  "Linen Gloves",
  "Gloves"
]

const necklaces = [
  "Necklace",
  "Amulet",
  "Pendant"
]

const rings = [
  "Gold Ring",
  "Silver Ring",
  "Bronze Ring",
  "Platinum Ring",
  "Titanium Ring"
]

function pluck(l: string[]) {
  return (i: number) => {
    return l[((i + 21) * 17) % l.length] ?? ""
  }
}

export default {
  getChest: pluck(chestArmor),
  getFoot: pluck(footArmor),
  getHand: pluck(handArmor),
  getNeck: pluck(necklaces),
  getRing: pluck(rings),
  getWaist: pluck(waistArmor),
  getWeapon: pluck(weapons),
  getHead: pluck(headArmor),
}

