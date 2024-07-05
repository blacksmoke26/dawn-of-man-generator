/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {
  ANGLE_MAX,
  ANGLE_MIN, ARMOR_RATIO_MAX, ARMOR_RATIO_MIN,
  DECREASE_HALFING_POPULATION_MAX,
  DECREASE_HALFING_POPULATION_MIN,
  DECREASE_START_POPULATION_MAX,
  DECREASE_START_POPULATION_MIN,
  ERA_FACTORS_MAX,
  ERA_FACTORS_MIN,
  INDIVIDUAL_DISEASE_CHANCE_MAX,
  INDIVIDUAL_DISEASE_CHANCE_MIN,
  LOCATION_INDEX_MAX,
  LOCATION_INDEX_MIN,
  PERIOD_MAX,
  PERIOD_MIN,
  POSITION_VECTOR_MAX,
  POSITION_VECTOR_MIN,
  RADIUS_MAX,
  RADIUS_MIN, RAIDER_ATTACK_AMOUNT_MAX, RAIDER_ATTACK_AMOUNT_MIN,
  ROTATION_MAX,
  ROTATION_MIN, SCALE_MAX, SCALE_MIN, SHIELD_RATIO_MAX, SHIELD_RATIO_MIN,
  TECH_COST_MULTIPLIER_MAX,
  TECH_COST_MULTIPLIER_MIN,
  TIME_OF_YEAR_MAX,
  TIME_OF_YEAR_MIN, TIME_SCALE_INDEX_MAX,
  TIME_SCALE_INDEX_MIN, YEARS_OLD_MAX, YEARS_OLD_MIN,
} from '~/utils/defaults';
import {
  MAP_SIZE_MAX, MAP_SIZE_MIN,
  LOCATION_MAP_MAX, LOCATION_MAP_MIN,
  LOCATION_SEED_MAX, LOCATION_SEED_MIN,
  LOCATION_LAKES_MAX, LOCATION_LAKES_MIN,
  LOCATION_POSITION_MAX, LOCATION_POSITION_MIN, KNOWLEDGE_MIN, KNOWLEDGE_MAX,
} from '~/utils/scenario/defaults';
import {isInt, isNumeric} from '~/helpers/number';
import {isString} from '~/helpers/string';
import {DISTANCE_MAX, DISTANCE_MIN, ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';

/**
 * Checks if the period is valid
 * @param value The period to validate (e.g., 2.7 or '2.7y')
 * @param [checkUnit] - Checks existence of a `y` unit at the end of the period
 * @returns True if valid, false otherwise
 */
export const validatePeriod = (value: string | number, checkUnit: boolean = true): boolean => {
  let period: number = 0;

  checkUnit && (value = String(value));

  if (typeof value === 'number') {
    period = value;
  }

  if (typeof value === 'string') {
    if (!/^\d+(\.\d+)?y$/ig.test(value)) {
      return false;
    }
    period = Number(parseFloat(value).toFixed(1));
  }

  return !(period < PERIOD_MIN || period > PERIOD_MAX);
};

/**
 * Checks if the map size is valid
 * @param size - The size
 * @returns True if valid, false otherwise
 */
export const validateMapSize = (size: number | any): boolean => {
  return !isInt(size) ? false : !(size < MAP_SIZE_MIN || size > MAP_SIZE_MAX);
};

/**
 * Checks if the radius is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateRadius = (value: number | any): boolean => {
  if (!isNumeric(value)) {
    return false;
  } else {
    return !(value < RADIUS_MIN || value > RADIUS_MAX);
  }
};

/**
 * Checks if the distance is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateDistance = (value: number | any): boolean => {
  if (!isNumeric(value)) {
    return false;
  } else {
    return !(value < DISTANCE_MIN || value > DISTANCE_MAX);
  }
};

/**
 * Checks if the location index is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateLocationIndex = (value: number | any): boolean => {
  if (!isInt(value)) {
    return false;
  } else {
    return !(value < LOCATION_INDEX_MIN || value > LOCATION_INDEX_MAX);
  }
};

/**
 * Checks if the rotation is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateRotation = (value: number | any): boolean => {
  if (!isNumeric(value)) {
    return false;
  } else {
    return !(value < ROTATION_MIN || value > ROTATION_MAX);
  }
};

/**
 * Checks if the decrease start population is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateDecreaseStartPopulation = (value: number | any): boolean => {
  if (!isInt(value)) {
    return false;
  } else {
    return !(value < DECREASE_START_POPULATION_MIN || value > DECREASE_START_POPULATION_MAX);
  }
};

/**
 * Checks if the decrease halfing population is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateDecreaseHalfingPopulation = (value: number | any): boolean => {
  if (!isInt(value)) {
    return false;
  } else {
    return !(value < DECREASE_HALFING_POPULATION_MIN || value > DECREASE_HALFING_POPULATION_MAX);
  }
};

/**
 * Checks if the individual disease chance is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateIndividualDiseaseChance = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(
      value < INDIVIDUAL_DISEASE_CHANCE_MIN
      || value > INDIVIDUAL_DISEASE_CHANCE_MAX
    );
};

/**
 * Checks if the knowledge points is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateKnowledge = (value: number | any): boolean => {
  return !isNumeric(value) // TODO: Validate
    ? false
    : !(value < KNOWLEDGE_MIN || value > KNOWLEDGE_MAX);
};

/**
 * Checks if the tech cost multiplier is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateTechCostMultiplier = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(
      value < TECH_COST_MULTIPLIER_MIN
      || value > TECH_COST_MULTIPLIER_MAX
    );
};

/**
 * Checks if the time of year is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateTimeOfYear = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < TIME_OF_YEAR_MIN || value > TIME_OF_YEAR_MAX);
};

/**
 * Checks if the timescale is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateTimeScale = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < TIME_SCALE_INDEX_MIN || value > TIME_SCALE_INDEX_MAX);
};

/**
 * Checks if the raider attack amount is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateRaiderAttackAmount = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(
      value < RAIDER_ATTACK_AMOUNT_MIN
      || value > RAIDER_ATTACK_AMOUNT_MAX
    );
};

/**
 * Checks if the scale is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateScale = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < SCALE_MIN || value > SCALE_MAX);
};

/**
 * Checks if the entity count is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateEntityCount = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < ENTITY_COUNT_MIN || value > ENTITY_COUNT_MAX);
};

/**
 * Checks if the angle is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateAngle = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < ANGLE_MIN || value > ANGLE_MAX);
};

/**
 * Checks if the age (years old) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateAge = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < YEARS_OLD_MIN || value > YEARS_OLD_MAX);
};

/**
 * Checks if the shield ratio (raider>wave) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateShieldRatio = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < SHIELD_RATIO_MIN || value > SHIELD_RATIO_MAX);
};

/**
 * Checks if the armor ratio (raider>wave) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateArmorRatio = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < ARMOR_RATIO_MIN || value > ARMOR_RATIO_MAX);
};

/**
 * Checks that location seed is valid
 * @param value - The value
 * @returns True if valid, false otherwise
 */
export const validateLocationSeed = (value: number | any): boolean => {
  return !isInt(value) ? false : !(value < LOCATION_SEED_MIN || value > LOCATION_SEED_MAX);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param n - The count
 * @returns True if valid, false otherwise
 */
export const validateLocationLakes = (n: number | any): boolean => {
  return !isInt(n) ? false : !(n < LOCATION_LAKES_MIN || n > LOCATION_LAKES_MAX);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param cord - The coordinates (e.g., '0.1,0.6')
 * @returns True if valid, false otherwise
 */
export const validateLocationCoordinates = (cord: string | any): boolean => {
  if (!isString(cord) || !/^[01]+(\.\d{1,3})?,[01]+(\.\d{1,3})?$/.test(cord)) {
    return false;
  }

  const [x = 0, y = 0] = cord.split(',').map(Number);

  if (x < LOCATION_MAP_MIN || y < LOCATION_MAP_MIN) {
    return false;
  } else if (x > LOCATION_MAP_MAX || y > LOCATION_MAP_MAX) {
    return false;
  }

  return true;
};

/**
 * Checks if the position (location) is valid
 * @param pos - The position on the map (e.g., `'0,176'`)
 * @returns True if valid, false otherwise
 */
export const validateLocationPosition = (pos: string | any): boolean => {
  if (!isString(pos) || !/^\d+,\d+$/.test(pos)) {
    return false;
  }

  const [x = 0, y = 0] = pos.split(',').map(Number);

  if (!isInt(x) || !isInt(y)) {
    return false;
  }

  if (x < LOCATION_POSITION_MIN || y < LOCATION_POSITION_MIN) {
    return false;
  } else if (x > LOCATION_POSITION_MAX || y > LOCATION_POSITION_MAX) {
    return false;
  }

  return true;
};

/**
 * Checks if the vector position is valid
 * @param pos - The vector position (e.g., `'3,46,68'`)
 * @returns True if valid, false otherwise
 */
export const validateVectorPosition = (pos: string | any): boolean => {
  if (!isString(pos) || !/^\d+,\d+,\d+$/.test(pos)) {
    return false;
  }

  const [x = 0, y = 0, z = 0] = pos.split(',').map(Number);

  if (!isInt(x) || !isInt(y) || !isInt(z)) {
    return false;
  }

  if (x < POSITION_VECTOR_MIN || y < POSITION_VECTOR_MIN || z < POSITION_VECTOR_MIN) {
    return false;
  } else if (x > POSITION_VECTOR_MAX || y > POSITION_VECTOR_MAX || z > POSITION_VECTOR_MAX) {
    return false;
  }

  return true;
};

/**
 * Checks if the vector era factors is valid
 * @param value - The value
 * @returns True if valid, false otherwise
 */
export const validateEraFactors = (value: string | any): boolean => {
  if (!/^(0(\.\d{1,2})?|1)( (0(\.\d{1,2})?|1)){0,5}$/.test('' + value)) {
    return false;
  }

  const nums: number[] = isNumeric(value) ? [value] : value.split(' ').map(Number);

  for (const num of nums) {
    if (num < ERA_FACTORS_MIN || num > ERA_FACTORS_MAX) {
      return false;
    }
  }

  return true;
};
