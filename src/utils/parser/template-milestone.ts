/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-10
 * @version 2.5.0
 */

// utils
import {renderTemplate} from '~/utils/template';
import {LOGICAL_CONDITION} from '~/utils/condition';
import {toConditionTemplate, toLogicalTemplate} from '~/utils/parser/templates';

// types
import {scenario} from '~/data/scenario/parser/types';
import {GeneralCondition} from '~/types/condition.types';
import {ChangedValues} from '~/components/scenario/conditions/utils/condition-logical';

export const toMilestoneTemplate = (milestone: scenario.Milestone, disabled: boolean = false): string => {
  if (disabled || !milestone?.id?.trim?.() || !milestone?.conditions?.length) return '';

  const props = [
    `id="${milestone.id}"`,
  ];

  const templates: string[] = [];

  for (const condition of milestone.conditions) {
    const {type, ...values} = condition;
    const template: string = LOGICAL_CONDITION.includes(type as string)
      ? toLogicalTemplate(condition as unknown as ChangedValues)
      : toConditionTemplate(type as GeneralCondition, values);

    template.trim() && templates.push(template);
  }

  return templates.length ? renderTemplate('milestone', null, props, templates.join('')) : '';
};

export const toMilestonesTemplate = (milestones: (scenario.Milestone | string)[], disabled: boolean = false): string => {
  if (disabled || !milestones?.length) return '';

  const templates: string[] = [];

  for (const milestone of milestones) {
    if ('string' === typeof milestone) {
      milestone.trim() && templates.push(milestone);
      continue;
    }

    const template = toMilestoneTemplate(milestone);
    template.trim() && templates.push(template);
  }

  return templates.length ? renderTemplate('milestones', null, [], templates.join('')) : '';
};
