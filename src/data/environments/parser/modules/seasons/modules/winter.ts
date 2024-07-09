/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import {isBool} from '~/helpers/bool';
import {isObject} from '~/helpers/object';

// utils
import {
  normalizeSeasonDuration,
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonVeryWindyChance,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';
import {SeasonsDefault, WinterConfig} from '~/utils/randomizer/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === WinterConfig.id) as Json;

  if (!isObject(node)) {
    return {[WinterConfig.id]: SeasonsDefault.Winter};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    WinterConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    WinterConfig.precipitationChance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    WinterConfig.windyChance,
  );

  const veryWindyChance = normalizeSeasonVeryWindyChance(
    op.get(node, 'very_windy_chance'),
    WinterConfig.veryWindyChance,
  );

  const reducedFauna = isBool(op.get(node, 'reduced_fauna'))
    ? op.get(node, 'reduced_fauna')
    : WinterConfig.reducedFauna;

  return {
    [WinterConfig.id]: {
      duration,
      precipitationChance,
      windyChance,
      veryWindyChance,
      reducedFauna,
      temperature: normalizeSeasonTemperatureMinMax({
        min: op.get(node, 'min_temperature.value'),
        minDefault: WinterConfig.temperature[0],
        max: op.get(node, 'max_temperature.value'),
        maxDefault: WinterConfig.temperature[1],
      }),
    },
  };
};
