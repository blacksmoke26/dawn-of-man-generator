/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {filterUnique} from '~/helpers/array';
import {isInt, toFloat} from '~/helpers/number';
import {isString, toString} from '~/helpers/string';
import {ENTITIES_LIVING, techEntities} from '~/utils/entities';
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN, ERAS} from '~/utils/condition';
import {validateArmorRatio, validateEntityCount, validatePeriod, validateShieldRatio} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetRaider, ActionWithType, RaidWaveParameters} from '~/types/action.types';
import {TechEntityType} from '~/types/entity.types';

const ACTION_NAME: ActionName = 'SetRaider';
type ActionParams = ActionWithType<'SetRaider', ActionSetRaider>;

const normalizeMinsMaxes = (node: Json, action: ActionParams): void => {
  if (toString(node?.mins).trim()) {
    const mins = node.mins.split(' ').filter(validateEntityCount).map(Number);
    mins.length && (action.mins = mins);
  }

  if (toString(node?.maxes).trim()) {
    const maxes = node.maxes.split(' ').filter(validateEntityCount).map(Number);
    maxes.length && (action.maxes = maxes);
  }
};

const normalizeOptionalValues = (node: Json, action: ActionParams): void => {
  (isInt(node?.min) && node.min >= ENTITY_COUNT_MIN) && (action.min = node.min);
  (isInt(node?.max) && node.max <= ENTITY_COUNT_MAX) && (action.max = node.max);

  if (action?.min !== undefined && action?.max !== undefined) {
    action?.min > action.max && (action.min = action.max);
    action?.max < action.min && (action.max = action.min);
  }

  normalizeMinsMaxes(node, action);

  validatePeriod(node?.grace_period) && (action.gracePeriod = toFloat(node?.grace_period, 2));
  validatePeriod(node?.period) && (action.period = toFloat(node?.period, 2));
  validatePeriod(node?.variance) && (action.variance = toFloat(node?.variance, 2));

  validateEntityCount(node?.extra_raider_per_population)
  && (action.extraRaiderPerPopulation = node.extra_raider_per_population);
};

const normalizeOptionalWaves = (node: Json, action: ActionParams) => {
  if (!node?.waves?.wave) return;

  const rawWaves: Json[] = [].concat(node?.waves?.wave);

  const waves: RaidWaveParameters[] = [];

  for (const wave of rawWaves) {
    if (!validateShieldRatio(wave?.shield_ratio)
      || !validateArmorRatio(wave?.armor_ratio)) {
      continue;
    }

    const raidWave = {
      shieldRatio: toFloat(wave?.shield_ratio, 2),
      armorRatio: toFloat(wave?.armor_ratio, 2),
    } as RaidWaveParameters;

    if (isString(wave?.disabled_techs)) {
      raidWave.disabledTechs = filterUnique(
        toString(wave?.disabled_techs)
          .split(' ')
          .filter(name => techEntities.includes(name.trim())),
      ) as TechEntityType[];

      // clear if none
      !raidWave.disabledTechs.length && delete raidWave.disabledTechs;
    }

    waves.push(raidWave);
  }

  waves.length && (action.waves = waves);
};

/** Convert a `SetRaider` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const entityTypesAttr = !isString(node?.entity_types, true)
    ? []
    : filterUnique(
      node.entity_types.split(' ')
        .map((name: string) => name.trim())
        .filter((name: string) => ENTITIES_LIVING.includes(name)),
    );

  if (!entityTypesAttr.length) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    era: node.era,
  } as ActionParams;

  validatePeriod(node?.hardcore_timer)
  && (action.hardcoreTimer = toFloat(node?.hardcore_timer, 2));

  (isString(node?.era, true)
    && (ERAS.includes(node?.era)))
  && (action.era = node?.era);

  action.entityTypes = entityTypesAttr;

  normalizeOptionalValues(node, action);
  normalizeOptionalWaves(node, action);

  return action;
};
