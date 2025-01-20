export default {
  releasedOn: 'released on',
  changeCount: 'Also changed {0} things that are not unlocked yet',
  versionType: {
    major: 'New major version',
    minor: 'New version',
    patch: 'Patch'
  },
  type: {
    bugfix: 'Bugfix',
    balance: 'Balancing',
    qol: 'Quality of life',
    clarity: 'Clarity',
    info: 'Info',
    context: 'Context',
    new: 'New',
    remove: 'Removed',
    change: 'Change',
    accessibility: 'Accessibility',
    appearance: 'Appearance',
    anticheat: 'Anticheat',
  },
  text: {
    addedFeature: 'Added the feature',
    addedSubfeature: 'Added the subfeature',
    addedUpgrade: 'Added {0} new upgrade(s)',
    addedPrestigeUpgrade: 'Added {0} new prestige upgrade(s)',
    addedGemUpgrade: 'Added {0} new gem upgrade(s)',
    addedBuilding: 'Added {0} new building(s)',
    addedRelic: 'Added {0} relic(s)',
    addedAchievement: 'Added {0} achievement(s)',
    secretAchievement: 'Added {0} secret achievement(s)',
    addedHordeItem: 'Added {0} new equipment item(s)',
    addedHordeSigil: 'Added {0} new sigil(s)',
    addedHordeHeirloom: 'Added {0} new heirloom(s)',
    addedVillageRecipe: 'Added {0} new crafting recipe(s)',
    addedGalleryIdea: 'Added {0} new idea(s)',
    addedOre: 'Added {0} new ore(s)',
    addedRareEarth: 'Added {0} new rare earth(s)',
    addedRareDrop: 'Added {0} new rare drop(s)',
    addedGene: 'Added {0} new gene(s)',
    addedCrop: 'Added {0} new crop(s)',
    addedFertilizer: 'Added {0} new fertilizer(s)',
    addedTower: 'Added {0} new tower(s)',
    addedHordeClass: 'Added {0} new fighter class(es)',
    addedTrinket: 'Added {0} new trinket(s)',

    // v1.0.1
    0: 'Slighlty increased the amount of scrap gained at the early mining depths',
    1: 'Shows a hint for new players about not getting scrap when digging down',
    2: 'The building queue now shows progress of the currently constructed building',
    3: 'Buildings now stay in the list until the building is finished when reaching the maximum amount',
    4: 'Using the answer button now keeps the textbox focused',
    5: 'Explained the process of using cards on prestige',
    6: 'Upgrade lists now remember the last page you were on',
    7: 'Shows a hint for new players that reach a high zone without discovering monster parts',
    8: 'Added tooltips explaining depth dweller values',
    9: 'Achievements with a relic reward now state in the tooltip that the relic is given when completing the next achievement level',
    10: 'The school feature was never intended to feel like something you are forced to do for its rewards, but rather as an option to spend spare time for a little boost. I am making a few changes to the reward systems of this feature to make school more optional, especially in the early game where time skipping is much more valuable.',
    11: 'Golden dust gain reduced if your global level is below 250 (linear)',
    12: 'The "Know-it-all" achievement is now secret, which means it does not contribute to gem gain or "Overachiever"',
    13: 'Using the X button in literature no longer causes an error',

    // v1.1.0
    14: 'Last patch I already introduced some band-aid solutions to address the school system. While they did help a little in making the game less about grinding school all the time, they did not fix the underlying issues. This rework is aimed at reducing the amount of time pressure some players felt, and removing the grind aspects while still keeping school as an occasional option to get golden dust. After all, Gooboo is supposed to be a long-term idle game, not an active incremental. This was also a great opportunity to clean up the intransparent system of elo and grades.',
    15: 'Elo system removed',
    16: 'Grades no longer decay over time',
    17: 'You can now switch between all grades you already reached',
    18: 'Studying no longer gives golden dust as reward',
    19: 'Base book gain per subject',
    20: 'Grades no longer increase book gain',
    21: 'You can now buy students for rubies to gather more books for you',
    22: 'Studying time',
    23: 'You now only get grade progress when studying on your best grade, but can also lose progress for bad performance',
    24: 'Practice mode: here you can try the subject without time pressure and leave at any time, but get no rewards',
    25: 'Exam mode: You have 1m 15s to reach the best score you can. At the end, you get golden dust based on your performance and chosen grade',
    26: 'Exam passes, they are needed to take exams. Get more daily or by raising your global level, exceeding the capacity converts it to golden dust',
    27: 'Reduced the amount of grades (removed -- and ++, as well as F- and F+), and adjusted difficulty to be about 2/3 of a full grade lower (if you had a C-- before you can now expect to reach C+)',
    28: 'Math optimal score requirement',
    29: 'Pressing answer in the math minigame with an empty text field no longer counts as a mistake',
    30: 'Literature optimal score requirement',
    31: 'Literature now picks from a list of words instead of random letters, and makes you type sentences instead of words. Numbers, capitalization and special characters still exist for higher grades though!',
    32: '"Still learning" penalty amount',
    33: '"Still learning" penalty removed at global level',
    34: 'Your new grade is based on your old grade and elo, whichever was higher. Exam passes gained from previous global levels are awarded retroactively',
    35: 'Perfect exam results (2x optimal score) end school early and get you to the next grade immediately',
    36: 'Having extra time at the end of the history minigame does not yield bonus points, but now ends the lesson early',
    37: 'Added an extra hint to the cards feature for players who collected cards, but didn\'t prestige yet',
    38: 'Expanded the description for the depth dweller with a section about its speed',
    39: 'When out of exam passes, you can buy one for 35 sapphires',
    40: 'Added exam passes to the reward pool of some small events',
    41: 'Centered settings on the new game screen for smaller - medium display sizes',

    // v1.1.1
    42: 'Bonus exam golden dust reward per grade',
    43: 'Getting a perfect exam now only unlocks the next grade if you did it on your best grade',
    44: 'Exam pass capacity removed',

    // v1.1.2
    45: 'Changed the way savefile exports are handled. This should fix the exporting issues some players had',
    46: 'Added a notification if autosaving fails',
    47: 'The note hint can now be seen on the features icon',
    48: 'Added a notification when crops are ready',
    49: 'Card packs now show the feature they belong to',
    50: 'Quest tasks now show the feature they belong to',
    51: 'Active effects now show their remaining cooldown in the tooltip',
    52: 'Active effects now cool down at a reduced rate when their items are not equipped',
    53: 'Bosses now state their resistance against biological damage in the damage types tooltip',
    54: 'Added equipment loadouts',
    55: 'Reduced soul gain on prestige to 10% - 100% if you spent less than 8 hours on the current run',
    56: 'Changed the depth dweller formula and speed increasing upgrades to be a bit more consistent at all stages',
    57: 'Maximum dweller depth can now be reached',
    58: 'The depth dweller tooltip now shows how much time is needed to reach certain depths',
    59: 'Prestige reward increase interval',
    60: 'Fixed some rounding errors when values were at exactly 0',
    61: 'The literature minigame now ignores the first space character',
    62: 'Literature now awards partial scores for sentences, depending on how many characters you typed correctly',
    63: 'Slightly reduced the word count per sentence for literature',
    64: 'Exams now have a warning in their tooltip if your hourglass is (almost) full',
    65: 'You can now see the time left until you get your daily exam pass',
    66: 'Mining autoprogress is now explained in the settings',
    67: 'Added an option to see relative upgrade values',
    68: 'Total building and housing count can now be seen in the building list. Players with existing savefiles may need to finish a building to see the correct amount',
    69: 'Added the option to convert exam passes to golden dust',
    70: 'Explained premium crafting slots on the gem upgrade',
    71: 'The savefile name now includes the current day',
    72: 'Nostalgia decay per defeated boss',
    73: 'Reduced heirloom chance from most external sources',
    74: 'Minimum enemy defeats required to fight boss',
    75: 'Ritual tome soul chance per level',
    76: 'Base soul chance',
    77: 'Added some cheap early-game levels for a few gem upgrades',
    78: 'Added a button to unequip all items',
    79: 'Changed the wording of some equipment effects to be more accurate',
    80: 'No longer get a guaranteed 35 soul drop on zone 20',
    81: 'Heirloom drops are no longer guaranteed every 10 zones',
    82: 'Nostalgia effect is no longer capped at +50%',
    83: 'Changed the description of the "Deeprun" achievement to prevent confusion between meters and minutes',
    84: 'Soul increase per zone',
    85: 'Base soul amount',
    86: 'Base heirloom chance',
    87: 'Heirloom chance modifier per zone',
    88: 'Turning off note notifications now clears existing hints',
    89: 'Over the last few days, it became clear that quick 15-minute-prestiges were by far the best strategy to get souls in the horde. Runs that took a day could barely get twice the amount of souls, and existing elements to combat this are clearly not working. This is against the idle-focused philosophy of Gooboo, and while active gameplay should always be the most efficient option, it should not render other options of progress meaningless. These changes aim to reduce the gap between players with very fast prestiges and others who prestige one or two times a day.',

    // v1.2.0
    90: 'Fixed a rounding issue with corruption when it is at exactly 0',
    91: 'Fixed a bug where you could use loadouts to equip items you did not find yet',
    92: 'Fixed some treasure bonuses not applying',
    93: 'Made the global level description more clear',
    94: 'Fixed some equipment effects not working while dead',
    95: 'Fixed a bug where upgrading or deleting a treasure sometimes shows an error',
    96: 'Adjusted the prices of some endgame buildings for a more seamless transition with the new content',
    97: 'Fixed a bug in the depth dweller preview showing 0s to reach next depth',
    98: 'Added prestige currency gain to depth dweller preview',
    99: 'Gold coins now show their gain from food conversion',
    100: 'Upgrade descriptions now hide when the first level is bought',
    101: 'Added upgrade descriptions for most upgrades that unlock new game mechanics',
    102: 'Added a gold chance breakdown for crops',
    103: 'History dates now have text shadows for better readability',
    104: 'Reworded some tooltips and added a few new ones to the night hunt event',
    105: 'Slightly changed the UI',
    106: 'Added tooltips for buying treasure and fragments',
    107: 'Farm fertilizers now show their effect when shown as prize',
    108: 'The essence gain multiplier from your global level is now shown in the essence tooltip',

    // v1.3.0
    109: 'General quests now have text shadows for better readability',
    110: 'Equipment can now be upgraded in collapsed view',
    111: 'Inactive sigils are now shown',
    112: 'Reduced the amount of moving UI elements when fighting different enemies',
    113: 'Enemies now take time to respawn',
    114: 'Monster parts are now gained when enemies cannot spawn',
    115: 'Added minibosses with all of the loot the old bosses had',
    116: 'Bosses no longer drop loot, they now increase loot gain from minibosses',
    117: 'Soul chance removed, they now always drop',
    118: 'Achievements now only count damage from basic attacks',
    119: 'Fixed a bug with enemies when their stats reach Infinity',
    120: 'Soul gain on prestige is no longer reduced for the first 8 hours',
    121: 'Empty loadouts can now be set to your currently equipped items',
    122: 'Some sigils give active effects to enemies',
    123: 'Player active effects are split into combat and utility actives',
    124: 'Combat actives replace the next basic attack',
    125: 'Utility actives can store multiple charges',
    126: 'Added the silence status effect, it prevents the use of combat actives',
    127: 'Stun resist is now shown like other stats',
    128: 'Boss stun resist',
    129: 'You now get -2 boss requirement for each boss you beat at zone 20 or higher',
    130: 'Boss requirement now has a maximum value of 50',
    131: 'Respawn time now has a maximum value of 5 minutes',
    132: 'Increased most heirloom effects',
    133: 'Added text shadows to a few horde UI elements for better readability',
    134: 'Sigils now show the zone they start appearing',
    135: 'Added towers',
    136: 'Nostalgia now increases the heirloom chance on your first few tries instead of increasing heirloom chance over time',
    137: 'Slightly changed price tag visuals',
    138: 'Corrupted souls now have a capacity that can be increased by defeating bosses',
    139: 'Changed most upgrades and removed / added a few',
    140: 'Added tower keys to the reward pool of some small events',
    141: 'Slightly changed the wording of premium crafting slots to make them more accurate',
    142: 'Base bones',
    143: 'Bone increase per zone',
    144: 'Clearing a zone no longer increases bone capacity',
    145: 'Bosses no longer drop regular enemy loot',
    146: 'Enemies now get +1 stun resist on each rampage',
    147: 'Rampaging enemies can no longer have their attack reduced',
    148: 'Fixed a bug where the "Knock on wood" achievement would count the sum instead of taking the highest value',
    149: 'Changed some card effects to match the changed horde environment',
    150: 'The cryolab now ticks every second instead of every minute',
    151: 'Crop experience now states it gives less for certain crops',
    152: 'You can now click on discovered potion recipes to set them as your current ritual',
    153: 'Most combat actives have been changed to deal less damage and stun for longer',
    154: 'Achievement notifications now stay until closed if you got a relic',
    155: 'Because of the big differences between the old and new version of the horde, all upgrade levels were reset and some adjustments to other forms of progression were made. Don\'t forget to re-buy your upgrades!',
    156: 'Reduced the effect of the "More bones" gem upgrade at level 3+',

    // v1.3.1
    157: 'Fixed a game crash if you had empty treasure slots',

    // v1.3.2
    158: 'The horde level bonus now affects soul capacity as well',
    159: 'Restored general relics lost in v1.3.0',
    160: 'For those who obtained special relics during events, there is no way to trace them back to your savefile. If you have a backup before v1.3.0, you can load it in this version to restore them',
    161: 'Reduced exp gain for the horde based on souls collected',
    162: 'Equipment upgrades now show when they reach max level',
    163: 'Minibosses now show their loot in the miniboss timer tooltip',
    164: 'Increased the requirement for the final task of "Combat training"',
    165: 'Heirloom chance per nostalgia',
    166: 'Next enemy stats can now be seen while waiting for enemies to spawn',
    167: 'The regular enemy tooltip now states defeating a boss respawns all enemies',
    168: 'Miniboss attack multiplier',
    169: 'Miniboss biological damage taken',
    170: 'Fixed the corrupted soul display showing NaN for some players',
    171: 'Fixed some badges being hard to read on light mode',

    // v1.3.3
    172: 'Added taunt mode to speed up reaching the boss',
    173: 'Minibosses now also count as defeating 4 regular enemies',
    174: 'Fixed a bug where stacking utility actives caused numbers to be hard to read on light mode',
    175: 'Changed the required level of one horde relic because of faster progression with taunt mode',
    176: 'Fixed a bug with bone calculation if you bought the "Milk" prestige upgrade',
    177: 'Enemy actives are now shown on sigils',
    178: 'Resources unaffected by "All resource gain" now state it in the currency tooltip',

    // v1.3.4
    179: 'Updated all dependencies to the newest version. This could introduce some unexpected bugs, but also accelerates the release process in the future',
    180: 'Replaced RNG pre-rolls with random number seeding',
    181: 'The anti-savescum system of pickaxe crafting can no longer be circumvented by using low amounts of ores',
    182: 'Bosses and minibosses now have the same sigils until you defeat them',
    183: 'Savefiles are now encoded and use the .txt ending',
    184: 'Due to optimizations and other changes, savefiles should be ~30% smaller for the average player',
    185: 'You now receive an error message when savefile loads or imports fail',
    186: 'Upcoming upgrade levels can now be viewed',
    187: 'The feature list should now be fully visible on all mobile devices',
    188: 'Fixed an error message that showed up for some players when viewing price tags',
    189: 'Added a new stat to break division shield faster',
    190: 'Added buttons to go down / up by 10 meters',
    191: 'Added buttons to go to forward / backward 10 zones',
    192: 'Changed the note UI on the desktop version - notes are now viewed on hover / click',
    193: 'Added a new type of note that is unrelated to the game story and characters',
    194: 'Relics with stat bonuses now show the feature the stat is from',
    195: 'Offerings now have an indicator with tooltip when they are not unlocked in the current run',
    196: 'The offline summary is now always shown on a new version',
    197: 'Book upgrades now show the linked upgrade',
    198: 'The art minigame now works correctly',
    199: 'Upgrades that have their maximum level increased by books now always use linear scaling after their regular maximum level',
    200: 'Added a keybind to go to the previous feature',
    201: 'You now get 5 times as much nostalgia from all sources',
    202: 'Soul capacity doubled',
    203: 'Raised the prices of most mid-game prestige upgrades',
    204: '"Red card" bonus monster part capacity',
    205: 'Base bone capacity',
    206: 'Moved the "Broken stopwatch" equipment from zone 40 to 31 and greatly increased the chance to find it',
    207: 'Moved the "Cleansing spring" equipment from zone 32 to 40',
    208: 'Bone gain increase per level of the "Monster soup" upgrade',
    209: 'Fixed some book upgrades not unlocking at maximum level',
    210: 'Treasures can now be moved by dragging them',
    211: 'The garden gnome description now states that it needs to be placed on the field to give its bonus',
    212: 'Small events should now be the same for everyone',
    213: 'All event content is now based on a random seed',
    214: 'All equipment actives that remove stuns can now be used while stunned',
    215: 'Base gold chance',
    216: 'Reduced the gold cost of early-game upgrades',
    217: 'Gene growth time reduction',
    218: 'Gene yield increase',
    219: 'Gene gold chance increase',
    220: '"Double" gene rare drop chance increase',
    221: 'The "Nihilist" and "Black hole" achievement now state correctly that they count sacrifices instead of offerings',
    222: 'You can now buy max upgrades in collapsed view',
    223: 'Gene experience increase',
    224: 'Added an experimental setting to show resource gain timers',
    225: 'The pickaxe crafting tooltip now explains ore quality',

    // v1.3.5
    226: 'The game should now be able to save again if your loadout names contained emojis',
    227: 'Fixed backups from the offline summary breaking if migrations occur',

    // v1.3.6
    228: 'Fixed a bug where seeded numbers were not restored on savefile load',
    229: 'Fixed topaz showing time to next capacity when they are full',

    // v1.4.0
    230: 'Genes now pull from a fixed list at certain crop levels instead of a random selection',
    231: 'Genes now have an immediate and an upgradable effect',
    232: 'Introduced DNA, which is gained on crop level ups and can be used to upgrade genes',
    233: 'Increased the grow time of most crops, but also increased most rewards',
    234: 'Crops now have massively reduced grow time and yield before you buy your first garden gnome',
    235: 'Cards now have a prestige effect instead of giving resources',
    236: 'Overgrow now has partial progress',
    237: 'Changed most fertilizer effects to reduce grow time even more',
    238: 'Reduced the fertilizer cost per crop',
    239: 'Farm buildings now show their effect on crops on the field',
    240: 'Due to a change in how growth is handled, all crops on the field got their grow timers reset',
    241: 'Crop stats now show modifications made by fertilizers',
    242: 'The farm now ticks every 5 seconds instead of every minute',
    243: 'Crop prestige is now disabled if that crop is still on the field',
    244: 'Enhancements now require a set amount of bars instead of having a chance to succeed',
    245: 'Crafting a pickaxe now requires a minimum quality of 0.1%',
    246: 'The depth dweller now keeps digging for bonus depth after reaching its limit',
    247: 'Gain timers are now visible for everyone',
    248: 'Added a new experimental setting to show labels on currencies',
    249: 'Gain timers now work properly with currencies that show their gain per hour',
    250: 'Added a new web-based version of the game that can be downloaded and played without internet connection',
    251: 'Farm exp is now given based on difference between current and highest crop level',
    252: 'Base farm exp',
    253: 'Changed rare drop chances on most crops, they should be less common on free crops and more common on crops with a gold cost',
    254: 'Added a gold cost to most free crops',
    255: 'Cards now give a lot less nostalgia',
    256: 'Corruption increase of specific cards',
    257: 'Depth dweller base speed',
    258: 'Base prestige gain',
    259: 'Reduced the power of some late-game enhancements',
    260: 'Increased the amount of time required for bars to smelt',
    261: '"Drill fuel" dweller speed per level (just the multiplier, the linear scaling remains unchanged)',
    262: 'Changed most upgrade effects',
    263: 'Effect power of event treasures',
    264: 'Village material gain base effect',
    265: 'Switched the position of wood and plant fiber',
    266: 'Most non-food resource gain has been reduced to 66% - 80%',
    267: 'Faith capacity',
    268: 'Upgrades that increase resource gain have less effect, especially at later levels',
    269: 'Rare drops with a chance over 100% can now be gained multiple times',
    270: 'Fixed a bug that caused treasures to use the same value for tier and type',
    271: 'Sprinkler grow speed increase',
    272: 'Sprinklers now give +250% overgrow',
    273: 'Faith gain reduced to 50%',
    274: 'Added 2 new system notes to explain game mechanics',
    275: 'Equipment now shows mastery point gain in its tooltips',
    276: 'Colors now show a hint when gains are reduced at higher numbers',

    // v1.4.1
    277: 'Depth dweller minimum speed',
    278: 'This should be an increase in speed for most players, especially in the early game',
    279: 'While the last update did reach the goal of preventing players from reaching the end of content too fast, players in the early tiers were hit by the collateral damage as well. These changes aim to restore the familiar village experience for earlier tiers (1-4), while keeping the current village speed for later content (late tier 5 or higher)',
    280: 'Most resource gains were raised to their old values or the average between old and new values',
    281: 'Upgrades that were reduced from exponential to linear scaling now use a hybrid formula. The final upgrade values should be about 75% of the old ones',
    282: 'Maximum level of upgrades unlocked from the "School" building',
    283: 'The "Basics" upgrade now has an increased effect on plant fiber',
    284: 'You can no longer sacrifice resources before unlocking the associated offering',
    285: 'Offerings now generate over time based on the amount of offerings gained on the current run',
    286: 'Tier 5 building cost increased to 1.5x - 5x',
    287: 'Tier 6 building cost increased to 6x - 20x',
    288: 'Tier 7 building cost increased to 22.5x - 45x',
    289: 'Resource gain increase per power',
    290: 'Fixed a bug that caused building UI elements to appear in the wrong place',
    291: 'Fixed upgrades not being immediately visible after unlocking them',
    292: 'Reduced the grow time of most crops, especially those with a high grow time (new grow times are between 1 hour and 2 days)',
    293: 'Sprinkler overgrow increase',
    294: 'Increased most fertilizer effects',
    295: 'Increased the effect of the HO-0039 and HO-0040 cards',
    296: 'Material overcap gain',
    297: 'Tier 4 offerings now increase their cost with each purchase',
    298: 'Added a text shadow to the achievement message if it contains relics',
    299: 'Increased the requirement for the "Mastermind" achievement after level 10',

    // v1.4.2
    '299_1': 'Fixed a game crash when the weather chaos event ends',
    '299_2': 'Removed equipment capacity from horde cards',
    '299_3': 'Removed equipment capacity from an event relic',
    '299_4': 'Changed most genes to a linear scaling',

    // v1.5.0
    300: 'You can now delete your savefile or reset single features',
    301: 'After reviewing the changes in the last update, it became clear that the new crop gene and card system greatly increased the power level of crops. Specializing crops, while intended, was pushing gains a little too far, so I\'m introducing a few changes to prevent players from focusing too hard on one type of crop gain',
    302: 'Added a gene upgrade to increase all crop gains that is available from the beginning',
    303: 'With 1-second-prestiges taking over the gallery, fundamental changes were necessary. In addition to balance changes, I also added a new mechanic to preserve some of the active aspects of the gallery without making it mandatory to progress',
    304: 'Slightly changed the color display',
    305: 'Converting colors now consumes the previous color once and all converters',
    306: 'Inspiration time stats are now shown in the tooltip',
    307: 'Added the shape minigame, an active way to increase your resource gains',
    308: 'Minibosses now show the correct amount of mastery points gained',
    309: 'Ember gain is now based on dweller depth',
    310: 'Exporting your savefile now properly resets the backup reminder for the exported file',
    311: 'You can now view statistics on the information page',
    312: 'Added the player card to statistics, which gives an overview of your progress',
    313: 'Added screen reader support for currencies and price tags',
    314: 'You can no longer equip the same card multiple times',
    315: 'Equipment mastery now shows the correct percentage for the next level',
    316: 'Changed the prestige formula to give more cash for higher amounts of beauty',
    317: 'The game now refuses to load edited savefiles',
    318: 'Players caught using cheats or automation tools will now have their player card marked with a cheater status',
    319: 'To prevent problematic cards from causing too many issues in the future, I am making a few changes to give them more generic stats. This should also help increase card diversity',
    320: 'Added card power, a new stat that gives generic effects for that feature',
    321: 'Reduced the effect of most cards to give them card power',
    322: 'Raised the price of later card packs',
    323: 'Increased the chance to receive rare cards',
    324: 'Obtainable rare drops are now shown as ???, as long as the chance is -10% or higher',
    325: 'Added a new dropdown menu to select crops',
    326: 'Converter gain is increased based on converters owned',
    327: 'Added canvas',
    328: 'Achievement levels are now downgraded if the requirement increased in a newer version',
    329: 'Most achievements now have a maximum level of 20',
    330: 'Village cryo lab gains',
    331: 'Reduced the tier of event treasures by 1',
    332: 'Base fragments from destroying event treasures',
    333: 'Fertilizer per event token',
    334: 'Renamed fruit to berries',
    335: 'Best harvest now counts crops on the field and does not require you to harvest them',
    336: 'Petal capacity per golden petal',
    337: 'Rare drops from cards are less likely to drop',
    338: 'Some crops now require currencies other than gold',
    339: 'Reduced the base drop chance of most rare drops, but rare drop chance is now easier to get',
    340: 'Reduced most fertilizer effects',
    341: 'The giant gene now increases crop and fertilizer cost by 4x, and cannot be chosen with plants of that crop on the field',
    342: 'You now gain tower keys even when the horde is frozen',
    343: 'Mystical shard chance is now reduced for each shard owned',
    344: 'Attack, health and bone gain per mystical shard',
    345: 'Changed some equipment actives to use the new buff system',
    346: 'Reduced the amount of toxicity and cutting',
    347: 'Speedrun achievements now have a maximum level of 10',
    348: 'The "Giant forge" upgrade is now active in other subfeatures',
    349: 'Scrap gain',
    350: 'Base price of the "Giant crate" upgrade',
    351: 'Scrap capacity per level of "Giant crate"',
    352: 'Added a maximum level to some prestige upgrades',
    353: 'Added smoke gain as treasure effect',
    354: 'Treasures now have an icon based on their effect',
    355: 'Reduced the effect of buildings and upgrades after the pyramid',
    356: 'Changed the primary color of the sky theme to be easier to read',
    357: 'You now get 50 rubies and 800 amethyst when unlocking the gem feature',
    358: 'You now get 100 emeralds when unlocking the card feature',
    359: 'You now get 500 topaz when unlocking the event feature',
    360: 'You now get 300 emeralds when unlocking the treasure feature',
    361: 'Reduce golden dust gain if you get over 2000 per exam',
    362: 'Reset and refunded tier 4 offerings, don\'t forget to buy them again!',
    363: 'Reset and refunded all prestige upgrades, don\'t forget to buy them again!',
    364: 'Reservoir ideas are less powerful, but the downside was removed',
    365: 'Gnome gene effect',
    366: 'The fertile gene effect now only increases yield and is based on sapphire cost of the fertilizer',
    367: 'The conversion gene no longer reduces its own yield and gain multipliers are taken for each yield type instead of the crop type',
    368: 'Conversion gene effect',
    369: 'Bosses now take more magical damage',
    370: 'Enemies with very high corruption levels get a new deadly effect',
    371: 'Corruption is now enabled in towers, based on the zone equivalent of the first floor',
    372: 'Pinwheel effect',
    373: 'Higher tier crops now require more experience',
    374: 'Reset gold and levels of the "Golden tools" upgrade for players with a high amount',
    375: 'Drums now require you to get the drum of the previous color when opening packages',
    376: 'Towers now always give their unique heirloom',
    377: 'Prestige gain now explains where you get it from',
    378: 'Primary effect of existing tower heirlooms',
    379: 'Changed the gold chance formula to favor crops with long grow times more',
    380: 'The farm now remembers your color settings',
    381: 'Added 2 new colors',
    382: 'Heirloom chance gained from the "Advanced luck" upgrade',
    383: 'Rare drop chance per ladybug',
    384: 'Ingredients now appear in larger stacks and consume 10 magic',
    385: 'Added the option to mark an ingredient as favourite',
    386: 'Sacks now appear for high magic amounts',
    387: 'Unequipped all horde equipment, don\'t forget to equip it again!',

    // v1.5.1
    388: 'Fixed item actives with increasing crit efficiency not showing this on upgrade',
    389: 'Fixed currencies showing all in one column in some browsers',
    390: 'Converters needed per color tier',
    391: 'You now get more color per conversion if you have way more converters than color needed',
    392: 'Fixed card power not properly resetting on prestige',
    393: 'Fixed the class courage gain multiplier not properly resetting on prestige',
    394: 'The conversion tooltip now states that all converters will be used',

    // v1.5.2
    395: 'Converter capacity per level of "Trash can"',

    // v1.5.3
    396: 'Fixed a bug with offerings breaking when updating multiple versions at once',
    397: 'Bugged treasures from event rewards are now displayed correctly',
    398: 'Fixed a bug where crafting milestones displayed the wrong rewards',

    // v1.5.4
    399: '"Order massive safe" effect',
    400: '"Order massive safe" now reduces your canvas speed',
    401: 'Reservoir drum capacity',
    402: '"Make it pretty" beauty gain',
    403: 'Switched the effects of the "Sort waste" and "Build composter" ideas and adjusted their power to match the new tiers',
    404: '"Paint faster" canvas speed',
    405: '"Observe rainbow" all color gain',
    406: '"Be mysterious" now correctly applies its effect',
    407: 'Drum capacity per canvas level',
    408: 'Reduced the effect of most shape upgrades',
    409: 'Hourglass effect',
    410: 'Chest now increases collected shapes if its condition is triggered',
    411: 'While the new shapes minigame has fulfilled its goal of offering active gameplay to speed up progression, the effects were a little too strong. This has reached a point where players felt forced to engage with this mechanic to obtain its strong bonuses, so the rewards will be reduced',
    412: 'Reverted the increased experience requirement for higher tier crops',
    413: 'You now gain less global level from crops after level 10',
    414: 'You now gain ingredient boxes even when the village is frozen',
    415: 'Added more fights',
    416: 'Changed the effects of all snowdown upgrades',
    417: 'Revenge mechanic',
    418: 'You can no longer reroll producers',
    419: 'Fight snowball cost',
    420: 'Reroll snowball cost',
    421: 'Boost snowball cost',
    422: 'You no longer get snowballs from winning fights',
    423: 'Items are now given at specific fights instead of using randomness',
    424: 'You can now buy items for topaz',
    425: 'Producers now show their resource gain',
    426: '"Deep hatred" now gives less attack, but also increases health',
    427: 'Fixed a bug where the "First crops" effect was not applied correctly when opening the game',

    // v1.5.5
    428: 'Fixed a bug where the game didn\'t load for some players',

    // v1.5.6
    429: 'Sacrifices no longer reset on prestige',
    430: 'Offerings gained on sacrifice are now multiplied by the amount of sacrifices made',
    431: 'Passive offering gain',
    432: 'The "Nihilist" achievement now counts total offerings gained',
    433: 'The "Black hole" achievement now counts sacrifices made',
    434: 'Fixed multipliers showing their name before being unlocked',
    435: 'Buying upgrades that modify healing no longer change the tooltips of enemy actives',
    436: 'Equipment sacrifice is now correctly stored in the savefile',
    437: 'Fixed tokens not being given to players who already played the event before',
    438: 'Light gain per global level',
    439: 'Enlightenment upgrades (except the first one) now increase your light gain by x1.5',

    // v1.5.7
    440: 'Fixed offerings gained on sacrifice not increasing',

    // v1.5.8
    441: 'Fixed a bug where the game would not load for some players',
    442: 'Fixed one fertilizer not showing up in the list',
  },
  v: {
    1: {
      0: 'An explosive beginning',
      1: 'Principal replaced!',
      2: 'Eco-friendly',
      3: 'Neverending bosses',
      4: 'Slow and steady',
      5: 'Handmade',
    }
  }
}
