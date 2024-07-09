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
  normalizeSeasonWindMinMax,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';
import {SeasonsDefault, SummerFullConfig} from '~/utils/randomizer/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === SummerFullConfig.id) as Json;

  if (!isObject(node)) {
    return {[SummerFullConfig.id]: SeasonsDefault.Summer};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    SummerFullConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    SummerFullConfig.precipitationChance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    SummerFullConfig.windyChance,
  );

  const attributes: Json = {
    duration,
    precipitationChance,
    windyChance,
    wind: normalizeSeasonWindMinMax({
      min: op.get(node, 'min_wind.value'),
      minDefault: SummerFullConfig.wind[0],
      max: op.get(node, 'max_wind.value'),
      maxDefault: SummerFullConfig.wind[1],
    }),
    temperature: normalizeSeasonTemperatureMinMax({
      min: op.get(node, 'min_temperature.value'),
      minDefault: SummerFullConfig.temperature[0],
      max: op.get(node, 'max_temperature.value'),
      maxDefault: SummerFullConfig.temperature[1],
    }),
  };

  !('min_wind' in node) && delete attributes.wind;

  return {
    [SummerFullConfig.id]: attributes,
  };
};
