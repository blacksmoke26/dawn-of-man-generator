/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

export type HumanEntityType =
  | 'primitive_human'; // Primitive Human

export type AnimalEntityType =
  | 'ancient_bison' // Ancient Bison
  | 'aurochs' // Aurochs
  | 'bear' // Bear
  | 'bison' // Bison
  | 'boar' // Boar
  | 'cattle' // Cattle
  | 'cave_bear' // Cave Bear
  | 'cave_hyena' // Cave Hyena
  | 'cave_lion' // Cave Lion
  | 'deer' // Deer
  | 'dog' // Dog
  | 'donkey' // Donkey
  | 'dove' // Dove
  | 'eagle' // Eagle
  | 'elasmotherium' // Elasmotherium
  | 'feral_horse' // Feral Horse
  | 'goat' // Goat
  | 'horse' // Horse
  | 'ibex' // Ibex
  | 'mammoth' // Mammoth
  | 'megaloceros' // Megaloceros
  | 'mouflon' // Mouflon
  | 'muskox' // Muskox
  | 'pig' // Pig
  | 'reindeer' // Reindeer
  | 'sheep' // Sheep
  | 'vulture' // Vulture
  | 'wild_donkey' // Wild Donkey
  | 'wild_horse' // Wild Horse
  | 'wolf' // Wolf
  | 'woolly_rhinoceros'; // Woolly Rhino

export type StructureEntityType =
  | 'armorer' // Armorer
  | 'banner' // Banner
  | 'blacksmith' // Blacksmith
  | 'bloomery' // Bloomery
  | 'brewery' // Brewery
  | 'bridge' // Bridge
  | 'burial_mound' // Burial Mound
  | 'cairn' // Cairn
  | 'charcoal_pit' // Charcoal Pit
  | 'copper_mine' // Copper Mine
  | 'crafter' // Crafter
  | 'deep_iron_mine' // Deep Iron Mine
  | 'dolmen' // Dolmen
  | 'flint_mine' // Flint Mine
  | 'food_dryer' // Food Dryer
  | 'gate' // Gate
  | 'granary' // Granary
  | 'guard_tower' // Guard Tower
  | 'haystack' // Haystack
  | 'hearth' // Hearth
  | 'hut' // Hut
  | 'iron_mine' // Iron Mine
  | 'menhir' // Menhir
  | 'metalsmith' // Metalsmith
  | 'mortar' // Mortar
  | 'outfitter' // Outfitter
  | 'oven' // Oven
  | 'palisade' // Palisade
  | 'pit_furnace' // Pit Furnace
  | 'reinforced_gate' // Reinforced Gate
  | 'reinforced_platform' // Reinforced Platform
  | 'rock_pile' // Rock Pile
  | 'roundhouse' // Roundhouse
  | 'skins_dryer' // Skins Dryer
  | 'skull_pole' // Skull Pole
  | 'stables' // Stables
  | 'staddle_granary' // Staddle Granary
  | 'statue' // Statue
  | 'stone_circle' // Stone Circle
  | 'stone_stables' // Stone Stables
  | 'storage_hut' // Storage Hut
  | 'storage_tent' // Storage Tent
  | 'tanner' // Tanner
  | 'tent' // Tent
  | 'tin_mine' // Tin Mine
  | 'totem' // Totem
  | 'transport_post' // Transport Post
  | 'wall' // Wall
  | 'warehouse' // Warehouse
  | 'watchtower' // Watchtower
  | 'watermill' // Watermill
  | 'weaver' // Weaver
  | 'well' // Well
  | 'wood_pile' // Wood Pile
  | 'wooden_platform' // Wooden Platform
  | 'workshop'; // Workshop

export type TransportEntityType =
  | 'cart' // Cart
  | 'plow' // Plow
  | 'rolling_megalith' // Rolling Megalith
  | 'sledge'; // Sledge

export type ResourceEntityType =
  | 'beer' // Beer
  | 'berries' // Berries
  | 'biface' // Biface
  | 'bone' // Bone
  | 'bone_harpoon' // Bone Harpoon
  | 'bone_knife' // Bone Knife
  | 'bone_sickle' // Bone Sickle
  | 'bone_spear' // Bone Spear
  | 'bow' // Bow
  | 'bread' // Bread
  | 'bronze' // Bronze
  | 'bronze_axe' // Bronze Axe
  | 'bronze_knife' // Bronze Knife
  | 'bronze_pick' // Bronze Pick
  | 'bronze_sickle' // Bronze Sickle
  | 'bronze_spear' // Bronze Spear
  | 'bronze_sword' // Bronze Sword
  | 'charcoal' // Charcoal
  | 'composite_bow' // Composite Bow
  | 'copper' // Copper
  | 'copper_axe' // Copper Axe
  | 'copper_knife' // Copper Knife
  | 'copper_ore' // Copper Ore
  | 'copper_pick' // Copper Pick
  | 'copper_sickle' // Copper Sickle
  | 'copper_spear' // Copper Spear
  | 'cured_meat' // Cured Meat
  | 'dry_fish' // Dry Fish
  | 'dry_skin' // Dry Skin
  | 'fish_trap' // Fish Trap
  | 'fishing_rod' // Fishing Rod
  | 'flint' // Flint
  | 'flint_axe' // Flint Axe
  | 'flint_knife' // Flint Knife
  | 'flint_pick' // Flint Pick
  | 'flint_sickle' // Flint Sickle
  | 'flint_spear' // Flint Spear
  | 'flour' // Flour
  | 'fruit' // Fruit
  | 'grain' // Grain
  | 'iron' // Iron
  | 'iron_axe' // Iron Axe
  | 'iron_knife' // Iron Knife
  | 'iron_ore' // Iron Ore
  | 'iron_pick' // Iron Pick
  | 'iron_sickle' // Iron Sickle
  | 'iron_spear' // Iron Spear
  | 'iron_sword' // Iron Sword
  | 'leather' // Leather
  | 'leather_armor' // Leather Armor
  | 'leather_outfit' // Leather Outfit
  | 'linen' // Linen
  | 'linen_cloth' // Linen Cloth
  | 'linen_outfit' // Linen Outfit
  | 'log' // Log
  | 'mail_armor' // Mail Armor
  | 'megalith' // Megalith
  | 'milk' // Milk
  | 'mud' // Mud
  | 'nuts' // Nuts
  | 'oval_shield' // Oval Shield
  | 'pulses' // Pulses
  | 'raw_fish' // Raw Fish
  | 'raw_meat' // Raw Meat
  | 'raw_skin' // Raw Skin
  | 'round_shield' // Round Shield
  | 'skins_outfit' // Skins Outfit
  | 'sling' // Sling
  | 'steel' // Steel
  | 'steel_axe' // Steel Axe
  | 'steel_knife' // Steel Knife
  | 'steel_pick' // Steel Pick
  | 'steel_sickle' // Steel Sickle
  | 'steel_spear' // Steel Spear
  | 'steel_sword' // Steel Sword
  | 'sticks' // Sticks
  | 'stone' // Stone
  | 'straw' // Straw
  | 'tannin' // Tannin
  | 'tin_ore' // Tin Ore
  | 'water' // Water
  | 'wooden_harpoon' // Wooden Harpoon
  | 'wooden_spear' // Wooden Spear
  | 'wool' // Wool
  | 'wool_cloth' // Wool Cloth
  | 'wool_outfit'; // Wool Outfit

export type TechEntityType =
  | 'archery' // Archery
  | 'armor' // Armor
  | 'baking' // Baking
  | 'bone_polishing' // Bone Polishing
  | 'bone_tools' // Bone Tools
  | 'brewing' // Brewing
  | 'bronze_smelting' // Bronze Smelting
  | 'cattle_domestication' // Cattle Domestication
  | 'cereal_domestication' // Cereal Domestication
  | 'complex_megalithism' // Complex Megalithism
  | 'composite_archery' // Composite Archery
  | 'composite_tools' // Composite Tools
  | 'copper_smelting' // Copper Smelting
  | 'deep_mining' // Deep Mining
  | 'dog_domestication' // Dog Domestication
  | 'dog_training' // Dog Training
  | 'donkey_domestication' // Donkey Domestication
  | 'flax_domestication' // Flax Domestication
  | 'food_drying' // Food Drying
  | 'fortifications' // Fortifications
  | 'fruit_tree_domestication' // Fruit Tree Domestication
  | 'funerary_rituals' // Funerary Rituals
  | 'goat_domestication' // Goat Domestication
  | 'grain_processing' // Grain Processing
  | 'horse_domestication' // Horse Domestication
  | 'hydropower' // Hydropower
  | 'iron_smelting' // Iron Smelting
  | 'mail' // Mail
  | 'masonry' // Masonry
  | 'megalithism' // Megalithism
  | 'netting' // Netting
  | 'pig_domestication' // Pig Domestication
  | 'plowing' // Plowing
  | 'pottery' // Pottery
  | 'pulse_domestication' // Pulse Domestication
  | 'pulse_processing' // Pulse Processing
  | 'reinforced_fortifications' // Reinforced Fortifications
  | 'reinforced_shields' // Reinforced Shields
  | 'rye_domestication' // Rye Domestication
  | 'sheep_domestication' // Sheep Domestication
  | 'shieldmaking' // Shieldmaking
  | 'sledgemaking' // Sledgemaking
  | 'slingmaking' // Slingmaking
  | 'spirituality' // Spirituality
  | 'staddle_stones' // Staddle Stones
  | 'steelmaking' // Steelmaking
  | 'stilting' // Stilting
  | 'stone_carving' // Stone Carving
  | 'stone_polishing' // Stone Polishing
  | 'swordmaking' // Swordmaking
  | 'tanning' // Tanning
  | 'thatching' // Thatching
  | 'underground_mining' // Underground Mining
  | 'weaving' // Weaving
  | 'well_digging' // Well Digging
  | 'wheel'; // Wheel

export type RecipeEntityType =
  | 'recipe_beer' // Recipe Beer
  | 'recipe_biface' // Recipe Biface
  | 'recipe_bone_harpoon' // Recipe Bone Harpoon
  | 'recipe_bone_knife' // Recipe Bone Knife
  | 'recipe_bone_sickle' // Recipe Bone Sickle
  | 'recipe_bone_spear' // Recipe Bone Spear
  | 'recipe_bow' // Recipe Bow
  | 'recipe_bread' // Recipe Bread
  | 'recipe_bread_bulk' // Recipe Bread Bulk
  | 'recipe_bronze' // Recipe Bronze
  | 'recipe_bronze_axe' // Recipe Bronze Axe
  | 'recipe_bronze_knife' // Recipe Bronze Knife
  | 'recipe_bronze_pick' // Recipe Bronze Pick
  | 'recipe_bronze_sickle' // Recipe Bronze Sickle
  | 'recipe_bronze_spear' // Recipe Bronze Spear
  | 'recipe_bronze_sword' // Recipe Bronze Sword
  | 'recipe_charcoal' // Recipe Charcoal
  | 'recipe_composite_bow' // Recipe Composite Bow
  | 'recipe_copper' // Recipe Copper
  | 'recipe_copper_axe' // Recipe Copper Axe
  | 'recipe_copper_knife' // Recipe Copper Knife
  | 'recipe_copper_pick' // Recipe Copper Pick
  | 'recipe_copper_sickle' // Recipe Copper Sickle
  | 'recipe_copper_spear' // Recipe Copper Spear
  | 'recipe_cured_meat' // Recipe Cured Meat
  | 'recipe_dry_fish' // Recipe Dry Fish
  | 'recipe_dry_skin' // Recipe Dry Skin
  | 'recipe_fish_trap' // Recipe Fish Trap
  | 'recipe_fishing_rod' // Recipe Fishing Rod
  | 'recipe_flint_axe' // Recipe Flint Axe
  | 'recipe_flint_knife' // Recipe Flint Knife
  | 'recipe_flint_pick' // Recipe Flint Pick
  | 'recipe_flint_sickle' // Recipe Flint Sickle
  | 'recipe_flint_spear' // Recipe Flint Spear
  | 'recipe_flour' // Recipe Flour
  | 'recipe_flour_bulk' // Recipe Flour Bulk
  | 'recipe_iron' // Recipe Iron
  | 'recipe_iron_axe' // Recipe Iron Axe
  | 'recipe_iron_knife' // Recipe Iron Knife
  | 'recipe_iron_pick' // Recipe Iron Pick
  | 'recipe_iron_sickle' // Recipe Iron Sickle
  | 'recipe_iron_spear' // Recipe Iron Spear
  | 'recipe_iron_sword' // Recipe Iron Sword
  | 'recipe_leather' // Recipe Leather
  | 'recipe_leather_armor' // Recipe Leather Armor
  | 'recipe_leather_outfit' // Recipe Leather Outfit
  | 'recipe_linen_cloth' // Recipe Linen Cloth
  | 'recipe_linen_outfit' // Recipe Linen Outfit
  | 'recipe_mail_armor' // Recipe Mail Armor
  | 'recipe_oval_shield' // Recipe Oval Shield
  | 'recipe_round_shield' // Recipe Round Shield
  | 'recipe_skins_outfit' // Recipe Skins Outfit
  | 'recipe_sling' // Recipe Sling
  | 'recipe_steel' // Recipe Steel
  | 'recipe_steel_axe' // Recipe Steel Axe
  | 'recipe_steel_knife' // Recipe Steel Knife
  | 'recipe_steel_pick' // Recipe Steel Pick
  | 'recipe_steel_sickle' // Recipe Steel Sickle
  | 'recipe_steel_spear' // Recipe Steel Spear
  | 'recipe_steel_sword' // Recipe Steel Sword
  | 'recipe_wooden_harpoon' // Recipe Wooden Harpoon
  | 'recipe_wooden_spear' // Recipe Wooden Spear
  | 'recipe_wool_cloth' // Recipe Wool Cloth
  | 'recipe_wool_outfit'; // Recipe Wool Outfit

export type EntityType =
  | HumanEntityType
  | AnimalEntityType
  | StructureEntityType
  | TransportEntityType
  | ResourceEntityType
  | TechEntityType
  | RecipeEntityType;
