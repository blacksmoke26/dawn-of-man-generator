/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import * as random from './random';

// types
import {Json} from '~/types/json.types';
import type {
  FallSeasonProps,
  SeasonsProp,
  SpringSeasonProps,
  SummerSeasonProps,
  WinterSeasonProps,
} from './seasons.types';
import {environment} from '~/data/environments/parser/types';

export const SpringConfig = {
  id: 'Spring',
  setup_id: 'Spring',
  duration: 0.25,
  precipitation_chance: 0.25,
  windy_chance: 0.5,
  very_windy_chance: 0.1,
  fish_boost: 0.5,
  min_temperature: {
    value: 5,
  },
  max_temperature: {
    value: 25,
  },
};

export const SummerConfig = {
  id: 'Summer',
  setup_id: 'Summer',
  duration: 0.25,
  precipitation_chance: 0.0,
  windy_chance: 0.25,
  min_wind: 0,
  max_wind: 5,
  min_temperature: {
    value: 20,
  },
  max_temperature: {
    value: 35,
  },
};

export const FallConfig = {
  id: 'Fall',
  setup_id: 'Fall',
  duration: 0.25,
  precipitation_chance: 0.25,
  windy_chance: 0.5,
  very_windy_chance: 0.1,
  min_temperature: {
    value: 5,
  },
  max_temperature: {
    value: 25,
  },
};

export const WinterConfig = {
  id: 'Winter',
  setup_id: 'Winter',
  snow_setup_id: 'WinterSnow',
  duration: 0.25,
  precipitation_chance: 0.25,
  windy_chance: 0.5,
  very_windy_chance: 0.1,
  reduced_fauna: true,
  min_temperature: {
    value: -15,
  },
  max_temperature: {
    value: 10,
  },
};

export const toSpringSeasonParsed = (): environment.Seasons['Spring'] => ({
  duration: SpringConfig.duration,
  precipitationChance: SpringConfig.precipitation_chance,
  windyChance: SpringConfig.windy_chance,
  veryWindyChance: SpringConfig.very_windy_chance,
  fishBoost: SpringConfig.fish_boost,
  temperature: [
    SpringConfig.min_temperature.value,
    SpringConfig.max_temperature.value,
  ],
});

export const toSummerSeasonParsed = (): environment.Seasons['Summer'] => ({
  duration: SummerConfig.duration,
  precipitationChance: SummerConfig.precipitation_chance,
  windyChance: SummerConfig.windy_chance,
  wind: [SummerConfig.min_wind, SummerConfig.max_wind],
  temperature: [
    SummerConfig.min_temperature.value,
    SummerConfig.max_temperature.value,
  ],
});

export const toFallSeasonParsed = (): environment.Seasons['Fall'] => ({
  duration: FallConfig.duration,
  precipitationChance: FallConfig.precipitation_chance,
  windyChance: FallConfig.windy_chance,
  veryWindyChance: FallConfig.very_windy_chance,
  temperature: [
    FallConfig.min_temperature.value,
    FallConfig.max_temperature.value,
  ],
});

export const toWinterSeasonParsed = (): environment.Seasons['Winter'] => ({
  duration: WinterConfig.duration,
  precipitationChance: WinterConfig.precipitation_chance,
  windyChance: WinterConfig.windy_chance,
  veryWindyChance: WinterConfig.very_windy_chance,
  reducedFauna: WinterConfig.reduced_fauna,
  temperature: [
    WinterConfig.min_temperature.value,
    WinterConfig.max_temperature.value,
  ],
});

/**
 * @public
 * @static
 * Get all seasons default attributes */
export const seasonsPropsDefault = (): SeasonsProp => ({
  spring: {
    duration: SpringConfig.duration,
    precipitationChance: SpringConfig.precipitation_chance,
    windyChance: SpringConfig.windy_chance,
    veryWindyChance: SpringConfig.very_windy_chance,
    fishBoost: SpringConfig.fish_boost,
    minTemperatureValue: SpringConfig.min_temperature.value,
    maxTemperatureValue: SpringConfig.max_temperature.value,
  },
  summer: {
    duration: SummerConfig.duration,
    precipitationChance: SummerConfig.precipitation_chance,
    windyChance: SummerConfig.windy_chance,
    minTemperatureValue: SummerConfig.min_temperature.value,
    maxTemperatureValue: SummerConfig.max_temperature.value,
    minWind: SummerConfig.min_wind,
    maxWind: SummerConfig.max_wind,
  },
  fall: {
    duration: FallConfig.duration,
    precipitationChance: FallConfig.precipitation_chance,
    windyChance: FallConfig.windy_chance,
    veryWindyChance: FallConfig.very_windy_chance,
    minTemperatureValue: FallConfig.min_temperature.value,
    maxTemperatureValue: FallConfig.max_temperature.value,
  },
  winter: {
    duration: WinterConfig.duration,
    precipitationChance: WinterConfig.precipitation_chance,
    windyChance: WinterConfig.windy_chance,
    veryWindyChance: WinterConfig.very_windy_chance,
    reducedFauna: WinterConfig.reduced_fauna,
    minTemperatureValue: WinterConfig.min_temperature.value,
    maxTemperatureValue: WinterConfig.max_temperature.value,
  },
});

/**
 * @public
 * @static
 * Randomize spring values */
export const randomizeSpring = (): SpringSeasonProps => {
  const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
  return {
    duration: random.randomFloat(),
    precipitationChance: random.randomFloat(),
    windyChance: random.randomFloat(),
    veryWindyChance: random.randomFloat(),
    fishBoost: random.randomFloat(),
    minTemperatureValue, maxTemperatureValue,
  };
};

/**
 * @public
 * @static
 * Randomize summer values */
export const randomizeSummer = (): SummerSeasonProps => {
  const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
  const [minWind, maxWind] = random.randomSeasonWind();
  return {
    duration: random.randomFloat(),
    precipitationChance: random.randomFloat(),
    minWind, maxWind,
    windyChance: random.randomFloat(),
    minTemperatureValue, maxTemperatureValue,
  };
};

/**
 * @public
 * @static
 * Randomize fall values */
export const randomizeFall = (): FallSeasonProps => {
  const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
  return {
    duration: random.randomFloat(),
    precipitationChance: random.randomFloat(),
    windyChance: random.randomFloat(),
    veryWindyChance: random.randomFloat(),
    minTemperatureValue, maxTemperatureValue,
  };
};

/**
 * @public
 * @static
 * Randomize winter values */
export const randomizeWinter = (): WinterSeasonProps => {
  const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
  return {
    duration: random.randomFloat(),
    precipitationChance: random.randomFloat(),
    windyChance: random.randomFloat(),
    veryWindyChance: random.randomFloat(),
    reducedFauna: random.randomArray([true, false], 1)[0],
    minTemperatureValue, maxTemperatureValue,
  };
};

/**
 * @public
 * @static
 * Randomize all seasons attributes */
export const seasonsPropsRandomize = (): SeasonsProp => ({
  spring: randomizeSpring(),
  summer: randomizeSummer(),
  fall: randomizeFall(),
  winter: randomizeWinter(),
});

/**
 * Normalize spring season attributes
 * @param data The data to normalize
 * @return The normalized spring season attributes
 */
export const normalizeSpring = (data: Json): SpringSeasonProps => {
  return {
    duration: data?.duration ?? SpringConfig.duration,
    precipitationChance: data?.precipitation_chance ?? data?.precipitationChance ?? SpringConfig.precipitation_chance,
    windyChance: data?.windyChance ?? data?.windy_chance ?? SpringConfig?.windy_chance,
    veryWindyChance: data?.veryWindyChance ?? data?.very_windy_chance ?? SpringConfig?.very_windy_chance,
    fishBoost: data?.fish_boost?.value ?? data?.fishBoost ?? SpringConfig?.fish_boost,
    minTemperatureValue: data?.minTemperatureValue ?? data?.min_temperature?.value ?? data?.temperature?.[0] ?? SpringConfig?.min_temperature?.value,
    maxTemperatureValue: data?.maxTemperatureValue ?? data?.max_temperature?.value ?? data?.temperature?.[1] ?? SpringConfig?.max_temperature?.value,
  };
};

/**
 * Normalize summer season attributes
 * @param data The data to normalize
 * @return The normalized summer season attributes
 */
export const normalizeSummer = (data: Json): SummerSeasonProps => {
  return {
    duration: data?.duration ?? SummerConfig.duration,
    precipitationChance: data?.precipitation_chance ?? data?.precipitationChance ?? SummerConfig.precipitation_chance,
    minWind: data?.min_wind ?? data?.minWind ?? SummerConfig?.min_wind,
    maxWind: data?.max_wind ?? data?.maxWind ?? SummerConfig?.max_wind,
    windyChance: data?.windy_chance ?? data?.windyChance ?? SummerConfig.windy_chance,
    minTemperatureValue: data?.minTemperatureValue ?? data?.min_temperature?.value ?? data?.temperature?.[0] ?? SummerConfig?.min_temperature?.value,
    maxTemperatureValue: data?.maxTemperatureValue ?? data?.max_temperature?.value ?? data?.temperature?.[1] ?? SummerConfig?.max_temperature?.value,
  };
};

/**
 * Normalize fall season attributes
 * @param data The data to normalize
 * @return The normalized fall season attributes
 */
export const normalizeFall = (data: Json): FallSeasonProps => {
  return {
    duration: data?.duration ?? FallConfig.duration,
    precipitationChance: data?.precipitation_chance ?? data?.precipitationChance ?? FallConfig.precipitation_chance,
    windyChance: data?.windy_chance ?? data?.windyChance ?? FallConfig.windy_chance,
    veryWindyChance: data?.very_windy_chance ?? data?.veryWindyChance ?? FallConfig.very_windy_chance,
    minTemperatureValue: data?.minTemperatureValue ?? data?.min_temperature?.value ?? data?.temperature?.[0] ?? FallConfig?.min_temperature?.value,
    maxTemperatureValue: data?.maxTemperatureValue ?? data?.max_temperature?.value ?? data?.temperature?.[1] ?? FallConfig?.max_temperature?.value,
  };
};

/**
 * Normalize winter season attributes
 * @param data The data to normalize
 * @return The normalized winter season attributes
 */
export const normalizeWinter = (data: Json): WinterSeasonProps => {
  return {
    duration: data?.duration ?? WinterConfig.duration,
    precipitationChance: data?.precipitation_chance ?? data?.precipitationChance ?? WinterConfig.precipitation_chance,
    windyChance: data?.windyChance ?? data?.windy_chance ?? WinterConfig?.windy_chance,
    veryWindyChance: data?.veryWindyChance ?? data?.very_windy_chance ?? WinterConfig?.very_windy_chance,
    minTemperatureValue: data?.minTemperatureValue ?? data?.min_temperature?.value ?? data?.temperature?.[0] ?? WinterConfig?.min_temperature?.value,
    maxTemperatureValue: data?.maxTemperatureValue ?? data?.max_temperature?.value ?? data?.temperature?.[1] ?? WinterConfig?.max_temperature?.value,
    reducedFauna: data?.reducedFauna ?? data?.reduced_fauna ?? WinterConfig?.reduced_fauna,
  };
};
