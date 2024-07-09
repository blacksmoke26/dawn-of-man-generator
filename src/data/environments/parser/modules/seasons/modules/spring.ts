/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import {isObject} from '~/helpers/object';

// utils
import {
  normalizeSeasonDuration,
  normalizeSeasonFishBoost,
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonVeryWindyChance,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';
import {SpringConfig, SeasonsDefault} from '~/utils/randomizer/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === SpringConfig.id) as Json;

  if (!isObject(node)) {
    return {[SpringConfig.id]: SeasonsDefault.Spring};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    SpringConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    SpringConfig.precipitationChance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    SpringConfig.windyChance,
  );

  const veryWindyChance = normalizeSeasonVeryWindyChance(
    op.get(node, 'very_windy_chance'),
    SpringConfig.veryWindyChance,
  );

  const fishBoost = normalizeSeasonFishBoost(
    op.get(node, 'fish_boost'),
    SpringConfig.fishBoost,
  );

  return {
    [SpringConfig.id]: {
      duration,
      precipitationChance,
      windyChance,
      veryWindyChance,
      fishBoost,
      temperature: normalizeSeasonTemperatureMinMax({
        min: op.get(node, 'min_temperature.value'),
        minDefault: SpringConfig.temperature[0],
        max: op.get(node, 'max_temperature.value'),
        maxDefault: SpringConfig.temperature[1],
      }),
    },
  };
};
