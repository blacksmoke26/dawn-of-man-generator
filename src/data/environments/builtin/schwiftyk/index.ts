/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-13
 * @version 2.6.0
 */

/* eslint import/no-webpack-loader-syntax: off */
import bloodlineSchwiftyAfricaMoreOaks from '!!raw-loader!./bloodline/schwifty-africa-more-oaks.xml';
import bloodlineSchwiftyAfricaMoreSticks from '!!raw-loader!./bloodline/schwifty-africa-more-sticks.xml';
import bloodlineSchwiftyAfrica from '!!raw-loader!./bloodline/schwifty-africa.xml';

import everwinterFlatWinterland from '!!raw-loader!./everwinter/flat-winterland.xml';
import everwinterMediumWinterland from '!!raw-loader!./everwinter/medium-winterland.xml';

import flatlandsFlatRiverEasy from '!!raw-loader!./flatlands/flat-river-easy.xml';
import flatlandsFlatRiver from '!!raw-loader!./flatlands/flat-river.xml';
import flatlandsLargerHillsV2 from '!!raw-loader!./flatlands/larger-hills-v2.xml';
import flatlandsLargerHills from '!!raw-loader!./flatlands/larger-hills.xml';
import flatlandsRockyRiverV2 from '!!raw-loader!./flatlands/rocky-river-v2.xml';
import flatlandsRockyRiver from '!!raw-loader!./flatlands/rocky-river.xml';
import flatlandsSwampIslandLand from '!!raw-loader!./flatlands/swamp-island-land.xml';
import flatlandsSwampedHillsV2 from '!!raw-loader!./flatlands/swamped-hills-v2.xml';
import flatlandsSwampedHills from '!!raw-loader!./flatlands/swamped-hills.xml';
import flatlandsSwampedTrees from '!!raw-loader!./flatlands/swamped-trees.xml';

import flatlandsMediumMediumLandIi from '!!raw-loader!./flatlands-medium/medium-land-ii.xml';
import flatlandsMediumMediumLand from '!!raw-loader!./flatlands-medium/medium-land.xml';
import flatlandsMediumSmallLandIi from '!!raw-loader!./flatlands-medium/small-land-ii.xml';
import flatlandsMediumSmallLand from '!!raw-loader!./flatlands-medium/small-land.xml';

import happyFarmerMediumSummerland from '!!raw-loader!./happy-farmer/medium-summerland.xml';

import highlanderFlatRiver from '!!raw-loader!./highlander/flat-river.xml';
import highlanderMediumHighlanderWasteland from '!!raw-loader!./highlander/medium-highlander-wasteland.xml';
import highlanderMediumLand from '!!raw-loader!./highlander/medium-land.xml';
import highlanderMediumSummerland from '!!raw-loader!./highlander/medium-summerland.xml';
import highlanderMediumWasteland2 from '!!raw-loader!./highlander/medium-wasteland2.xml';

import nemesisinTheStoneAgeNemesis1Glacial from '!!raw-loader!./nemesisin-the-stone-age/nemesis1-glacial.xml';

import smallVillageMediumLand from '!!raw-loader!./small-village/medium-land.xml';
import smallVillageSmallLand from '!!raw-loader!./small-village/small-land.xml';
import {Options} from '~/components/ui/Select';

export const presets = {
  //<editor-fold desc="Bloodline (SchwiftyK)">
  'schwiftyk/bloodline/schwifty_africa_more_oaks': bloodlineSchwiftyAfrica,
  'schwiftyk/bloodline/schwifty_africa_more_sticks': bloodlineSchwiftyAfricaMoreOaks,
  'schwiftyk/bloodline/schwifty_africa': bloodlineSchwiftyAfricaMoreSticks,
  //</editor-fold>

  //<editor-fold desc="Everwinter (SchwiftyK)">
  'schwiftyk/everwinter/flat_winterland': everwinterFlatWinterland,
  'schwiftyk/everwinter/medium_winterland': everwinterMediumWinterland,
  //</editor-fold>

  //<editor-fold desc="Flatlands (SchwiftyK)">
  'schwiftyk/flatlands/flat_river_easy': flatlandsFlatRiverEasy,
  'schwiftyk/flatlands/flat_river': flatlandsFlatRiver,
  'schwiftyk/flatlands/larger_hills_v_2': flatlandsLargerHillsV2,
  'schwiftyk/flatlands/larger_hills': flatlandsLargerHills,
  'schwiftyk/flatlands/rocky_river_v_2': flatlandsRockyRiverV2,
  'schwiftyk/flatlands/rocky_river': flatlandsRockyRiver,
  'schwiftyk/flatlands/swamp_island_land': flatlandsSwampIslandLand,
  'schwiftyk/flatlands/swamped_hills_v_2': flatlandsSwampedHillsV2,
  'schwiftyk/flatlands/swamped_hills': flatlandsSwampedHills,
  'schwiftyk/flatlands/swamped_trees': flatlandsSwampedTrees,
  //</editor-fold>

  //<editor-fold desc="Flatlands Medium (SchwiftyK)">
  'schwiftyk/flatlands_medium/medium_land_ii': flatlandsMediumMediumLandIi,
  'schwiftyk/flatlands_medium/medium_land': flatlandsMediumMediumLand,
  'schwiftyk/flatlands_medium/small_land_ii': flatlandsMediumSmallLandIi,
  'schwiftyk/flatlands_medium/small_land': flatlandsMediumSmallLand,
  //</editor-fold>

  //<editor-fold desc="Happy farmer (SchwiftyK)">
  'schwiftyk/happy_farmer/medium_summerland': happyFarmerMediumSummerland,
  //</editor-fold>

  //<editor-fold desc="Highlander (SchwiftyK)">
  'schwiftyk/highlander/flat_river': highlanderFlatRiver,
  'schwiftyk/highlander/medium_highlander_wasteland': highlanderMediumHighlanderWasteland,
  'schwiftyk/highlander/medium_land': highlanderMediumLand,
  'schwiftyk/highlander/medium_summerland': highlanderMediumSummerland,
  'schwiftyk/highlander/medium_wasteland_2': highlanderMediumWasteland2,
  //</editor-fold>

  //<editor-fold desc="Nemesis in the stone age (SchwiftyK)">
  'schwiftyk/nemesis_in_the_stone_age/nemesis_1_glacial': nemesisinTheStoneAgeNemesis1Glacial,
  //</editor-fold>

  //<editor-fold desc="Small village (SchwiftyK)">
  'schwiftyk/small_village/medium_land': smallVillageMediumLand,
  'schwiftyk/small_village/small_land': smallVillageSmallLand,
  //</editor-fold>
};

export const presetOptions: Options = [
  {
    label: 'Bloodline (SchwiftyK)',
    options: [{
      label: 'Africa plain',
      value: 'schwiftyk/bloodline/schwifty_africa',
      type: 'environment',
    }, {
      label: 'Africa more oaks',
      value: 'schwiftyk/bloodline/schwifty_africa_more_oaks',
      type: 'environment',
    }, {
      label: 'Africa more sticks',
      value: 'schwiftyk/bloodline/schwifty_africa_more_sticks',
      type: 'environment',
    }],
  },
  {
    label: 'Everwinter (SchwiftyK)',
    options: [
      {label: 'Flat winterland', value: 'schwiftyk/everwinter/flat_winterland', type: 'environment'},
      {label: 'Medium winterland', value: 'schwiftyk/everwinter/medium_winterland', type: 'environment'},
    ],
  },
  {
    label: 'Flatlands (SchwiftyK)',
    options: [
      {label: 'Flat river easy', value: 'schwiftyk/flatlands/flat_river_easy', type: 'environment'},
      {label: 'Flat river', value: 'schwiftyk/flatlands/flat_river', type: 'environment'},
      {label: 'Larger hills (v2)', value: 'schwiftyk/flatlands/larger_hills_v_2', type: 'environment'},
      {label: 'Larger hills', value: 'schwiftyk/flatlands/larger_hills', type: 'environment'},
      {label: 'Rocky river (v2)', value: 'schwiftyk/flatlands/rocky_river_v_2', type: 'environment'},
      {label: 'Rocky river', value: 'schwiftyk/flatlands/rocky_river', type: 'environment'},
      {label: 'Swamp island land', value: 'schwiftyk/flatlands/swamp_island_land', type: 'environment'},
      {label: 'Swamped hills (v2)', value: 'schwiftyk/flatlands/swamped_hills_v_2', type: 'environment'},
      {label: 'Swamped hills', value: 'schwiftyk/flatlands/swamped_hills', type: 'environment'},
      {label: 'Swamped trees', value: 'schwiftyk/flatlands/swamped_trees', type: 'environment'},
    ],
  },
  {
    label: 'Flatlands Medium (SchwiftyK)',
    options: [
      {label: 'Medium land', value: 'schwiftyk/flatlands_medium/medium_land', type: 'environment'},
      {label: 'Medium land (v2)', value: 'schwiftyk/flatlands_medium/medium_land_ii', type: 'environment'},
      {label: 'Small land', value: 'schwiftyk/flatlands_medium/small_land', type: 'environment'},
      {label: 'Small land (v2)', value: 'schwiftyk/flatlands_medium/small_land_ii', type: 'environment'},
    ],
  },
  {
    label: 'Happy farmer (SchwiftyK)',
    options: [
      {label: 'Medium summer-land', value: 'schwiftyk/happy_farmer/medium_summerland', type: 'environment'},
    ],
  },
  {
    label: 'Highlander (SchwiftyK)',
    options: [
      {label: 'Flat river', value: 'schwiftyk/highlander/flat_river', type: 'environment'},
      {
        label: 'Medium highlander wasteland',
        value: 'schwiftyk/highlander/medium_highlander_wasteland',
        type: 'environment',
      },
      {label: 'Medium land', value: 'schwiftyk/highlander/medium_land', type: 'environment'},
      {label: 'Medium summer-land', value: 'schwiftyk/highlander/medium_summerland', type: 'environment'},
      {label: 'Medium wasteland (v2)', value: 'schwiftyk/highlander/medium_wasteland_2', type: 'environment'},
    ],
  },
  {
    label: 'Nemesis in the stone age (SchwiftyK)',
    options: [
      {label: 'Nemesis glacial', value: 'schwiftyk/nemesis_in_the_stone_age/nemesis_1_glacial', type: 'environment'},
    ],
  },
  {
    label: 'Small village (SchwiftyK)',
    options: [
      {label: 'Medium land', value: 'schwiftyk/small_village/medium_land', type: 'environment'},
      {label: 'Small land', value: 'schwiftyk/small_village/small_land', type: 'environment'},
    ],
  }];
