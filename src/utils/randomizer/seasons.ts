/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-09
 * @version 2.5.0
 */

// utils
import {onlyKeys} from '~/helpers/object';

// types
import {environment} from '~/data/environments/parser/types';

export const SpringConfig: environment.season.SpringConfig = {
  id: 'Spring',
  setupId: 'Spring',
  duration: 0.25,
  precipitationChance: 0.25,
  windyChance: 0.5,
  veryWindyChance: 0.1,
  fishBoost: 0.5,
  temperature: [5, 25],
};

export const SummerWind: environment.season.SummerConfig['wind'] = [10, 25];

export const SummerConfig: environment.season.SummerConfig = {
  id: 'Summer',
  setupId: 'Summer',
  duration: 0.25,
  precipitationChance: 0,
  windyChance: 0.25,
  temperature: [20, 35],
};

export const SummerFullConfig: Required<environment.season.SummerConfig> = {
  ...SummerConfig,
  wind: SummerWind,
};

export const FallConfig: environment.season.FallConfig = {
  id: 'Fall',
  setupId: 'Fall',
  duration: 0.25,
  precipitationChance: 0.25,
  windyChance: 0.5,
  veryWindyChance: 0.1,
  temperature: [5, 25],
};

export const WinterConfig: environment.season.WinterConfig = {
  id: 'Winter',
  setupId: 'Winter',
  snowSetupId: 'WinterSnow',
  duration: 0.25,
  precipitationChance: 0.25,
  windyChance: 0.5,
  veryWindyChance: 0.1,
  reducedFauna: true,
  temperature: [-15, 10],
};

export const SeasonsDefault: environment.season.Seasons = {
  Spring: onlyKeys(SpringConfig, ['id', 'setupId'], true),
  Fall: onlyKeys(FallConfig, ['id', 'setupId'], true),
  Summer: onlyKeys(SummerConfig, ['id', 'setupId'], true),
  Winter: onlyKeys(WinterConfig, ['id', 'setupId', 'snowSetupId'], true),
}
