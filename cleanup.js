// Invoke via chat as:
//   /macro cleanup id=<character sheet id>

// get the actor (actually, character sheet) we want to work with
let actor = game.actors.find(a => a.id === scope.id);
console.log(actor)
// actor.system
//             .abilities.CHA
//             .ac
//             .bab
//   
console.log(actor.system.abilities.CHA)

// Our dictionary of stuff that each trait adds to the character
let traits = {
    "Adv: 1 Home Destroyed By Violence": { CLASS: "Warrior", XP: 6000, STR: 6, CON: 6, TRAIT: "Knack: Defensive Fighter (+1 AC)", LEFT: { CON: 4} },
    "Adv: 2 Conscripted in the Lord's Army":  {},
    "Adv: 3 Carried Iron to the Dead King's Tomb":  {},
    "Adv: 4 Tested at School":  {},
    "Adv: 5 An Almost Perfect Crime":  {},
    "Adv: 6 University of the Unknowable":  {},
    "Adv: 7 Pastoral Tutelage":  {},
    "Adv: 8 The Angered Fae":  {},
    "Bittersweet: 1 A Bitter Curse":  {},
    "Bittersweet: 2 Magic Treasure":  {},
    "Bittersweet: 3 Secret Knowledge":  {},
    "Bittersweet: 4 Wealth and Banishment":  {},
    "Bittersweet: 5 Loss of Titles":  {},
    "Bittersweet: 6 True Love":  {},
    "Bittersweet: 7 A Sword with a Soul":  {},
    "Bittersweet: 8 A Hard Lesson":  {},
    "Childhood: 1 In the Fields":  { CON: 4, CHA: 4, SKILL: "Farming OR Animal Handling" },
    "Childhood: 2 On the Streets":  { DEX: 4, INT: 4, SKILL: "Haggling OR Alertness" },
    "Childhood: 3 At Court":  { INT: 4, CHA: 4, SKILL: "Heraldry OR Etiquette" },
    "Childhood: 4 Alone":  { CON: 4, CHA: 4, SKILL: "Stealth OR Begging" },
    "Childhood: 5 In the Workshop":  { INT: 4, WIS: 4, SKILL: "Any TRADE or CRAFT skill"},
    "Childhood: 6 In the Wild":  { STR: 4, CON:4, SKILL: "Survival OR Hunting" },
    "Childhood: 7 Training For Battle":  { STR: 4, CHA: 4, SKILL: "Command OR Tactics" },
    "Childhood: 8 On the Road":  { WIS: 4, CHA: 4, SKILL: "Survival OR Performance" },
    "Escape: 1 Touched by Chaos":  {},
    "Escape: 2 Dark Dungeons Beneath the Earth":  {},
    "Escape: 3 Court Intrigue":  {},
    "Escape: 4 Heist Gone Bad":  {},
    "Escape: 5 Captured and Imprisoned":  {},
    "Escape: 6 Meddled Too Far in the Affairs of Wizards":  {},
    "Reward: 1 Renown in Battle":  {},
    "Reward: 2 Fast Friends":  {},
    "Reward: 3 The King's Oath":  {},
    "Reward: 4 Lingering Scars and Ill Renown":  {},
    "Reward: 5 The Trust of a Stalwart Band":  {},
    "Reward: 6 Forbidden Knowledge":  {},
    "Rivalry: 1 On a Rooftop 20 Years Ago":  {},
    "Rivalry: 2 Taking Credit for Killing That Necromancer":  {},
    "Rivalry: 3 They're Your Nephew's Favorite Adventurer":  {},
    "Rivalry: 4 A Drunken Wager":  {},
    "Rivalry: 5 Deadly Rivalry":  {},
    "Rivalry: 6 Poaching Henchmen":  {}
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
    CLASS: 'UNDECLARED',
    SKILL: [],
    TRAIT: []
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
        if (key == 'SKILL') { updates.SKILL.push(value) }
        if (key == 'TRAIT') { updates.TRAIT.push(value) }
    }
    
})

console.log(updates)

let desc = ''
ts.forEach(i => desc += i.system.description + '<p />');

console.log(desc)
// Now we actually update the character sheet as appropriate
//await actor.update({system: {background: desc}})
console.log('done')
