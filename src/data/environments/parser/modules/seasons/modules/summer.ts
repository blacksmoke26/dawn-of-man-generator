/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import {isObject} from '~/helpers/object';
import {SummerConfig, toSummerSeasonParsed} from '~/utils/seasons';

// utils
import {
  normalizeSeasonDuration,
  normalizeSeasonPrecipitationChance,
  normalizeSeasonTemperatureMinMax,
  normalizeSeasonWindMinMax,
  normalizeSeasonWindyChance,
} from '~/utils/parser/environment/normalizer-season';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = (seasons: Json[]): Json => {
  const node = seasons.find(s => s.id === SummerConfig.id) as Json;

  if (!isObject(node)) {
    return {[SummerConfig.id]: toSummerSeasonParsed()};
  }

  const duration = normalizeSeasonDuration(
    op.get(node, 'duration'),
    SummerConfig.duration,
  );

  const precipitationChance = normalizeSeasonPrecipitationChance(
    op.get(node, 'precipitation_chance'),
    SummerConfig.precipitation_chance,
  );

  const windyChance = normalizeSeasonWindyChance(
    op.get(node, 'windy_chance'),
    SummerConfig.windy_chance,
  );

  const attributes: Json = {
    duration,
    precipitationChance,
    windyChance,
    wind: normalizeSeasonWindMinMax({
      min: op.get(node, 'min_wind.value'),
      minDefault: SummerConfig.min_wind,
      max: op.get(node, 'max_wind.value'),
      maxDefault: SummerConfig.max_wind,
    }),
    temperature: normalizeSeasonTemperatureMinMax({
      min: op.get(node, 'min_temperature.value'),
      minDefault: SummerConfig.min_temperature.value,
      max: op.get(node, 'max_temperature.value'),
      maxDefault: SummerConfig.max_temperature.value,
    }),
  };

  !('min_wind' in node) && delete attributes.wind;

  return {
    [SummerConfig.id]: attributes,
  };
};
