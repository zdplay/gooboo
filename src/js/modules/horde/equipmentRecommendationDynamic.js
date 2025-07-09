
import store from '../../../store';
import vuetify from '../../../plugins/vuetify';
import sigilData from './sigil';


const EFFECT_TO_FUNCTION = {
  
  'physicTaken': 'excludePhysicAttack',    
  'magicTaken': 'excludeMagicAttack',      
  'bioTaken': 'excludeBioAttack',          
  
  
  'attack': 'needDefense',                 
  'physicAttack': 'needPhysicResist',      
  'magicAttack': 'needMagicResist',        
  'bioAttack': 'needBioResist',            
  'execute': 'needDefense',                
  
  
  'health': 'needHighDamage',              
  'revive': 'needHighDamage',              
  
  
  'defense': 'needHighDamage',          
  'divisionShield': 'needShieldBreaker',   
  
  
  'stunResist': 'enemyStunResist',         
  
  
  
  'damagePhysic': 'needPhysicResist',           
  'damageMagic': 'needMagicResist',            
  'damageBio': 'needBioResist',              
  
  
  'stun': 'needStunResist',                
  'poison': 'needAntidote',                
  
  
  'heal': 'needHighDamage',                
  'antidote': 'needHighDamage',            
  
  
  'gainStat': 'needHighDamage',            
  
  
  'removeStun': 'enemyCanRemoveStun',      
  
  
  'magicConversion': 'needMagicResist',        
  'bioConversion': 'needBioResist',          
};


const NEED_TO_EQUIPMENT_FUNCTION = {
  'needDefense': ['defense', 'health'],
  'needPhysicResist': ['physicResist', 'defense', 'health'], 
  'needMagicResist': ['magicResist', 'defense', 'health'],   
  'needBioResist': ['bioResist', 'defense', 'health'],       
  'needHighDamage': ['cutting', 'toxic', 'physicAttack', 'magicAttack', 'bioAttack', 'criticalDamage', 'firstStrike'],
  'needShieldBreaker': ['shieldBreaker'],
  'needStunResist': ['removeStun', 'stunResist'],
  'needAntidote': ['antidote', 'bioResist'],
  'needUtility': ['utility'],
  'enemyStunResist': ['physicAttack', 'magicAttack', 'bioAttack'], 
  'enemyCanRemoveStun': ['physicAttack', 'magicAttack', 'bioAttack'], 
};


function analyzeSigilEffects(sigilName) {
  const sigil = sigilData[sigilName];
  if (!sigil) return [];
  
  const effects = [];
  
  
  if (sigil.stats) {
    try {
      const stats = typeof sigil.stats === 'function' ? sigil.stats(1) : sigil.stats;
      Object.keys(stats).forEach(statName => {
        if (EFFECT_TO_FUNCTION[statName]) {
          effects.push(EFFECT_TO_FUNCTION[statName]);
        }
      });
    } catch (e) {
      //console.warn(`Error analyzing sigil stats for ${sigilName}:`, e);
    }
  }
  
  
  if (sigil.active && sigil.active.effect) {
    try {
      const activeEffects = typeof sigil.active.effect === 'function' ? sigil.active.effect(1) : sigil.active.effect;
      if (Array.isArray(activeEffects)) {
        activeEffects.forEach(effect => {
          if (effect.type && EFFECT_TO_FUNCTION[effect.type]) {
            effects.push(EFFECT_TO_FUNCTION[effect.type]);
          }
        });
      }
    } catch (e) {
      //console.warn(`Error analyzing sigil active effects for ${sigilName}:`, e);
    }
  }
  
  return [...new Set(effects)]; 
}


function getCurrentZoneSkills() {
  const state = store.state.horde;
  const skills = new Set();

  
  if (state.sigilZones && state.sigilZones[state.zone - 1]) {
    state.sigilZones[state.zone - 1].forEach(skill => {
      skills.add(skill);
    });
  }

  return Array.from(skills);
}


function analyzeEquipmentFunctions(equipmentName) {
  const equipment = store.state.horde.items[equipmentName];
  if (!equipment || !equipment.found) {
    return [];
  }

  const functions = new Set();

  
  if (equipment.stats) {
    try {
      const stats = equipment.stats(equipment.level || 1);
      stats.forEach(stat => {
        
        
        if (stat.name === 'hordeAttack' && stat.isPositive) {
          functions.add('physicAttack');
        }
        
        if (stat.name === 'hordePhysicAttack' && stat.isPositive) {
          functions.add('physicAttack');
        }
        if (stat.name === 'hordeMagicAttack' && stat.isPositive) {
          functions.add('magicAttack');
        }
        if (stat.name === 'hordeBioAttack' && stat.isPositive) {
          functions.add('bioAttack');
        }
        
        if (stat.name === 'hordeCutting' && stat.isPositive) {
          functions.add('cutting');
        }
        if (stat.name === 'hordeToxic' && stat.isPositive) {
          functions.add('toxic');
        }

        
        if (stat.name === 'hordeCritChance' && stat.isPositive) {
          functions.add('criticalDamage');
        }
        if (stat.name === 'hordeCritMult' && stat.isPositive) {
          functions.add('criticalDamage');
        }
        if (stat.name === 'hordeFirstStrike' && stat.isPositive) {
          functions.add('firstStrike');
        }
        
        if (stat.name === 'hordeHealth' && stat.isPositive) {
          functions.add('health');
        }
        if (stat.name === 'hordeDefense' && stat.isPositive) {
          functions.add('defense');
        }
        
        if (stat.name === 'hordeDivisionShield' && stat.isPositive) {
          functions.add('defense');
        }
        
        if (stat.name === 'hordeStunResist' && stat.isPositive) {
          functions.add('stunResist');
        }
        if (stat.name === 'hordeShieldbreak' && stat.isPositive) {
          functions.add('shieldBreaker');
        }
        
        
        
        if (stat.name === 'hordeBioTaken') {
          if ((stat.type === 'mult' && stat.value < 1) || (stat.type === 'base' && stat.value < 0)) {
            functions.add('bioResist');
          }
        }
        if (stat.name === 'hordePhysicTaken') {
          if ((stat.type === 'mult' && stat.value < 1) || (stat.type === 'base' && stat.value < 0)) {
            functions.add('physicResist');
          }
        }
        if (stat.name === 'hordeMagicTaken') {
          if ((stat.type === 'mult' && stat.value < 1) || (stat.type === 'base' && stat.value < 0)) {
            functions.add('magicResist');
          }
        }
        
        if (stat.name.includes('Gain') || stat.name.includes('loot') ||
            stat.name.includes('Chance') || stat.name.includes('Cap') ||
            stat.name.includes('Mastery') || stat.name === 'hordeHeirloomChance' ||
            stat.name === 'hordeItemChance' || stat.name === 'hordeShardChance') {
          functions.add('utility');
        }
      });
    } catch (e) {
      //
    }
  }

  
  if (equipment.active) {
    try {
      const activeEffects = equipment.active(equipment.level || 1);
      activeEffects.forEach(effect => {
        
        if (effect.type === 'antidote') {
          functions.add('antidote');
        }
        
        if (effect.type === 'removeStun') {
          functions.add('removeStun');
        }
        
        if (effect.type === 'heal') {
          functions.add('healing');
        }
        
        if (effect.type === 'damagePhysic') {
          functions.add('physicAttack');
        }
        if (effect.type === 'damageMagic') {
          functions.add('magicAttack');
        }
        if (effect.type === 'damageBio') {
          functions.add('bioAttack');
        }
        
        if (effect.type === 'cutting' || effect.type === 'bleed') {
          functions.add('cutting');
        }
        if (effect.type === 'poison' || effect.type === 'toxic') {
          functions.add('toxic');
        }
        
        if (effect.type === 'removeShield' || effect.type === 'shieldBreaker' ||
            effect.type === 'removeDivisionShield') {
          functions.add('shieldBreaker');
        }

        
        
        
        if (effect.type === 'buff') {
          functions.add('physicAttack');
        }
        
        if (effect.type === 'bone' || effect.type === 'monsterPart' ||
            effect.type === 'permanentStat' || effect.type === 'freezeTime') {
          functions.add('utility');
        }
      });
    } catch (e) {
      //
    }
  }

  return Array.from(functions);
}

function getEquipmentCategoryValue(equipmentName, category) {
  const equipment = store.state.horde.items[equipmentName];
  if (!equipment || !equipment.found) return 0;

  try {
    const stats = equipment.stats(equipment.level || 1);
    let categoryValue = 0;

    
    switch (category) {
      case 'physicAttack': {
        
        let attackBase = 0;
        let attackMult = 1;
        let attackBonus = 0;
        let physicAttackBase = 0;
        let physicAttackMult = 1;
        let physicAttackBonus = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeAttack') {
              if (stat.type === 'base') attackBase += stat.value;
              else if (stat.type === 'mult') attackMult *= stat.value;
              else if (stat.type === 'bonus') attackBonus += stat.value;
            }
            if (stat.name === 'hordePhysicAttack') {
              if (stat.type === 'base') physicAttackBase += stat.value;
              else if (stat.type === 'mult') physicAttackMult *= stat.value;
              else if (stat.type === 'bonus') physicAttackBonus += stat.value;
            }
          }
        });

        
        const finalAttack = attackBase * attackMult + attackBonus;
        const finalPhysicAttack = physicAttackBase * physicAttackMult + physicAttackBonus;
        categoryValue = finalAttack + finalPhysicAttack;
        break;
      }

      case 'magicAttack': {
        
        let attackBase = 0;
        let attackMult = 1;
        let attackBonus = 0;
        let magicAttackBase = 0;
        let magicAttackMult = 1;
        let magicAttackBonus = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeAttack') {
              if (stat.type === 'base') attackBase += stat.value;
              else if (stat.type === 'mult') attackMult *= stat.value;
              else if (stat.type === 'bonus') attackBonus += stat.value;
            }
            if (stat.name === 'hordeMagicAttack') {
              if (stat.type === 'base') magicAttackBase += stat.value;
              else if (stat.type === 'mult') magicAttackMult *= stat.value;
              else if (stat.type === 'bonus') magicAttackBonus += stat.value;
            }
          }
        });

        
        const finalAttack = attackBase * attackMult + attackBonus;
        const finalMagicAttack = magicAttackBase * magicAttackMult + magicAttackBonus;
        categoryValue = finalAttack + finalMagicAttack;
        break;
      }

      case 'bioAttack': {
        
        let attackBase = 0;
        let attackMult = 1;
        let attackBonus = 0;
        let bioAttackBase = 0;
        let bioAttackMult = 1;
        let bioAttackBonus = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeAttack') {
              if (stat.type === 'base') attackBase += stat.value;
              else if (stat.type === 'mult') attackMult *= stat.value;
              else if (stat.type === 'bonus') attackBonus += stat.value;
            }
            if (stat.name === 'hordeBioAttack') {
              if (stat.type === 'base') bioAttackBase += stat.value;
              else if (stat.type === 'mult') bioAttackMult *= stat.value;
              else if (stat.type === 'bonus') bioAttackBonus += stat.value;
            }
          }
        });

        
        const finalAttack = attackBase * attackMult + attackBonus;
        const finalBioAttack = bioAttackBase * bioAttackMult + bioAttackBonus;
        categoryValue = finalAttack + finalBioAttack;
        break;
      }

      case 'criticalAttack': {
        let hordeCritChance = 0;
        let hordeCritMult = 1;
        let hordeFirstStrike = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeCritChance') hordeCritChance += stat.value;
            if (stat.name === 'hordeCritMult') hordeCritMult *= stat.value;
            if (stat.name === 'hordeFirstStrike') hordeFirstStrike += stat.value;
          }
        });

        categoryValue = hordeCritChance * hordeCritMult * 100 + hordeFirstStrike * 50;
        break;
      }

      case 'specialAttack': {
        
        let hordeCutting = 0;
        let hordeToxic = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeCutting') hordeCutting += stat.value;
            if (stat.name === 'hordeToxic') hordeToxic += stat.value;
          }
        });

        categoryValue = hordeCutting * 1000 + hordeToxic * 1000;
        break;
      }

      case 'defense': {
        
        stats.forEach(stat => {
          if (stat.isPositive && stat.name === 'hordeDefense') {
            categoryValue = stat.value * 10000;
          }
        });
        break;
      }

      case 'health': {
        
        stats.forEach(stat => {
          if (stat.isPositive && stat.name === 'hordeHealth') {
            categoryValue = stat.value * 0.01;
          }
        });
        break;
      }

      case 'resist': {
        
        let maxResistValue = 0;

        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name === 'hordeStunResist') {
              maxResistValue = Math.max(maxResistValue, stat.value * 100);
            }
            if (stat.name === 'hordeShieldbreak') {
              maxResistValue = Math.max(maxResistValue, stat.value * 100);
            }
          } else {
            
            if (stat.name === 'hordePhysicTaken' && stat.value < 1) {
              maxResistValue = Math.max(maxResistValue, (1 - stat.value) * 1000);
            }
            if (stat.name === 'hordeMagicTaken' && stat.value < 1) {
              maxResistValue = Math.max(maxResistValue, (1 - stat.value) * 1000);
            }
            if (stat.name === 'hordeBioTaken' && stat.value < 1) {
              maxResistValue = Math.max(maxResistValue, (1 - stat.value) * 1000);
            }
          }
        });

        categoryValue = maxResistValue;
        break;
      }

      case 'utility': {
        
        stats.forEach(stat => {
          if (stat.isPositive) {
            if (stat.name.includes('Gain') || stat.name.includes('Chance') ||
                stat.name.includes('Cap') || stat.name.includes('Mastery') ||
                stat.name === 'hordeHeirloomChance' || stat.name === 'hordeItemChance' ||
                stat.name === 'hordeShardChance') {
              categoryValue = Math.max(categoryValue, stat.value * 10);
            }
          }
        });
        break;
      }

      default:
        categoryValue = 0;
    }

    return categoryValue;
  } catch (e) {
    return 0;
  }
}


function getEquipmentCategories(equipmentName, neededFunctions) {
  const equipment = store.state.horde.items[equipmentName];
  if (!equipment || !equipment.found) return [];

  const categories = [];
  const equipmentFunctions = analyzeEquipmentFunctions(equipmentName);

  
  try {
    const stats = equipment.stats(equipment.level || 1);
    let hasHordeAttack = false;
    let hasPhysicAttack = false;
    let hasMagicAttack = false;
    let hasBioAttack = false;

    
    stats.forEach(stat => {
      if (stat.isPositive) {
        if (stat.name === 'hordeAttack') hasHordeAttack = true;
        if (stat.name === 'hordePhysicAttack') hasPhysicAttack = true;
        if (stat.name === 'hordeMagicAttack') hasMagicAttack = true;
        if (stat.name === 'hordeBioAttack') hasBioAttack = true;
      }
    });

    
    if (equipment.active) {
      try {
        const activeEffects = equipment.active(equipment.level || 1);
        activeEffects.forEach(effect => {
          if (effect.type === 'damagePhysic') hasPhysicAttack = true;
          if (effect.type === 'damageMagic') hasMagicAttack = true;
          if (effect.type === 'damageBio') hasBioAttack = true;
          if (effect.type === 'cutting' || effect.type === 'bleed') hasBioAttack = true;
          if (effect.type === 'poison' || effect.type === 'toxic') hasBioAttack = true;
        });
      } catch (e) {
        //
      }
    }

    

    
    if (hasMagicAttack && neededFunctions.has('magicAttack')) {
      
      categories.push('magicAttack');
    } else if (hasBioAttack && neededFunctions.has('bioAttack')) {
      
      categories.push('bioAttack');
    } else if ((hasHordeAttack || hasPhysicAttack) && neededFunctions.has('physicAttack')) {
      
      categories.push('physicAttack');
    }
  } catch (e) {
    
    if (equipmentFunctions.includes('physicAttack') && neededFunctions.has('physicAttack')) {
      categories.push('physicAttack');
    }
    if (equipmentFunctions.includes('magicAttack') && neededFunctions.has('magicAttack')) {
      categories.push('magicAttack');
    }
    if (equipmentFunctions.includes('bioAttack') && neededFunctions.has('bioAttack')) {
      categories.push('bioAttack');
    }
  }

  if (equipmentFunctions.some(func => ['criticalDamage', 'firstStrike'].includes(func)) &&
      (['criticalDamage', 'firstStrike'].some(func => neededFunctions.has(func)))) {
    categories.push('criticalAttack');
  }

  if (equipmentFunctions.some(func => ['cutting', 'toxic'].includes(func)) &&
      (['cutting', 'toxic'].some(func => neededFunctions.has(func)))) {
    categories.push('specialAttack');
  }

  if (equipmentFunctions.includes('defense') && neededFunctions.has('defense')) {
    categories.push('defense');
  }

  if (equipmentFunctions.includes('health') && neededFunctions.has('health')) {
    categories.push('health');
  }

  if (equipmentFunctions.some(func => ['physicResist', 'magicResist', 'bioResist', 'stunResist', 'shieldBreaker'].includes(func)) &&
      (['physicResist', 'magicResist', 'bioResist', 'stunResist', 'shieldBreaker'].some(func => neededFunctions.has(func)))) {
    categories.push('resist');
  }

  if (equipmentFunctions.includes('utility') && neededFunctions.has('utility')) {
    categories.push('utility');
  }

  return categories;
}


function getEquipmentRecommendations() {
  const skills = getCurrentZoneSkills();
  const recommendedEquipments = new Set();

  
  const neededFunctions = new Set();
  const excludedAttacks = new Set(); 

  
  neededFunctions.add('physicAttack');
  neededFunctions.add('magicAttack');
  neededFunctions.add('bioAttack');

  skills.forEach(skill => {
    const effects = analyzeSigilEffects(skill);

    effects.forEach(effect => {
      
      if (effect === 'excludePhysicAttack') {
        excludedAttacks.add('physicAttack');
      } else if (effect === 'excludeMagicAttack') {
        excludedAttacks.add('magicAttack');
      } else if (effect === 'excludeBioAttack') {
        excludedAttacks.add('bioAttack');
      } else if (NEED_TO_EQUIPMENT_FUNCTION[effect]) {
        
        NEED_TO_EQUIPMENT_FUNCTION[effect].forEach(func => {
          neededFunctions.add(func);
        });
      }
    });
  });

  
  excludedAttacks.forEach(attackType => {
    neededFunctions.delete(attackType);
  });

  
  const hasAnyAttack = ['physicAttack', 'magicAttack', 'bioAttack'].some(attack => neededFunctions.has(attack));
  if (!hasAnyAttack) {
    
    if (!excludedAttacks.has('bioAttack')) {
      neededFunctions.add('bioAttack');
    } else if (!excludedAttacks.has('magicAttack')) {
      neededFunctions.add('magicAttack');
    } else if (!excludedAttacks.has('physicAttack')) {
      neededFunctions.add('physicAttack');
    } else {
      
      neededFunctions.add('cutting');
      neededFunctions.add('toxic');
    }
  }

  
  if (neededFunctions.size === 0) {
    neededFunctions.add('utility');
    neededFunctions.add('physicAttack');
    neededFunctions.add('magicAttack');
    neededFunctions.add('bioAttack');
  }

  
  const allEquipments = Object.keys(store.state.horde.items);
  allEquipments.forEach(equipmentName => {
    const equipment = store.state.horde.items[equipmentName];
    if (!equipment.found) return;

    const equipmentFunctions = analyzeEquipmentFunctions(equipmentName);

    
    const hasNeededFunction = equipmentFunctions.some(func => neededFunctions.has(func));
    if (hasNeededFunction) {
      recommendedEquipments.add(equipmentName);
    }
  });

  
  const validRecommendations = Array.from(recommendedEquipments);

  
  const categoryOrder = ['physicAttack', 'magicAttack', 'bioAttack', 'criticalAttack', 'defense', 'health', 'resist', 'utility'];
  const categoryResults = [];

  
  categoryOrder.forEach(category => {
    
    const categoryEquipments = validRecommendations.filter(equipmentName => {
      const categories = getEquipmentCategories(equipmentName, neededFunctions);
      return categories.includes(category);
    });

    
    categoryEquipments.sort((a, b) => {
      const valueA = getEquipmentCategoryValue(a, category);
      const valueB = getEquipmentCategoryValue(b, category);

      

      
      if (valueB !== valueA) {
        return valueB - valueA;
      }

      
      const masteryA = store.state.horde.items[a].masteryLevel || 0;
      const masteryB = store.state.horde.items[b].masteryLevel || 0;
      return masteryB - masteryA;
    });

    
    const top5 = categoryEquipments.slice(0, 5);
    categoryResults.push(...top5);
  });

  
  const finalResults = [];
  const addedEquipments = new Set();

  categoryResults.forEach(equipmentName => {
    if (!addedEquipments.has(equipmentName)) {
      finalResults.push(equipmentName);
      addedEquipments.add(equipmentName);
    }
  });

  return finalResults;
}


function getSkillDisplayName(skill) {
  try { 
    return vuetify.framework.lang.t(`$vuetify.horde.sigil.${skill}`);
  } catch (e) {
    return skill;
  }
}



const FUNCTION_DISPLAY_NAMES = {
  'physicAttack': '物理',
  'magicAttack': '魔法',
  'bioAttack': '生物',
  'cutting': '切割',
  'toxic': '毒素',
  'criticalDamage': '爆伤',
  'firstStrike': '先发',
  'defense': '防御',
  'health': '血量',
  'healing': '治疗',
  'antidote': '解毒',
  'removeStun': '解晕',
  'stunResist': '抗晕',
  'bioResist': '抗生物',
  'physicResist': '抗物理',
  'magicResist': '抗魔法',
  'shieldBreaker': '破盾',
  'utility': '辅助'
};

function getFunctionDisplayName(func) {
  return FUNCTION_DISPLAY_NAMES[func] || func;
}


function getRecommendationSummary() {
  const skills = getCurrentZoneSkills();
  const zone = store.state.horde.zone;

  if (skills.length === 0) {
    return `第${zone}层无特殊技能，推荐通用装备`;
  }

  const skillNames = skills.map(skill => getSkillDisplayName(skill)).join('、');

  
  const neededFunctions = new Set();
  const excludedAttacks = new Set();

  
  neededFunctions.add('physicAttack');
  neededFunctions.add('magicAttack');
  neededFunctions.add('bioAttack');

  skills.forEach(skill => {
    const effects = analyzeSigilEffects(skill);

    effects.forEach(effect => {
      if (effect === 'excludePhysicAttack') {
        excludedAttacks.add('physicAttack');
      } else if (effect === 'excludeMagicAttack') {
        excludedAttacks.add('magicAttack');
      } else if (effect === 'excludeBioAttack') {
        excludedAttacks.add('bioAttack');
      } else if (NEED_TO_EQUIPMENT_FUNCTION[effect]) {
        NEED_TO_EQUIPMENT_FUNCTION[effect].forEach(func => {
          neededFunctions.add(func);
        });
      }
    });
  });

  
  excludedAttacks.forEach(attackType => {
    neededFunctions.delete(attackType);
  });

  
  const hasAnyAttack = ['physicAttack', 'magicAttack', 'bioAttack'].some(attack => neededFunctions.has(attack));
  if (!hasAnyAttack) {
    if (!excludedAttacks.has('bioAttack')) {
      neededFunctions.add('bioAttack');
    } else if (!excludedAttacks.has('magicAttack')) {
      neededFunctions.add('magicAttack');
    } else if (!excludedAttacks.has('physicAttack')) {
      neededFunctions.add('physicAttack');
    } else {
      neededFunctions.add('cutting');
      neededFunctions.add('toxic');
    }
  }

  const functionNames = Array.from(neededFunctions)
    .map(func => getFunctionDisplayName(func))
    .join('、');

  return `第${zone}层技能：${skillNames}\n推荐：${functionNames}`;
}


function getEquipmentCategoryFilter() {
  
  const categoryDisplayNames = FUNCTION_DISPLAY_NAMES;

  
  const allEquipments = Object.keys(store.state.horde.items).filter(name =>
    store.state.horde.items[name].found
  );

  
  const categoryEquipments = {};

  
  Object.keys(categoryDisplayNames).forEach(category => {
    categoryEquipments[category] = [];
  });

  
  allEquipments.forEach(equipmentName => {
    const equipmentFunctions = analyzeEquipmentFunctions(equipmentName);

    equipmentFunctions.forEach(func => {
      if (categoryEquipments[func]) {
        categoryEquipments[func].push(equipmentName);
      }
    });
  });

  
  return {
    categoryDisplayNames,
    categoryEquipments
  };
}


function getEquipmentsByCategory(category) {
  const { categoryEquipments } = getEquipmentCategoryFilter();
  return categoryEquipments[category] || [];
}


function getRecommendedEquipments() {
  return getEquipmentRecommendations();
}

function isEquipmentRecommended(equipmentName) {
  const recommended = getRecommendedEquipments();
  return recommended.includes(equipmentName);
}


export {
  getRecommendedEquipments,
  isEquipmentRecommended,
  getRecommendationSummary,
  getEquipmentCategoryFilter,
  getEquipmentsByCategory
};
