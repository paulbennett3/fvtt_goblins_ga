// Invoke via chat as:
//   /macro cleanup id=<character sheet id>

// get the actor (actually, character sheet) we want to work with
let actor = game.actors.find(a => a.id === scope.id);
console.log('==================================')
console.log(' Updating character from traits')
console.log('==================================')
console.log(actor)


  
let class_info = {
    Warrior: {
        Level_Info: {
            1: { BAB: 1, SAVES: [14,17,15,17,16] , TOTAL_KNACKS: 1 },
            2: { BAB: 2, SAVES: [14,17,15,17,16] , TOTAL_KNACKS: 1 },
            3: { BAB: 3, SAVES: [13,16,14,14,15] , TOTAL_KNACKS: 2 },
            4: { BAB: 4, SAVES: [13,16,14,14,15] , TOTAL_KNACKS: 2 },
            5: { BAB: 5, SAVES: [11,14,12,12,13] , TOTAL_KNACKS: 2 },
            6: { BAB: 6, SAVES: [11,14,12,12,13] , TOTAL_KNACKS: 3 }
        },
        HD: 10,
        XP: [-1, 2000, 4000, 8000, 16000, 32000]
    },
    Mage: {
        Level_Info: {
            1: { BAB: 0, SAVES: [14,15,13,12,11] },
            2: { BAB: 1, SAVES: [14,15,13,12,11] },
            3: { BAB: 1, SAVES: [14,15,13,12,11] },
            4: { BAB: 2, SAVES: [14,15,13,12,11] },
            5: { BAB: 2, SAVES: [14,15,13,12,11] },
            6: { BAB: 3, SAVES: [13,13,11,10,9] }
        },
        HD: 6,
        XP: [-1, 2500, 5000, 10000, 20000, 40000]
    },
    Rogue: {
        Level_Info: {
            1: { BAB: 0, SAVES: [13,16,13,15,14] , TOTAL_SKILLS: 4 },
            2: { BAB: 1, SAVES: [13,16,13,15,14] , TOTAL_SKILLS: 4 },
            3: { BAB: 1, SAVES: [13,16,13,15,14] , TOTAL_SKILLS: 5 },
            4: { BAB: 2, SAVES: [13,16,13,15,14] , TOTAL_SKILLS: 5 },
            5: { BAB: 3, SAVES: [12,15,11,13,12] , TOTAL_SKILLS: 6 },
            6: { BAB: 3, SAVES: [12,15,11,13,12] , TOTAL_SKILLS: 6 }
        },
        HD: 8,
        XP: [-1, 1500, 3000, 6000, 12000, 25000, 50000]
    }
} 


function calculate_level (xp, level_xp) {
    let level = 0;
    let next_level = 0;
    for (let idx = 0; idx < level_xp.length; idx++) {
        if (level_xp[idx] <= xp) { 
            level += 1; 
            next_level = level_xp[idx + 1];
        }
    }
    return [level, next_level];
}

let bonus_map = {
    1: -4,
    2: -3,
    3: -3,
    4: -2,
    5: -2,
    6: -1,
    7: -1,
    8: -1,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 1,
    14: 1,
    15: 1,
    16: 2,
    17: 2,
    18: 3,
    19: 3
}

// Our dictionary of stuff that each trait adds to the character
let traits = {
    "Adv: 1 Home Destroyed By Violence": { CLASS: "Warrior", XP: 6000, STR: 6, CON: 6, TRAIT: ["Knack: Defensive Fighter (+1 AC)"], LEFT: { CON: 4} },
    "Adv: 2 Conscripted in the Lord's Army":  { CLASS: "Warrior", XP: 6000, STR:4, CON:4, WIS: 2, CHA: 2, TRAIT: ["Knack: Resilience (+1 to all saves)"], LEFT: { CHA: 4} },
    "Adv: 3 Carried Iron to the Dead King's Tomb ROGUE":  { CLASS: "Rogue", XP: 6000, DEX: 6, WIS: 6, SKILL: ["Undead Lore", "Tomb Robbing"], ITEM: ["thieves tools"], LEFT: { WIS: 4} },
    "Adv: 3 Carried Iron to the Dead King's Tomb WARRIOR":  { CLASS: "Warrior", XP: 6000, STR: 2, CON:4, WIS: 6, TRAIT: ["Knack: Great Strike (+1 damage)"], LEFT: { WIS: 4} },
    "Adv: 4 Tested at School ROGUE":  { CLASS: "Rogue", XP: 6000, DEX: 6, INT: 6, SKILL: ["Enigmas", "Athletics"], ITEM: ["thieves tools"], LEFT: { STR: 2, DEX: 2} },
    "Adv: 4 Tested at School WARRIOR":  { CLASS: "Warrior", XP: 6000, STR: 4, DEX: 4, CON: 4, TRAIT: ["Knack: Weapon Specialization"], LEFT: { STR: 2, DEX: 2} },
    "Adv: 5 An Almost Perfect Crime":  { CLASS: "Rogue", XP: 6000, DEX: 6, INT: 6, SKILL: ["Athletics", "Stealth"], ITEM: ["thieves tools"], LEFT: { DEX: 4} },
    "Adv: 6 University of the Unknowable MAGE":  { CLASS: "Mage", XP: 6000, INT: 8, WIS: 4, TRAIT: ["Sense Magic"], LEFT: { INT: 4 } },
    "Adv: 6 University of the Unknowable ROGUE":  { CLASS: "Rogue", XP: 6000, INT: 12, SKILL: ["Lying", "Sleight of Hand"], ITEM: ["thieves tools"], LEFT: { INT: 4 } },
    "Adv: 7 Pastoral Tutelage":  { CLASS: "Mage", XP: 6000, STR: 2, WIS: 8, TRAIT: ["Sense Magic", "True Name of a Spirit"], LEFT: { WIS: 4 } },
    "Adv: 8 The Angered Fae ROGUE":  { CLASS: "Rogue", XP: 6000, DEX: 4, WIS: 4, CHA: 4, SKILL: ["Faerie Lore", "Survival"], ITEM: ["thieves tools"], LEFT: { CHA: 4} },
    "Adv: 8 The Angered Fae MAGE":  { CLASS: "Mage", XP: 6000, INT: 4, WIS: 4, SKILL: ["Faerie Lore"], TRAIT: ["Sense Magic"], LEFT: { CHA: 4 } },
    "Bittersweet: 1 A Bitter Curse":  { INT: 2, WIS: 2, SKILL: ["-2 to 1 of etiquette,climb,hunt,lie,command"] },
    "Bittersweet: 2 Magic Treasure":  { },
    "Bittersweet: 3 Secret Knowledge":  { ITEM: ["Magic Tome"] },
    "Bittersweet: 4 Wealth and Banishment":  { TRAIT: ["Immense Wealth", "Reward on your head"] },
    "Bittersweet: 5 Loss of Titles":  { XP: 6000, CON: 2, SKILL: ["etiquette"], TRAIT: ["The King's Ire"] },
    "Bittersweet: 6 True Love":  { TRAIT: ["Ally: Your True Love"] },
    "Bittersweet: 7 A Sword with a Soul":  {},
    "Bittersweet: 8 A Hard Lesson":  { XP: 6000, WIS: 2, CON: -1 },
    "Childhood: 1 In the Fields":  { CON: 4, CHA: 4, SKILL: ["Farming OR Animal Handling"] },
    "Childhood: 2 On the Streets":  { DEX: 4, INT: 4, SKILL: ["Haggling OR Alertness"] },
    "Childhood: 3 At Court":  { INT: 4, CHA: 4, SKILL: ["Heraldry OR Etiquette"] },
    "Childhood: 4 Alone":  { CON: 4, CHA: 4, SKILL: ["Stealth OR Begging"] },
    "Childhood: 5 In the Workshop":  { INT: 4, WIS: 4, SKILL: ["Any TRADE or CRAFT skill"]},
    "Childhood: 6 In the Wild":  { STR: 4, CON:4, SKILL: ["Survival OR Hunting"] },
    "Childhood: 7 Training For Battle":  { STR: 4, CHA: 4, SKILL: ["Command OR Tactics"] },
    "Childhood: 8 On the Road":  { WIS: 4, CHA: 4, SKILL: ["Survival OR Performance"] },
    "Escape: 1 Touched by Chaos":  { XP: 6000, CON: 2, WIS: 2, RIGHT: { STR: 2} },
    "Escape: 2 Dark Dungeons Beneath the Earth":  { XP: 6000, STR: 2, DEX: 2, ITEM: ["lantern, hooded, Enchanted"], RIGHT: { DEX: 2} },
    "Escape: 3 Court Intrigue":  { XP: 6000, CHA: 2, WIS: 2, TRAIT: ["Place at the King's Table", "A few minor enemies"], RIGHT: { CHA: 2} },
    "Escape: 4 Heist Gone Bad":  { XP: 8000, TRAIT: ["Arthritic Knee (-1 DEX)", "Hatred for ladders"], RIGHT: { CON: 2} },
    "Escape: 5 Captured and Imprisoned":  { XP: 6000, STR: 2, CON: 2, ITEM: ["Dagger, +2"], TRAIT: ["Frightening Scars", "Distrust of Authority"], RIGHT: { INT: 2 }},
    "Escape: 6 Meddled Too Far in the Affairs of Wizards":  {XP: 6000, WIS: 2, CHA: -1, TRAIT: ["+1 to all saves", "Vegetarian"], RIGHT: { WIS: 2} },
    "Reward: 1 Renown in Battle":  { XP: 6000, INT: -1, WIS: -1 },
    "Reward: 2 Fast Friends":  { CHA: 2, STR: -1, TRAIT: ["Ally: Fast Friends"] },
    "Reward: 3 The King's Oath":  { CHA: 2, CON: -1, TRAIT: ["Hidden (Buried) Treasure Chest", "Occasional Attention of Betters"] },
    "Reward: 4 Lingering Scars and Ill Renown":  { XP: 6000, SKILL: ["Survival"], CON: -1, STR: -1, TRAIT: ["Banishment From ???"] },
    "Reward: 5 The Trust of a Stalwart Band":  { TRAIT: ["Ally: Stalwart Band", "Strict code of Ethics"] },
    "Reward: 6 Forbidden Knowledge":  { INT: 2, ITEM: ["Book of Forgotten Lore"] },
    "Rivalry: 1 On a Rooftop 20 Years Ago":  { DEX: 2, ITEM: ["Potion of +5 Dexterity"], OTHER: { DEX: 1} },
    "Rivalry: 2 Taking Credit for Killing That Necromancer":  { INT: 2, TRAIT: ["Detect Magic Items (Passive)"], OTHER: { INT: 1} },
    "Rivalry: 3 They're Your Nephew's Favorite Adventurer":  { STR: 2, TRAIT: ["Hope your rival will talk you up"], OTHER: { STR: 1} },
    "Rivalry: 4 A Drunken Wager":  { CHA: 2, TRAIT: ["Ambitious Goal, Unearned Confidence"], OTHER: { STR: 1} },
    "Rivalry: 5 Deadly Rivalry":  { CON: 2, TRAIT: ["Special: bad hip"], OTHER: { CON: 1} },
    "Rivalry: 6 Poaching Henchmen":  { CHA: 2, TRAIT: ["Good spirited bidding war (job)"], OTHER: { CHA: 1 } }
}

let ct = [];

function toNotes(i) {
    a.system.background = a.system.background + i.system.description;
    i.delete();
}

// Utility function.  Given the name of an item, determine if
//    it is one of our "Creation" traits by the prefix on the name
function isCreation(name) {
    return name.includes('Childhood:') ||
           name.includes('Adv:') ||
           name.includes('Reward:') ||
           name.includes('Escape:') ||
           name.includes('Bittersweet:') ||
           name.includes('Rivalry:')
}

// make a collection of all the Creation tags we have on this sheet
let ts = actor.collections.items.filter(i => isCreation(i.name));

let updates = {
    STR: 5,
    DEX: 5,
    INT: 5,
    WIS: 5,
    CON: 5,
    CHA: 5,
    XP: 0,
    CLASS: 'Warrior',
    SKILL: [],
    ITEM: [],
    TRAIT: [],
    LEFT: {},
    RIGHT: {},
    OTHER: {},
}

// Now actually do stuff with those traits ...
ts.forEach(i => {
    console.log('-----------------')
    console.log(i.name)
    console.log(traits[i.name])
    let u = traits[i.name];
    for ([key, value] of Object.entries(u)) {
        if (key == 'STR') { updates.STR += value }
        if (key == 'DEX') { updates.DEX += value }
        if (key == 'INT') { updates.INT += value }
        if (key == 'WIS') { updates.WIS += value }
        if (key == 'CON') { updates.CON += value }
        if (key == 'CHA') { updates.CHA += value }
        if (key == 'XP') { updates.XP += value }
        if (key == 'SKILL') { value.forEach( v => {updates.SKILL.push({name: v, bonus: "2"})}) }
        if (key == 'TRAIT') { value.forEach( v => { updates.TRAIT.push(v) }) }
        if (key == 'ITEM') { value.forEach( v => { updates.ITEM.push(v) }) }
        if (key == 'CLASS') { updates.CLASS = value }
        if (key == 'LEFT') { }
        if (key == 'RIGHT') { }
        if (key == 'OTHER') { }
    }
    
})

console.log('Updates -------------')
console.log(updates)

// -------------------------------------------------------
// Calculate final values for character sheet
// -------------------------------------------------------
let abilities = {
    STR: updates.STR,
    DEX: updates.DEX,
    INT: updates.INT,
    WIS: updates.WIS,
    CON: updates.CON,
    CHA: updates.CHA 
}

// Apply to "background" text field, for "posterity"
let desc = ''
ts.forEach(i => desc += i.system.description + '<p />');

let system = {
    class: updates.CLASS,
    abilities: abilities,
    background: desc,
    skills: updates.SKILL,
    exp: { max: '0', value: updates.XP },
    hp: 0,
    bab: 0,
    level: 1
}

let level_next_xp = calculate_level(updates.XP, class_info[updates.CLASS].XP)
system.level = level_next_xp[0]
system.exp.max = level_next_xp[1]
system.bab = class_info[updates.CLASS].Level_Info[system.level].BAB
system.mab = class_info[updates.CLASS].Level_Info[system.level].BAB + bonus_map[system.abilities.STR]
system.rab = class_info[updates.CLASS].Level_Info[system.level].BAB + bonus_map[system.abilities.DEX]
let saves = class_info[updates.CLASS].Level_Info[system.level].SAVES
let hp = system.level * (class_info[updates.CLASS].HD + bonus_map[system.abilities.CON])
hp += '' 
system.hp = { max: hp, value: hp }
system.background += "  LEVEL: " + system.level  

// Level 1:
//   Everyone -- 2 skills
//   Warrior -- weapon spec, 1 knack
//      +1 knack at 3, 6, 9
//   Rogue -- 2 extra skills
//      + 1 skill at 3, 5, 7, 9
//   Mage -- sense magic
if (updates.CLASS === 'Warrior') {
    total_knacks = class_info[updates.CLASS].Level_Info[system.level].TOTAL_KNACKS
    total_skills = 2    
    system.background += "<p />Weapon Specialization + a total of " + total_knacks + " other knacks (may duplicate, bonuses stack)<p />" 
    system.background += "<p />Total Skills: at least " + total_skills 
} else if (updates.CLASS === 'Mage') {
    total_skills = 2    
    system.background += "<p />Total Skills: at least " + total_skills 
} else {
    total_skills = class_info[updates.CLASS].Level_Info[system.level].TOTAL_SKILLS
    system.background += "<p />Total Skills: at least " + total_skills 
}


system.saves = {
    0: {name: '', value: saves[0] },
    1: {name: '', value: saves[1] },
    2: {name: '', value: saves[2] },
    3: {name: '', value: saves[3] },
    4: {name: '', value: saves[4] }
}

// add items
updates.ITEM.forEach(i => {
    let ii = game.items.find(x => x.name === i);
    console.log(ii)

    // test if undefined!
    actor.createEmbeddedDocuments("Item", [
        { name: i, type: ii.type, img: ii.img, data: ii.system }
    ])
})

// add traits
updates.TRAIT.forEach(i => {
    let ii = game.items.find(x => x.name === i);
    console.log(ii)

    // test if undefined!
    actor.createEmbeddedDocuments("Item", [
        { name: i, type: ii.type, img: ii.img, data: ii.system }
    ])
})



// ============= actually apply to character sheet ============
await actor.update({system: system})

// after we apply the final stats, we need to get the stat bonuses for
//   HP, MAB, RAB, ...
// ============================================================

console.log(actor)

