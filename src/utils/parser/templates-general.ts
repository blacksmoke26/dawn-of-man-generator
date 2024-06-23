/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-21
 * @version 2.3.0
 */

// utils
import {toString} from '~/helpers/string';
import {Season} from '~/utils/seasons.types';
import {Disasters} from '~/types/scenario.types';
import {formatPeriod} from '~/utils/scenario/format';

export const toCategoryTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? `<category value="${value}"/>`
    : '';
};

export const toCustomSettlementNameAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? `<custom_settlement_name_allowed value="${String(value)}"/>`
    : '';
};

export const toGroupIDTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? `<group_id value="${value}"/>`
    : '';
};

export const toHardcoreModeAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? `<hardcore_mode_allowed value="${String(value)}"/>`
    : '';
};

export const toLoadingScreenTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? `<loading_screens values="${value}"/>`
    : '';
};

export const toSizeTemplate = (value: number, allowRender: boolean = true): string => {
  return allowRender && value > 0
    ? `<size value="${value}"/>`
    : '';
};

export const toNomadModeAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? `<nomad_mode_allowed value="${String(value)}"/>`
    : '';
};

export const toRequiredMilestoneTemplate = (value: number = 0, allowRender: boolean = true): string => {
  return allowRender && value > 0
    ? `<required_milestones value="${value}"/>`
    : '';
};

export const toRequiredScenarioTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? `<required_scenario values="${value}"/>`
    : '';
};

export const toShowCompletionIconTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? `<show_completion_icon value="${String(value)}"/>`
    : '';
};

export const toStartingConditionTemplate = (values: {
  seasonId: Season,
  visualSetupId?: string
}, allowRender: boolean = true): string => {
  if (!allowRender) {
    return '';
  }

  const visualSetupId = values?.visualSetupId?.trim()
    ? ` visual_setup_id="${values?.visualSetupId?.trim()}"` : '';

  return `<starting_conditions season_id="${values.seasonId}"${visualSetupId}/>`;
};

export const toVisualTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? `<visible value="${String(value)}"/>`
    : '';
};

export const toDisasterTemplate = (name: Disasters, values: {
  period: number | string;
  variance: number | string;
}, allowRender: boolean = true): string => {
  return !allowRender || !String(name || '').trim()
    ? ''
    : `<disaster ${[
      `disaster_type="${name}"`,
      `period="${formatPeriod(values.period)}"`,
      `variance="${formatPeriod(values.variance)}"`,
    ].join(' ')}/>`;
};

export interface DisasterNode {
  name: Disasters;
  period: number | string;
  variance: number | string;
  allowRender?: boolean;
}

export const toDisastersTemplate = (disasters: DisasterNode[], allowRender: boolean = true): string => {
  if (!allowRender || disasters.length === 0) {
    return '';
  }

  const templates: string[] = [];

  disasters.forEach(disaster => {
    const {name, variance, period, allowRender: shouldRender = true} = disaster;
    const template = toDisasterTemplate(name, {period, variance}, shouldRender).trim();
    template && templates.push(template);
  });

  return templates.length
    ? `<disasters>${templates.join('')}</disasters>`
    : '';
};
