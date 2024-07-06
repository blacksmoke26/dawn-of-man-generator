/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import {EraFactor} from '~/types/action.types';
import {environment} from '~/data/environments/parser/types';

export const HUMIDITY_MIN: number = 0;
export const HUMIDITY_MAX: number = 1;
export const HUMIDITY_MIN_DEFAULT: number = 0;
export const HUMIDITY_MAX_DEFAULT: number = 1;

export const BACKDROP_SCALE_MIN: number = 0;
export const BACKDROP_SCALE_MAX: number = 1;

export const BACKDROP_SCALE_DEFAULT: [number, number, number] = [1.0, 0.25, 1.0];

export const ALTITUDE_MIN: number = -20;
export const ALTITUDE_MAX: number = 100;
export const ALTITUDE_MIN_DEFAULT: number = 5;
export const ALTITUDE_MAX_DEFAULT: number = 10;

export const POSITION_MIN: number = 1;
export const POSITION_MAX: number = 2048;

export const ANGLE_MIN: number = -10;
export const ANGLE_MAX: number = 60;
export const ANGLE_MIN_DEFAULT: number = 40;
export const ANGLE_MAX_DEFAULT: number = 55;

export const DENSITY_MIN: number = 0;
export const DENSITY_MAX: number = 1;
export const DENSITY_DEFAULT: number = 1;

export const RESOURCE_FACTOR_MIN: number = 0;
export const RESOURCE_FACTOR_MAX: number = 100;
export const RESOURCE_FACTOR_DEFAULT: number = 1;

export const TREES_EVERYWHERE_DEFAULT: boolean = false;

export const SEASON_TEMPERATURE_MIN = -50;
export const SEASON_TEMPERATURE_MAX = 100;

export const SEASON_WIND_MIN = 0;
export const SEASON_WIND_MAX = 50;

export const SEASON_DURATION_MIN = 0;
export const SEASON_DURATION_MAX = 1;

export const SEASON_PRECIPITATION_CHANCE_MIN = 0;
export const SEASON_PRECIPITATION_CHANCE_MAX = 1;

export const SEASON_WINDY_CHANCE_MIN = 0;
export const SEASON_WINDY_CHANCE_MAX = 1;

export const SEASON_VERY_WINDY_CHANCE_MIN = 0;
export const SEASON_VERY_WINDY_CHANCE_MAX = 1;

export const SEASON_FISH_BOOST_MIN = 0;
export const SEASON_FISH_BOOST_MAX = 1;

export const SEASONS_DEFAULT: environment.Seasons = {
  Spring: {
    duration: 0.25,
    precipitationChance: 0.25,
    windyChance: 0.5,
    veryWindyChance: 0.1,
    fishBoost: 0.5,
    temperature: [5, 25],
  },
  Fall: {
    duration: 0.25,
    precipitationChance: 0.25,
    windyChance: 0.5,
    veryWindyChance: 0.1,
    temperature: [5, 25],
  },
  Summer: {
    duration: 0.25,
    precipitationChance: 0,
    windyChance: 0.25,
    wind: [0, 5],
    temperature: [20, 35],
  },
  Winter: {
    duration: 0.25,
    precipitationChance: 0.25,
    windyChance: 0.5,
    veryWindyChance: 0.1,
    reducedFauna: true,
    temperature: [-15, 10],
  },
};

export const FORD_DISTANCE_FACTOR_MIN: number = 0;
export const FORD_DISTANCE_FACTOR_MAX: number = 20;
export const FORD_DISTANCE_FACTOR_DEFAULT: number = 1;

export const DISTANCE_HEIGHT_OFFSET_MIN: number = 0;
export const DISTANCE_HEIGHT_OFFSET_MAX: number = 20;
export const DISTANCE_HEIGHT_OFFSET_DEFAULT: number = 0.22;

export const SUN_ANGLE_FACTOR_MIN: number = 0;
export const SUN_ANGLE_FACTOR_MAX: number = 20;
export const SUN_ANGLE_FACTOR_DEFAULT: number = 1;

export const PERIOD_MIN: number = 0;
export const PERIOD_MAX: number = 35;

export const RADIUS_MIN: number = 0;
export const RADIUS_MAX: number = 360;

export const ROTATION_MIN: number = 1;
export const ROTATION_MAX: number = 360;

export const LOCATION_INDEX_MIN: number = -1;
export const LOCATION_INDEX_MAX: number = 150;

export const POSITION_VECTOR_MIN: number = 0;
export const POSITION_VECTOR_MAX: number = 100;

export const ERA_FACTORS_MIN: number = 0;

export const ERA_FACTORS_MAX: number = 1;

export const ANIMAL_POPULATION_MIN: number = 0;

export const ANIMAL_POPULATION_MAX: number = 500;

export const DECREASE_START_POPULATION_MIN: number = 1;
export const DECREASE_START_POPULATION_MAX: number = 3000;

export const DECREASE_HALFING_POPULATION_MIN: number = 1;
export const DECREASE_HALFING_POPULATION_MAX: number = 3000;

export const INDIVIDUAL_DISEASE_CHANCE_MIN: number = 0;
export const INDIVIDUAL_DISEASE_CHANCE_MAX: number = 10;

export const TECH_COST_MULTIPLIER_MIN: number = 1;
export const TECH_COST_MULTIPLIER_MAX: number = 3;

export const SCALE_MIN: number = 1;
export const SCALE_MAX: number = 20;

export const MIGRATION_MIN: number = 1;
export const MIGRATION_MAX: number = 50;

export const TIME_OF_YEAR_MIN: number = 1;
export const TIME_OF_YEAR_MAX: number = 10;

export const TIME_SCALE_INDEX_MIN: number = 1;
export const TIME_SCALE_INDEX_MAX: number = 10;

export const RAIDER_ATTACK_AMOUNT_MIN: number = 1;
export const RAIDER_ATTACK_AMOUNT_MAX: number = 50;

export const YEARS_OLD_MIN: number = 1;
export const YEARS_OLD_MAX: number = 60;

export const SHIELD_RATIO_MIN: number = 0;
export const SHIELD_RATIO_MAX: number = 1;

export const ARMOR_RATIO_MIN: number = 0;
export const ARMOR_RATIO_MAX: number = 1;

export const DEFAULT_SEASONS: string[] = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
];

export const DEFAULT_DISASTER: string[] = [
  'Storm',
  'Blizzard',
];

export const ERA_FACTORS_LOWEST: EraFactor = [
  ERA_FACTORS_MIN, ERA_FACTORS_MIN, ERA_FACTORS_MIN,
  ERA_FACTORS_MIN, ERA_FACTORS_MIN, ERA_FACTORS_MIN,
] as const;

export const ERA_FACTORS_HIGHEST: EraFactor = [
  ERA_FACTORS_MAX, ERA_FACTORS_MAX, ERA_FACTORS_MAX,
  ERA_FACTORS_MAX, ERA_FACTORS_MAX, ERA_FACTORS_MAX,
] as const;

// Max limits
export const EVENTS_CREATE_MAX: number = 20;

export const ACTIONS_CREATE_MAX: number = 20;

export const WAVES_CREATE_MAX: number = 5;

export const LOCATIONS_CREATE_MAX: number = 15;
