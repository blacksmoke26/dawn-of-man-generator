/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-13
 * @version 2.6.0
 */

// types
import {Options} from '~/components/ui/Select';

/* eslint import/no-webpack-loader-syntax: off */
// scenarios
import bloodlineBloodline from '!!raw-loader!./bloodline/bloodline.scn.xml';
import bloodlineBloodlineEasy from '!!raw-loader!./bloodline/bloodline-easy.scn.xml';
import bloodlineBloodlineMigration from '!!raw-loader!./bloodline/bloodline-migration.scn.xml';
import bloodlineBloodlineTribe from '!!raw-loader!./bloodline/bloodline-tribe.scn.xml';
import dawnOfWomenDawnOfWomen from '!!raw-loader!./dawn-of-women/dawn-of-women.scn.xml';
import dowIiMoreBloodshedDowMoreBloodshed from '!!raw-loader!./dowII-more-bloodshed/dow-more-bloodshed.scn.xml';
import everwinterEverwinterFlatlands from '!!raw-loader!./everwinter/everwinter-flatlands.scn.xml';
import everwinterMediumEverwinter from '!!raw-loader!./everwinter/medium-everwinter.scn.xml';
import flatlandsFlatlands from '!!raw-loader!./flatlands/flatlands.scn.xml';
import flatlandsFlatlandsEasy from '!!raw-loader!./flatlands/flatlands-easy.scn.xml';
import flatlandsFlatlandsEasyV2 from '!!raw-loader!./flatlands/flatlands-easy-v2.scn.xml';
import flatlandsFlatlandsV2 from '!!raw-loader!./flatlands/flatlands-v2.scn.xml';
import flatlandsMediumMediumEasy from '!!raw-loader!./flatlands-medium/medium-easy.scn.xml';
import flatlandsMediumMediumUnlimited from '!!raw-loader!./flatlands-medium/medium-unlimited.scn.xml';
import flatlandsMediumMediumVillage from '!!raw-loader!./flatlands-medium/medium-village.scn.xml';
import flatlandsMediumSmallClaustrophobic from '!!raw-loader!./flatlands-medium/small-claustrophobic.scn.xml';
import flatlandsMediumSmallEasy from '!!raw-loader!./flatlands-medium/small-easy.scn.xml';
import flatlandsMediumSmallVillage from '!!raw-loader!./flatlands-medium/small-village.scn.xml';
import happyFarmerMediumHappyFarmer from '!!raw-loader!./happy-farmer/medium-happyfarmer.scn.xml';
import happyFarmerVeryHappyFarmer from '!!raw-loader!./happy-farmer/very-happy-farmer.scn.xml';
import highlanderHighlander from '!!raw-loader!./highlander/highlander.scn.xml';
import highlanderMediumHighlander from '!!raw-loader!./highlander/medium-highlander.scn.xml';
import nemesisInTheStoneAgeNemesis from '!!raw-loader!./nemesisin-the-stone-age/nemesis1.scn.xml';
import smallVillageMediumEasy from '!!raw-loader!./small-village/medium-easy.scn.xml';
import smallVillageMediumUnlimited from '!!raw-loader!./small-village/medium-unlimited.scn.xml';
import smallVillageMediumVillage from '!!raw-loader!./small-village/medium-village.scn.xml';
import smallVillageSmallClaustrophobic from '!!raw-loader!./small-village/small-claustrophobic.scn.xml';
import smallVillageSmallEasy from '!!raw-loader!./small-village/small-easy.scn.xml';
import smallVillageSmallVillage from '!!raw-loader!./small-village/small-village.scn.xml';
import veryAncientWarriorsAncientWarriors from '!!raw-loader!./very-ancient-warriors/ancient-warriors.scn.xml';

export const presets = {
  //<editor-fold desc="Bloodline (SchwiftyK)">
  'schwiftyk/bloodline/bloodline': bloodlineBloodline,
  'schwiftyk/bloodline/bloodline_easy': bloodlineBloodlineEasy,
  'schwiftyk/bloodline/bloodline_migration': bloodlineBloodlineMigration,
  'schwiftyk/bloodline/bloodline_tribe': bloodlineBloodlineTribe,
  //</editor-fold>

  //<editor-fold desc="Dawn of women (SchwiftyK)">
  'schwiftyk/dawn_of_women/dawn_of_women': dawnOfWomenDawnOfWomen,
  'schwiftyk/dow_ii_more_bloodshed/dow_more_bloodshed': dowIiMoreBloodshedDowMoreBloodshed,
  //</editor-fold>

  //<editor-fold desc="Everwinter (SchwiftyK)">
  'schwiftyk/everwinter/everwinter_flatlands': everwinterEverwinterFlatlands,
  'schwiftyk/everwinter/medium_everwinter': everwinterMediumEverwinter,
  //</editor-fold>

  //<editor-fold desc="Flatlands (SchwiftyK)">
  'schwiftyk/flatlands/flatlands': flatlandsFlatlands,
  'schwiftyk/flatlands/flatlands_easy': flatlandsFlatlandsEasy,
  'schwiftyk/flatlands/flatlands_easy_v_2': flatlandsFlatlandsEasyV2,
  'schwiftyk/flatlands/flatlands_v_2': flatlandsFlatlandsV2,
  //</editor-fold>

  //<editor-fold desc="Flatlands Medium (SchwiftyK)">
  'schwiftyk/flatlands_medium/medium_easy': flatlandsMediumMediumEasy,
  'schwiftyk/flatlands_medium/medium_unlimited': flatlandsMediumMediumUnlimited,
  'schwiftyk/flatlands_medium/medium_village': flatlandsMediumMediumVillage,
  'schwiftyk/flatlands_medium/small_claustrophobic': flatlandsMediumSmallClaustrophobic,
  'schwiftyk/flatlands_medium/small_easy': flatlandsMediumSmallEasy,
  'schwiftyk/flatlands_medium/small_village': flatlandsMediumSmallVillage,
  //</editor-fold>

  //<editor-fold desc="Happy farmer (SchwiftyK)">
  'schwiftyk/happy_farmer/medium_happyfarmer': happyFarmerMediumHappyFarmer,
  'schwiftyk/happy_farmer/very_happy_farmer': happyFarmerVeryHappyFarmer,
  //</editor-fold>

  //<editor-fold desc="Highlander (SchwiftyK)">
  'schwiftyk/highlander/highlander': highlanderHighlander,
  'schwiftyk/highlander/medium_highlander': highlanderMediumHighlander,
  //</editor-fold>

  //<editor-fold desc="Nemesis in the stone age (SchwiftyK)">
  'schwiftyk/nemesis_in_the_stone_age/nemesis': nemesisInTheStoneAgeNemesis,
  //</editor-fold>

  //<editor-fold desc="Small village (SchwiftyK)">
  'schwiftyk/small_village/medium_easy': smallVillageMediumEasy,
  'schwiftyk/small_village/medium_unlimited': smallVillageMediumUnlimited,
  'schwiftyk/small_village/medium_village': smallVillageMediumVillage,
  'schwiftyk/small_village/small_claustrophobic': smallVillageSmallClaustrophobic,
  'schwiftyk/small_village/small_easy': smallVillageSmallEasy,
  'schwiftyk/small_village/small_village': smallVillageSmallVillage,
  //</editor-fold>

  //<editor-fold desc="Very ancient warriors (SchwiftyK)">
  'schwiftyk/very_ancient_warriors/ancient_warriors': veryAncientWarriorsAncientWarriors,
  //</editor-fold>
};

export const presetOptions: Options = [
  {
    label: 'Bloodline (SchwiftyK)',
    options: [
      {label: 'Bloodline original', value: 'schwiftyk/bloodline/bloodline', type: 'scenario'},
      {label: 'Bloodline easy', value: 'schwiftyk/bloodline/bloodline_easy', type: 'scenario'},
      {label: 'Bloodline migration', value: 'schwiftyk/bloodline/bloodline_migration', type: 'scenario'},
      {label: 'Bloodline tribe', value: 'schwiftyk/bloodline/bloodline_tribe', type: 'scenario'},
    ],
  },
  {
    label: 'Dawn of women (SchwiftyK)',
    options: [
      {label: 'Dawn of women', value: 'schwiftyk/dawn_of_women/dawn_of_women', type: 'scenario'},
      {
        label: 'Dawn of women (bloodshed)',
        value: 'schwiftyk/dow_ii_more_bloodshed/dow_more_bloodshed',
        type: 'scenario',
      },
    ],
  },
  {
    label: 'Everwinter (SchwiftyK)',
    options: [
      {label: 'Winterland flat', value: 'schwiftyk/everwinter/everwinter_flatlands', type: 'scenario'},
      {label: 'Winterland medium', value: 'schwiftyk/everwinter/medium_everwinter', type: 'scenario'},
    ],
  },
  {
    label: 'Flatlands (SchwiftyK)',
    options: [
      {label: 'Flatlands', value: 'schwiftyk/flatlands/flatlands', type: 'scenario'},
      {label: 'Flatlands v2', value: 'schwiftyk/flatlands/flatlands_v_2', type: 'scenario'},
      {label: 'Flatlands easy', value: 'schwiftyk/flatlands/flatlands_easy', type: 'scenario'},
      {label: 'Flatlands easy v2', value: 'schwiftyk/flatlands/flatlands_easy_v_2', type: 'scenario'},
    ],
  },
  {
    label: 'Flatlands Medium (SchwiftyK)',
    options: [
      {label: 'Small easy', value: 'schwiftyk/flatlands_medium/small_easy', type: 'scenario'},
      {label: 'Small village', value: 'schwiftyk/flatlands_medium/small_village', type: 'scenario'},
      {label: 'Small claustrophobic', value: 'schwiftyk/flatlands_medium/small_claustrophobic', type: 'scenario'},
      {label: 'Medium easy', value: 'schwiftyk/flatlands_medium/medium_easy', type: 'scenario'},
      {label: 'Medium village', value: 'schwiftyk/flatlands_medium/medium_village', type: 'scenario'},
      {label: 'Medium unlimited', value: 'schwiftyk/flatlands_medium/medium_unlimited', type: 'scenario'},
    ],
  },
  {
    label: 'Happy farmer (SchwiftyK)',
    options: [
      {label: 'Happy farmer easy', value: 'schwiftyk/happy_farmer/very_happy_farmer', type: 'scenario'},
      {label: 'Happy farmer medium', value: 'schwiftyk/happy_farmer/medium_happyfarmer', type: 'scenario'},
    ],
  },
  {
    label: 'Highlander (SchwiftyK)',
    options: [
      {label: 'Highlander normal', value: 'schwiftyk/highlander/highlander', type: 'scenario'},
      {label: 'Highlander medium', value: 'schwiftyk/highlander/medium_highlander', type: 'scenario'},
    ],
  },
  {
    label: 'Nemesis in the stone age (SchwiftyK)',
    options: [
      {label: 'Nemesis glacial', value: 'schwiftyk/nemesis_in_the_stone_age/nemesis', type: 'scenario'},
    ],
  },
  {
    label: 'Small village (SchwiftyK)',
    options: [
      {label: 'Small easy', value: 'schwiftyk/small_village/small_easy', type: 'scenario'},
      {label: 'Small village', value: 'schwiftyk/small_village/small_village', type: 'scenario'},
      {label: 'Small claustrophobic', value: 'schwiftyk/small_village/small_claustrophobic', type: 'scenario'},
      {label: 'Medium easy', value: 'schwiftyk/small_village/medium_easy', type: 'scenario'},
      {label: 'Medium village', value: 'schwiftyk/small_village/medium_village', type: 'scenario'},
      {label: 'Medium unlimited', value: 'schwiftyk/small_village/medium_unlimited', type: 'scenario'},
    ],
  },
  {
    label: 'Ancient warriors (SchwiftyK)',
    options: [
      {label: 'Very ancient warriors', value: 'schwiftyk/very_ancient_warriors/ancient_warriors', type: 'scenario'},
    ],
  }];
