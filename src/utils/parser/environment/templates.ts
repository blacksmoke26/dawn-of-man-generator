/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

// utils
import {isNumeric} from '~/helpers/number';

// types
import {KVDocument} from '~/types/json.types';
import {environment} from '~/data/environments/parser/types';
import {ObjectTemplateAttributes, ObjectType} from '~/utils/objects';

/** Render `noise_amplitudes` xml template */
export const toNoiseAmplitudesTemplate = (values: number[], disabled: boolean = false): string => {
  return !disabled && values?.length >= 1
    ? `<noise_amplitudes values="${values.join(' ')}"/>`
    : '';
};

/** Render `backdrop_scale` xml template */
export const toBackdropScaleTemplate = (values: [number, number, number], disabled: boolean = false): string => {
  return !disabled && values?.length === 3
    ? `<backdrop_scale value="${values.join(' ')}"/>`
    : '';
};

/** Render `distance_height_offset` xml template */
export const toDistanceHeightOffsetTemplate = (value: number, disabled: boolean = false): string => {
  return !disabled
    ? `<distance_height_offset value="${value}"/>`
    : '';
};

/** Render `ford_distance_factor` xml template */
export const toFordDistanceFactorTemplate = (value: number, disabled: boolean = false): string => {
  return !disabled
    ? `<ford_distance_factor value="${value}"/>`
    : '';
};

/** Render `sun_angle_factor` xml template */
export const toSunAngleFactorTemplate = (value: number, disabled: boolean = false): string => {
  return !disabled
    ? `<sun_angle_factor value="${value}"/>`
    : '';
};

/** Render `global_tree_density` xml template */
export const toGlobalTreeDensityTemplate = (value: number, disabled: boolean = false): string => {
  return !disabled
    ? `<global_tree_density value="${value}"/>`
    : '';
};

/** Render `trees` xml template */
export const toTreesTemplate = (names: string[], disabled: boolean): string => {
  return !names.length || disabled
    ? ''
    : `<trees values="${names.join(' ')}"/>`;
};

/** Render `trees_everywhere` xml template */
export const toTreesEverywhereTemplate = (value: boolean, disabled: boolean): string => {
  return !disabled ? `<trees_everywhere value="${'' + value}"/>` : '';
};

/** Render `ford_distance_factor` xml template */
export const toResourceFactorTemplate = (value: number, disabled: boolean = false): string => {
  return !disabled
    ? `<resource_factor value="${value}"/>`
    : '';
};

/** Render `deposits` xml template */
export const toDepositsTemplate = (names: string[], disabled: boolean = false): string => {
  return !disabled
    ? `<deposits values="${names.join(' ')}"/>`
    : '';
};
export const toOverridePrototypeTemplate = (
  type: ObjectType, name: string, values: ObjectTemplateAttributes, allowRender: boolean = true,
): string => {
  if (!allowRender || !Object.keys(values).length || !name.trim()) {
    return '';
  }

  const template: string[] = [];

  isNumeric(values?.density) && template.push(`<density value="${values?.density}" />`);

  (Array.isArray(values?.altitude) && values?.altitude?.length === 2)
  && template.push(
    `<min_altitude value="${values?.altitude[0]}" />`
    + `<max_altitude value="${values?.altitude[1]}"/>`,
  );

  (Array.isArray(values?.angle) && values?.angle?.length === 2)
  && template.push(
    `<min_angle value="${values?.angle[0]}" />`
    + `<max_angle value="${values?.angle[1]}"/>`,
  );

  (Array.isArray(values?.humidity) && values?.humidity?.length === 2)
  && template.push(
    `<min_humidity value="${values?.humidity[0]}" />`
    + `<max_humidity value="${values?.humidity[1]}"/>`,
  );

  return !template.length ? '' : (
    `<${type}_override_prototype><id value="${name}"/>${template.join('')}</${type}_override_prototype>`
  );
};

export const toOverridePrototypesTemplate = (
  type: ObjectType, values: KVDocument<ObjectTemplateAttributes>, allowRender: boolean = true,
): string => {
  if (!allowRender || !Object.keys(values).length) {
    return '';
  }

  const templates: string[] = [];

  for (const [name, attributes] of Object.entries(values)) {
    const template = toOverridePrototypeTemplate(type, name, attributes).trim();
    template && templates.push(template);
  }

  return !templates.length ? '' : (
    `<${type}_override_prototypes>${templates.join('')}</${type}_override_prototypes>`
  );
};

/** Generate `spring` season xml code */
export const toSeasonSpringTemplate = (attributes: environment.SpringSeason, disabled: boolean = false): string => {
  return !disabled ? (
    `<season id="Spring" setup_id="Spring"
				duration="${attributes.duration}"
				precipitation_chance="${attributes.precipitationChance}"
				windy_chance="${attributes.windyChance}"
				very_windy_chance="${attributes.veryWindyChance}" fish_boost="${attributes.fishBoost}">
					<min_temperature value="${attributes?.temperature[0]}"/>
					<max_temperature value="${attributes?.temperature[1]}"/>
			</season>`
  ) : '';
};

/** Generate `summer` season xml code */
export const toSeasonSummerTemplate = (attributes: environment.SummerSeason, disabled: boolean = false): string => {
  if (disabled) {
    return '';
  }

  const windTemplate: string = Array.isArray(attributes?.wind)
    ? `<min_wind value="${attributes.wind[0]}" /><max_wind value="${attributes.wind[1]}"/>`
    : '';

  return (
    `<season id="Summer" setup_id="Summer"
				duration="${attributes.duration}"
				precipitation_chance="${attributes.precipitationChance}"
				windy_chance="${attributes.windyChance}">
				  ${windTemplate}
					<min_temperature value="${attributes?.temperature[0]}"/>
					<max_temperature value="${attributes?.temperature[1]}"/>
			</season>`
  );
};

/** Generate `fall` season xml code */
export const toSeasonFallTemplate = (attributes: environment.FallSeason, disabled: boolean = false): string => {
  return !disabled ? (
    `<season id="Fall" setup_id="Fall"
				duration="${attributes.duration}"
				precipitation_chance="${attributes.precipitationChance}"
				windy_chance="${attributes.windyChance}"
				very_windy_chance="${attributes.veryWindyChance}">
					<min_temperature value="${attributes?.temperature[0]}"/>
					<max_temperature value="${attributes?.temperature[1]}"/>
			</season>`
  ) : '';
};

/** Generate `winter` season xml code */
export const toSeasonWinterTemplate = (attributes: environment.WinterSeason, disabled: boolean = false): string => {
  return !disabled ? (
    `<season id="Winter" setup_id="Winter"
				snow_setup_id="WinterSnow"
				duration="${attributes.duration}"
				precipitation_chance="${attributes.precipitationChance}"
				windy_chance="${attributes.windyChance}"
				very_windy_chance="${attributes.veryWindyChance}"
				reduced_fauna="${'' + attributes.reducedFauna}">
					<min_temperature value="${attributes?.temperature[0]}"/>
					<max_temperature value="${attributes?.temperature[1]}"/>
			</season>`
  ) : '';
};

/** Renders `seasons` xml template */
export const toSeasonsTemplate = (template: string, disabled: boolean = false): string => {
  return !disabled && template.trim()
    ? `<seasons>${template}</seasons>` : '';
};
