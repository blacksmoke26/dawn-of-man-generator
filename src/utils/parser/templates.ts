// noinspection HtmlUnknownAttribute

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// types
import type {
  ConditionAnyTasksActive,
  ConditionAnyWorkAreasActive,
  ConditionEntityCountComparison,
  ConditionEntityCountReached,
  ConditionEntityNearMarker,
  ConditionEraUnlocked,
  ConditionInitGame,
  ConditionIsAlive,
  ConditionIsGameInteractionPending,
  ConditionNewGame,
  ConditionScenarioCompleted,
  ConditionTechUnlocked,
  ConditionTimeElapsed,
  ConditionValueEquals,
  ConditionValueReached, LogicalCondition,
} from '~/types/condition.types';
import {Json} from '~/types/json.types';
import {formatPeriod} from '~/utils/scenario/format';

type Attr<T> = T;

const renderTemplate = (type: string, props: string[]): string => {
  return `<condition type="${type}" ${props.join(' ')}/>`;
};

const isKeyInAtt = (key: string, attributes: Json): boolean => {
  return key in attributes
    && attributes[key] !== undefined
    && attributes[key] !== '';
};

/** Render `AnyTasksActive` attributes template */
export const toAnyTasksActiveTemplate = (attributes: Attr<ConditionAnyTasksActive>): string => {
  if (!attributes?.taskType?.trim()) {
    return '';
  }

  const props: string[] = [
    `task_type="${attributes.taskType}"`,
  ];

  isKeyInAtt('minPerformers', attributes)
  && props.push(`min_performers="${attributes.minPerformers}"`);

  return renderTemplate('AnyTasksActive', props);
};

/** Render `AnyWorkAreasActive` attributes template */
export const toAnyWorkAreasActiveTemplate = (attributes: Attr<ConditionAnyWorkAreasActive>): string => {
  if (!attributes?.workAreaId?.trim()) {
    return '';
  }

  const props: string[] = [
    `work_area_id="${attributes.workAreaId}"`,
  ];

  isKeyInAtt('maxWorkers', attributes)
  && props.push(`max_workers="${attributes.maxWorkers}"`);

  return renderTemplate('AnyWorkAreasActive', props);
};

/** Render `EntityCountComparison` attributes template */
export const toEntityCountComparisonTemplate = (attributes: Attr<ConditionEntityCountComparison>): string => {
  if (!attributes?.comparison?.trim()) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('counter', attributes) && props.push(`counter="${attributes.counter}"`);
  isKeyInAtt('entityType', attributes) && props.push(`entity_type="${attributes.entityType}"`);
  isKeyInAtt('value', attributes) && props.push(`value="${attributes.value}"`);
  props.push(`comparison="${attributes.comparison}"`);

  return renderTemplate('EntityCountComparison', props);
};

/** Render `EntityCountReached` attributes template */
export const toEntityCountReachedTemplate = (attributes: Attr<ConditionEntityCountReached>): string => {
  if (!attributes?.entityType?.trim()) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('counter', attributes) && props.push(`counter="${attributes.counter}"`);
  props.push(`entity_type="${attributes.entityType}"`);
  isKeyInAtt('value', attributes) && props.push(`value="${attributes.value}"`);

  return renderTemplate('EntityCountReached', props);
};

/** Render `EntityNearMarker` attributes template */
export const toEntityNearMarkerTemplate = (attributes: Attr<ConditionEntityNearMarker>): string => {
  if (!attributes?.entityType?.trim()) {
    return '';
  }

  const props: string[] = [
    `entity_type="${attributes.entityType}"`,
  ];

  isKeyInAtt('distance', attributes) && props.push(`distance="${attributes.distance}"`);

  return renderTemplate('EntityNearMarker', props);
};

/** Render `EraUnlocked` attributes template */
export const toEraUnlockedTemplate = (attributes: Attr<ConditionEraUnlocked>): string => {
  return !attributes?.era?.trim() ? '' : renderTemplate('EraUnlocked', [
    `era="${attributes.era}"`,
  ]);
};

/** Render `InitGame` attributes template */
export const toInitGameTemplate = (attributes: Attr<ConditionInitGame>): string => {
  return renderTemplate('InitGame', []);
};

/** Render `IsAlive` attributes template */
export const toIsAliveTemplate = (attributes: Attr<ConditionIsAlive>): string => {
  return !attributes?.name?.trim() ? '' : renderTemplate('IsAlive', [
    `name="${attributes.name}"`,
  ]);
};

/** Render `IsGameInteractionPending` attributes template */
export const toIsGameInteractionPendingTemplate = (attributes: Attr<ConditionIsGameInteractionPending>): string => {
  const props: string[] = [];

  isKeyInAtt('value', attributes) && props.push(`value="${attributes.value}"`);

  return renderTemplate('IsGameInteractionPending', props);
};

/** Render `NewGame` attributes template */
export const toNewGameTemplate = (attributes: Attr<ConditionNewGame>): string => {
  const props: string[] = [];

  isKeyInAtt('startMode', attributes) && props.push(`start_mode="${attributes.startMode}"`);

  return renderTemplate('NewGame', props);
};

/** Render `ScenarioCompleted` attributes template */
export const toScenarioCompletedTemplate = (attributes: Attr<ConditionScenarioCompleted>): string => {
  if (!attributes?.id?.trim()) {
    return '';
  }

  const props: string[] = [
    `id="${attributes.id}"`,
  ];

  isKeyInAtt('gameMode', attributes) && props.push(`game_mode="${attributes.gameMode}"`);

  return renderTemplate('ScenarioCompleted', props);
};

/** Render `TechUnlocked` attributes template */
export const toTechUnlockedTemplate = (attributes: Attr<ConditionTechUnlocked>): string => {
  if (!attributes?.tech?.trim() && !attributes?.techs?.length) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('tech', attributes) && props.push(`tech="${attributes.tech}"`);
  isKeyInAtt('techs', attributes) && props.push(`techs="${attributes.techs.join(' ')}"`);

  return renderTemplate('TechUnlocked', props);
};

/** Render `TimeElapsed` attributes template */
export const toTimeElapsedTemplate = (attributes: Attr<ConditionTimeElapsed>): string => {
  const props: string[] = [];
  isKeyInAtt('timer', attributes) && props.push(`timer="${attributes.timer}"`);
  isKeyInAtt('value', attributes) && props.push(`value="${formatPeriod(attributes.value as number)}"`);

  return renderTemplate('TimeElapsed', props);
};

/** Render `ValueEquals` attributes template */
export const toValueEqualsTemplate = (attributes: Attr<ConditionValueEquals>): string => {
  return attributes?.id?.trim() && isKeyInAtt('value', attributes)
    ? renderTemplate('ValueEquals', [
      `id="${attributes.id}"`,
      `value="${attributes.value}"`,
    ])
    : '';
};

/** Render `ValueReached` attributes template */
export const toValueReachedTemplate = (attributes: Attr<ConditionValueReached>): string => {
  if (!attributes?.id?.trim()) {
    return '';
  }

  const props: string[] = [
    `id="${attributes.id}"`,
  ];

  isKeyInAtt('value', attributes) && props.push(`value="${attributes.value}"`);

  return renderTemplate('ValueReached', props);
};

/** Render `LogicalCondition` template */
export const toLogicalTemplate = (type: LogicalCondition, conditions: Json[]) => {
  const subConditions = Object.values(conditions);

  if (!subConditions.length) {
    return '';
  }

  const templates = subConditions
    .map(({template}) => String(template || '').trim())
    .join('');

  if (!templates.trim()) {
    return '';
  }

  return `<condition type="${type}"><sub_conditions>${templates}</sub_conditions></conditions>`
};
