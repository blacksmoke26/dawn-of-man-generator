/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import {isObject} from '~/helpers/object';
import {SpringConfig, toSpringSeasonParsed} from '~/utils/seasons';

// utils
import {
  normalizeSeasonDuration,
  normalizeSeasonFishBoost,
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonVeryWindyChance,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === SpringConfig.id) as Json;

  if (!isObject(node)) {
    return {[SpringConfig.id]: toSpringSeasonParsed()};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    SpringConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    SpringConfig.precipitation_chance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    SpringConfig.windy_chance,
  );

  const veryWindyChance = normalizeSeasonVeryWindyChance(
    op.get(node, 'very_windy_chance'),
    SpringConfig.very_windy_chance,
  );

  const fishBoost = normalizeSeasonFishBoost(
    op.get(node, 'fish_boost'),
    SpringConfig.fish_boost,
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
        minDefault: SpringConfig.min_temperature.value,
        max: op.get(node, 'max_temperature.value'),
        maxDefault: SpringConfig.max_temperature.value,
      }),
    },
  };
};
