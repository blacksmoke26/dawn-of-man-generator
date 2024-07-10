/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-10
 * @version 2.5.0
 */

// utils
import {isKeyInAtt, renderTemplate} from '~/utils/template';
import {toAnyConditionTemplate} from '~/utils/parser/templates';

// types
import {scenario} from '~/data/scenario/parser/types';
import {AnyCondition} from '~/types/condition.types';

export const toGoalTemplate = (goal: scenario.Goal, disabled: boolean = false): string => {
  if (disabled || !goal?.id?.trim?.() || !goal?.conditions?.length) return '';

  const props = [
    `id="${goal.id}"`,
  ];

  isKeyInAtt<scenario.Goal>('showStatus', goal)
  && props.push(`show_status="${''+goal.showStatus}"`)

  const templates: string[] = [];

  for (const condition of goal.conditions) {
    const template: string = toAnyConditionTemplate(condition as AnyCondition);

    template.trim() && templates.push(template);
  }

  return templates.length ? renderTemplate('goal', null, props, templates.join('')) : '';
};

export const toGoalsTemplate = (goals: (scenario.Goal | string)[], disabled: boolean = false): string => {
  if (disabled || !goals?.length) return '';

  const templates: string[] = [];

  for (const goal of goals) {
    if ('string' === typeof goal) {
      goal.trim() && templates.push(goal);
      continue;
    }

    const template = toGoalTemplate(goal);
    template.trim() && templates.push(template);
  }

  return templates.length ? renderTemplate('goals', null, [], templates.join('')) : '';
};
