/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {nanoid} from 'nanoid';

// utils
import {LOGICAL_CONDITION} from '~/utils/condition';
import {toConditionTemplate, toLogicalTemplate} from '~/utils/parser/templates';

// types
import type {GeneralCondition} from '~/types/condition.types';
import type {ChangedValues} from '~/components/scenario/conditions/utils/condition-logical';
import type {
  MilestoneChangedConditions,
  MilestoneConditionsAttributes,
  MilestonePropConditions,
} from '../types/milestone.types';

export const toMilestoneTemplate = (milestoneId: string, conditions: MilestoneConditionsAttributes): string => {
  const collection = conditionsToChangedValues(conditions);

  const templates: string[] = [];

  for (const condition of collection) {
    const {type, ...values} = condition;
    const template: string = LOGICAL_CONDITION.includes(type)
      ? toLogicalTemplate(condition as unknown as ChangedValues)
      : toConditionTemplate(type as GeneralCondition, values);

    template.trim() && templates.push(template);
  }

  return !templates.length ? '' : `<milestone id="${milestoneId}">` + templates.join('') + '</milestone>';
};

export const conditionsToChangedValues = (conditions: MilestoneConditionsAttributes): MilestoneChangedConditions => {
  const collection: MilestoneChangedConditions = [];

  for (const condition of Object.values(conditions)) {
    collection.push(condition);
  }

  return collection;
};

export const propToConditionsAttributes = (conditions: MilestonePropConditions): MilestoneConditionsAttributes => {
  const collection: MilestoneConditionsAttributes = {};

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
