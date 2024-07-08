/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-21
 * @version 2.3.0
 */

// utils
import {toString} from '~/helpers/string';
import {renderTemplate} from '~/utils/template';
import {formatPeriod} from '~/utils/scenario/format';

// types
import {scenario} from '~/data/scenario/parser/types';

export const toCategoryTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? renderTemplate('category', null, [`value="${value}"`])
    : '';
};

export const toCustomSettlementNameAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? renderTemplate('custom_settlement_name_allowed', null, [`value="${''+value}"`])
    : '';
};

export const toGroupIDTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? renderTemplate('group_id', null, [`value="${value}"`])
    : '';
};

export const toHardcoreModeAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? renderTemplate('hardcore_mode_allowed', null, [`value="${''+value}"`])
    : '';
};

export const toLoadingScreenTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? renderTemplate('loading_screens', null, [`values="${value}"`])
    : '';
};

export const toSizeTemplate = (value: number, allowRender: boolean = true): string => {
  return allowRender && value
    ? renderTemplate('size', null, [`value="${value}"`])
    : '';
};

export const toNomadModeAllowedTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? renderTemplate('nomad_mode_allowed', null, [`value="${'' + value}"`])
    : '';
};

export const toRequiredMilestoneTemplate = (value: number = 0, allowRender: boolean = true): string => {
  return allowRender && value
    ? renderTemplate('required_milestones', null, [`value="${value}"`])
    : '';
};

export const toRequiredScenarioTemplate = (value: string, allowRender: boolean = true): string => {
  return allowRender && toString(value).trim()
    ? renderTemplate('required_scenario', null, [`values="${value}"`])
    : '';
};

export const toShowCompletionIconTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? renderTemplate('show_completion_icon', null, [`value="${'' + value}"`])
    : '';
};

export const toStartingConditionTemplate = (values: scenario.StartingConditions, allowRender: boolean = true): string => {
  if (!allowRender) {
    return '';
  }

  const props: string[] = [
    `season_id="${values.seasonId}"`
  ];

  if (values?.visualSetupId?.trim()) {
    props.push(`visual_setup_id="${values?.visualSetupId}"`);
  }

  return renderTemplate('starting_conditions', null, props);
};

export const toVisualTemplate = (value: boolean = false, allowRender: boolean = true): string => {
  return allowRender
    ? renderTemplate('visible', null, [`value="${'' + value}"`])
    : '';
};

export const toDisasterTemplate = (values: scenario.Disaster, allowRender: boolean = true): string => {
  return !allowRender
    ? ''
    : renderTemplate('disaster', null, [
      `disaster_type="${values.disasterType}"`,
      `period="${formatPeriod(values.period)}"`,
      `variance="${formatPeriod(values.variance)}"`,
    ]);
};

export const toDisastersTemplate = (disasters: (string | scenario.Disaster)[], allowRender: boolean = true): string => {
  if (!allowRender || !disasters) {
    return '';
  }

  const templates: string[] = [];

  disasters.forEach(disaster => {
    templates.push(
      'string' === typeof disaster
        ? disaster
        : toDisasterTemplate(disaster),
    );
  });

  return templates.length
    ? renderTemplate('disasters', null, [], templates.join(''))
    : '';
};
