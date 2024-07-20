/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isString} from '~/helpers/string';
import {isInt, isNumeric} from '~/helpers/number';

// utils
import * as Defaults from '~/utils/defaults';
import * as ScnDefaults from '~/utils/scenario/defaults';
import * as CondDefaults from '~/utils/condition';

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

  return !(period < Defaults.PERIOD_MIN || period > Defaults.PERIOD_MAX);
};

/**
 * Checks if the map size is valid
 * @param size - The size
 * @returns True if valid, false otherwise
 */
export const validateMapSize = (size: number | any): boolean => {
  return !isInt(size) ? false : !(size < ScnDefaults.MAP_SIZE_MIN || size > ScnDefaults.MAP_SIZE_MAX);
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
    return !(value < Defaults.RADIUS_MIN || value > Defaults.RADIUS_MAX);
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
    return !(value < CondDefaults.DISTANCE_MIN || value > CondDefaults.DISTANCE_MAX);
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
    return !(value < Defaults.LOCATION_INDEX_MIN || value > Defaults.LOCATION_INDEX_MAX);
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
    return !(value < Defaults.ROTATION_MIN || value > Defaults.ROTATION_MAX);
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
    return !(value < Defaults.DECREASE_START_POPULATION_MIN
      || value > Defaults.DECREASE_START_POPULATION_MAX);
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
    return !(value < Defaults.DECREASE_HALFING_POPULATION_MIN
      || value > Defaults.DECREASE_HALFING_POPULATION_MAX);
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
      value < Defaults.INDIVIDUAL_DISEASE_CHANCE_MIN
      || value > Defaults.INDIVIDUAL_DISEASE_CHANCE_MAX
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
    : !(value < ScnDefaults.KNOWLEDGE_MIN || value > ScnDefaults.KNOWLEDGE_MAX);
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
      value < Defaults.TECH_COST_MULTIPLIER_MIN
      || value > Defaults.TECH_COST_MULTIPLIER_MAX
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
    : !(value < Defaults.TIME_OF_YEAR_MIN || value > Defaults.TIME_OF_YEAR_MAX);
};

/**
 * Checks if the timescale is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateTimeScale = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < Defaults.TIME_SCALE_INDEX_MIN || value > Defaults.TIME_SCALE_INDEX_MAX);
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
      value < Defaults.RAIDER_ATTACK_AMOUNT_MIN
      || value > Defaults.RAIDER_ATTACK_AMOUNT_MAX
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
    : !(value < Defaults.SCALE_MIN || value > Defaults.SCALE_MAX);
};

/**
 * Checks if the entity count is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateEntityCount = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < CondDefaults.ENTITY_COUNT_MIN || value > CondDefaults.ENTITY_COUNT_MAX);
};

/**
 * Checks if the angle is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateAngle = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < Defaults.ANGLE_MIN || value > Defaults.ANGLE_MAX);
};

/**
 * Checks if the age (years old) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateAge = (value: number | any): boolean => {
  return !isInt(value)
    ? false
    : !(value < Defaults.YEARS_OLD_MIN || value > Defaults.YEARS_OLD_MAX);
};

/**
 * Checks if the shield ratio (raider>wave) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateShieldRatio = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < Defaults.SHIELD_RATIO_MIN || value > Defaults.SHIELD_RATIO_MAX);
};

/**
 * Checks if the armor ratio (raider>wave) is valid or not
 * @param value - The value to check
 * @returns True if valid, false otherwise
 */
export const validateArmorRatio = (value: number | any): boolean => {
  return !isNumeric(value)
    ? false
    : !(value < Defaults.ARMOR_RATIO_MIN || value > Defaults.ARMOR_RATIO_MAX);
};

/**
 * Checks that location seed is valid
 * @param value - The value
 * @returns True if valid, false otherwise
 */
export const validateLocationSeed = (value: number | any): boolean => {
  return !isInt(value) ? false : !(value < ScnDefaults.LOCATION_SEED_MIN || value > ScnDefaults.LOCATION_SEED_MAX);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param n - The count
 * @returns True if valid, false otherwise
 */
export const validateLocationLakes = (n: number | any): boolean => {
  return !isInt(n) ? false : !(n < ScnDefaults.LOCATION_LAKES_MIN || n > ScnDefaults.LOCATION_LAKES_MAX);
};

const REGEX_COORDINATES_STRICT = /^[01]+(\.\d{1,3})?,[01]+(\.\d{1,3})?$/;
const REGEX_COORDINATES_LOSSY = /^\d+(\.\d+)?\s*,\s*\d+(\.\d+)?$/;
export const isLocationCoordinates = (coords: string, lossy: boolean = false): boolean => {
  if (!isString(coords, true)) return false;

  return (
    !lossy ? REGEX_COORDINATES_STRICT : REGEX_COORDINATES_LOSSY
  ).test(coords);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param cord - The coordinates (e.g., '0.1,0.6')
 * @returns True if valid, false otherwise
 */
export const validateLocationCoordinates = (cord: string | any): boolean => {
  if (!isLocationCoordinates(cord)) {
    return false;
  }

  const [x, y] = cord.split(',').map(Number);

  if (x < ScnDefaults.LOCATION_MAP_MIN || y < ScnDefaults.LOCATION_MAP_MIN) {
    return false;
  } else if (x > ScnDefaults.LOCATION_MAP_MAX || y > ScnDefaults.LOCATION_MAP_MAX) {
    return false;
  }

  return true;
};

export const isLocationPosition = (pos: string): boolean => {
  return isString(pos) && /^\d+,\d+$/.test(pos);
};

/**
 * Checks if the position (location) is valid
 * @param pos - The position on the map (e.g., `'0,176'`)
 * @returns True if valid, false otherwise
 */
export const validateLocationPosition = (pos: string | any): boolean => {
  if (!isLocationPosition(pos)) {
    return false;
  }

  const [x, y] = pos.split(',').map(Number);

  if (x < ScnDefaults.LOCATION_POSITION_MIN || y < ScnDefaults.LOCATION_POSITION_MIN) {
    return false;
  } else if (x > ScnDefaults.LOCATION_POSITION_MAX || y > ScnDefaults.LOCATION_POSITION_MAX) {
    return false;
  }

  return true;
};

export const isVectorPosition = (pos: string | any): boolean => {
  return isString(pos, true) && /^\d+(,\d+){2}$/.test(pos);
};

/**
 * Checks if the vector position is valid
 * @param pos - The vector position (e.g., `'3,46,68'`)
 * @returns True if valid, false otherwise
 */
export const validateVectorPosition = (pos: string | any): boolean => {
  if (!isVectorPosition(pos)) {
    return false;
  }

  const [x = 0, y = 0, z = 0] = pos.split(',').map(Number);

  if (!isInt(x) || !isInt(y) || !isInt(z)) {
    return false;
  }

  if (x < Defaults.POSITION_VECTOR_MIN || y < Defaults.POSITION_VECTOR_MIN || z < Defaults.POSITION_VECTOR_MIN) {
    return false;
  } else if (x > Defaults.POSITION_VECTOR_MAX || y > Defaults.POSITION_VECTOR_MAX || z > Defaults.POSITION_VECTOR_MAX) {
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
    if (num < Defaults.ERA_FACTORS_MIN || num > Defaults.ERA_FACTORS_MAX) {
      return false;
    }
  }

  return true;
};
