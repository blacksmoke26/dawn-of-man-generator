/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import {nanoid} from 'nanoid';

// utils
import {LOGICAL_CONDITION} from '~/utils/condition';
import {toConditionTemplate, toLogicalTemplate} from '~/utils/parser/templates';

// types
import type {GeneralCondition} from '~/types/condition.types';
import type {ChangedValues} from '~/components/scenario/conditions/utils/condition-logical';
import type {
  GoalChangedConditions,
  GoalConditionsAttributes,
  GoalPropConditions,
} from '../types/goal.types';

export const toGoalTemplate = (milestoneId: string, conditions: GoalConditionsAttributes): string => {
  const collection = conditionsToChangedValues(conditions);

  const templates: string[] = [];

  for (const condition of collection) {
    const {type, ...values} = condition;
    const template: string = LOGICAL_CONDITION.includes(type)
      ? toLogicalTemplate(condition as unknown as ChangedValues)
      : toConditionTemplate(type as GeneralCondition, values);

    template.trim() && templates.push(template);
  }

  return !templates.length ? '' : `<goal id="${milestoneId}">` + templates.join('') + '</goal>';
};

export const conditionsToChangedValues = (conditions: GoalConditionsAttributes): GoalChangedConditions => {
  const collection: GoalChangedConditions = [];

  for (const condition of Object.values(conditions)) {
    collection.push(condition);
  }

  return collection;
};

export const propToConditionsAttributes = (conditions: GoalPropConditions): GoalConditionsAttributes => {
  const collection: GoalConditionsAttributes = {};

  for (const condition of conditions) {
    const conditionId: string = nanoid(10).toLowerCase();
    collection[conditionId] = Object.assign({}, condition);
  }

  return collection;
};

// noinspection JSUnusedGlobalSymbols
export const defaultValues = {
  id: 'untitled',
  description: '',
  conditions: [],
  disabled: false,
  disabledCheckbox: false,
  expanded: true,
  onValuesChange: () => {
  },
  onStringsChange: () => {
  },
  onRemoveClick: () => {
  },
  onTemplate: () => {
  },
  onConditionsChange: () => {
  },
};
