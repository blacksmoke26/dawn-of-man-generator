/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import {isObject} from '~/helpers/object';
import {FallConfig, toFallSeasonParsed} from '~/utils/seasons';

// utils
import {
  normalizeSeasonDuration,
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonVeryWindyChance,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === FallConfig.id) as Json;

  if (!isObject(node)) {
    return {[FallConfig.id]: toFallSeasonParsed()};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    FallConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    FallConfig.precipitation_chance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    FallConfig.windy_chance,
  );

  const veryWindyChance = normalizeSeasonVeryWindyChance(
    op.get(node, 'very_windy_chance'),
    FallConfig.very_windy_chance,
  );

  return {
    [FallConfig.id]: {
      duration,
      precipitationChance,
      windyChance,
      veryWindyChance,
      temperature: normalizeSeasonTemperatureMinMax({
        min: op.get(node, 'min_temperature.value'),
        minDefault: FallConfig.min_temperature.value,
        max: op.get(node, 'max_temperature.value'),
        maxDefault: FallConfig.max_temperature.value,
      }),
    },
  };
};
