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
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonVeryWindyChance,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';
import {SeasonsDefault, FallConfig} from '~/utils/randomizer/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === FallConfig.id) as Json;

  if (!isObject(node)) {
    return {[FallConfig.id]: SeasonsDefault.Fall};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    FallConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    FallConfig.precipitationChance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    FallConfig.windyChance,
  );

  const veryWindyChance = normalizeSeasonVeryWindyChance(
    op.get(node, 'very_windy_chance'),
    FallConfig.veryWindyChance,
  );

  return {
    [FallConfig.id]: {
      duration,
      precipitationChance,
      windyChance,
      veryWindyChance,
      temperature: normalizeSeasonTemperatureMinMax({
        min: op.get(node, 'min_temperature.value'),
        minDefault: FallConfig.temperature[0],
        max: op.get(node, 'max_temperature.value'),
        maxDefault: FallConfig.temperature[1],
      }),
    },
  };
};
