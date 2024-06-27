/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {EntityType, TechEntityType} from './entity.types';

export type LogicalCondition =
  | 'And'
  | 'Not'
  | 'Or';

export type ComparisonType =
  | 'Less'
  | 'LessOrEquals'
  | 'Equals'
  | 'GreaterOrEquals'
  | 'Greater';

export type EraType =
  | 'Paleolithic'
  | 'Mesolithic'
  | 'Neolithic'
  | 'CopperAge'
  | 'BronzeAge'
  | 'IronAge';

export type GeneralCondition =
  | 'AnyTasksActive'
  | 'AnyWorkAreasActive'
  | 'EntityCountComparison'
  | 'EntityCountReached'
  | 'EntityNearMarker'
  | 'EraUnlocked'
  | 'InitGame'
  | 'IsAlive'
  | 'IsGameInteractionPending'
  | 'NewGame'
  | 'ScenarioCompleted'
  | 'TechUnlocked'
  | 'TimeElapsed'
  | 'ValueEquals'
  | 'ValueReached';

export type GeneralConditionKey =
  | 'anyTasksActive'
  | 'anyWorkAreasActive'
  | 'entityCountComparison'
  | 'entityCountReached'
  | 'entityNearMarker'
  | 'eraUnlocked'
  | 'initGame'
  | 'isAlive'
  | 'isGameInteractionPending'
  | 'newGame'
  | 'scenarioCompleted'
  | 'techUnlocked'
  | 'timeElapsed'
  | 'valueEquals'
  | 'valueReached';

export type CounterType =
  | 'All'
  | 'PlayerEntities'
  | 'KilledRaiders'
  | 'HuntedAnimals'
  | 'ProducedResources'
  | 'BuiltStructures'
  | 'AliveAnimals'
  | 'DeadAnimals'
  | 'DeadResidents'
  | 'PredictedAmount'
  | 'LockedTechs'
  | 'ContinuousAmount';

export type StartMode =
  | 'Settled'
  | 'Nomad';

export type GameMode =
  | 'Normal'
  | 'Hardcore';

export type TimeElapsed =
  | 'GameTime'
  | 'RealTime'
  | 'EraRealTime'
  | 'IdleTime'
  | 'MessageTime'
  | 'EventTriggeredTime'
  | 'GoalsCompletedTime'
  | 'PrimalVisionTime';

export type ValueEqualsType =
  | 'Population'
  | 'DomesticAnimalCount'
  | 'CompletedMilestones'
  | 'CompletedHardcoreMilestones'
  | 'CompletedChallenges'
  | 'CompletedHardcoreChallenges'
  | 'Prestige'
  | 'ResidentCount'
  | 'KnowledgeAmount'
  | 'GameSpeed'
  | 'CurrentScenario'
  | 'CurrentEnvironment'
  | 'CurrentEra'
  | 'CurrentSuperEra'
  | 'CurrentGameState'
  | 'CurrentGameMode'
  | 'CurrentStartMode';

export type ValueReachedType =
  | 'Population'
  | 'DomesticAnimalCount'
  | 'CompletedMilestones'
  | 'CompletedHardcoreMilestones'
  | 'CompletedChallenges'
  | 'CompletedHardcoreChallenges'
  | 'Prestige'
  | 'ResidentCount'
  | 'KnowledgeAmount'
  | 'GameSpeed'
  | 'CameraDistanceMoved'
  | 'CameraAngleRotated';

export type InteractionType =
  | 'None'
  | 'CustomizePanels';

export type ConditionName = LogicalCondition | GeneralCondition;

export interface ConditionAnd {
  subConditions: SubConditions;
}

export interface ConditionAnyTasksActive {
  taskType: string;
  /** @default 0 */
  minPerformers?: number;
}

export interface ConditionAnyWorkAreasActive {
  workAreaId: string;
  /** @default 1 */
  maxWorkers?: number;
}

export interface ConditionEntityCountComparison {
  /** * @default 'All' */
  counter?: CounterType;
  entityType?: EntityType;
  /** * @default MaxInt */
  value?: number;
  comparison: ComparisonType;
}

export interface ConditionEntityCountReached {
  /** * @default 'All' */
  counter?: CounterType;
  entityType: EntityType;
  /** * @default MaxInt */
  value?: number;
}

export interface ConditionEntityNearMarker {
  entityType: EntityType;
  /**
   * Decimal Number
   * @default 20
   */
  distance?: number;
}

export interface ConditionEraUnlocked {
  era: EraType;
}

export interface ConditionInitGame {
  /** No parameters */
}

export interface ConditionIsAlive {
  name: string;
}

export interface ConditionIsGameInteractionPending {
  /** @default 'None' */
  value?: InteractionType;
}

export interface ConditionNewGame {
  startMode?: StartMode;
}

export interface ConditionNot {
  subConditions: SubConditions;
}

export interface ConditionOr {
  subConditions: SubConditions;
}

export interface ConditionScenarioCompleted {
  id: string;
  /** @default 'Normal' */
  gameMode?: GameMode;
}

export interface ConditionTechUnlocked {
  tech: TechEntityType;
  /** Space seperated values of `TechEntityType` <br>
   * e.g., 'armor' or 'armor baking ...' */
  techs: TechEntityType[];
}

export interface ConditionTimeElapsed {
  /**
   * @default 'RealTime' */
  timer?: TimeElapsed;
  /** Time Value
   * @default 0 */
  value?: number;
}

export interface ConditionValueEquals {
  id: ValueEqualsType;
  value: string;
}

export interface ConditionValueReached {
  id: ValueReachedType;
  /**
   * @default MaxInt */
  value?: number;
}

export type ConditionType =
  | Condition<ConditionAnyTasksActive>
  | Condition<ConditionAnyWorkAreasActive>
  | Condition<ConditionEntityCountComparison>
  | Condition<ConditionEntityCountReached>
  | Condition<ConditionEntityNearMarker>
  | Condition<ConditionEraUnlocked>
  | Condition<ConditionInitGame>
  | Condition<ConditionIsAlive>
  | Condition<ConditionIsGameInteractionPending>
  | Condition<ConditionNewGame>
  | Condition<ConditionScenarioCompleted>
  | Condition<ConditionTechUnlocked>
  | Condition<ConditionTimeElapsed>
  | Condition<ConditionValueEquals>
  | Condition<ConditionValueReached>;

export type ConditionParams<Condition> = {
  [Property in keyof Condition]: Condition[Property];
};

export type SubConditions = ConditionType[];

export type Condition<O> = {
  internalName: string;
  type: LogicalCondition | GeneralCondition;
} & ConditionParams<O>;

export interface ConditionDefaultParams {
  anyTasksActive: ConditionAnyTasksActive,
  anyWorkAreasActive: ConditionAnyWorkAreasActive,
  entityCountComparison: ConditionEntityCountComparison,
  entityCountReached: ConditionEntityCountReached,
  entityNearMarker: ConditionEntityNearMarker,
  eraUnlocked: ConditionEraUnlocked,
  initGame: ConditionInitGame,
  isAlive: ConditionIsAlive,
  isGameInteractionPending: ConditionIsGameInteractionPending,
  newGame: ConditionNewGame,
  scenarioCompleted: ConditionScenarioCompleted,
  techUnlocked: ConditionTechUnlocked,
  timeElapsed: ConditionTimeElapsed,
  valueEquals: ConditionValueEquals,
  valueReached: ConditionValueReached,
}

export type ConditionWithType<N = GeneralCondition, C extends object = object> = {
  type: N;
} & C;

export type AnyLogicalCondition = {
  type: LogicalCondition;
  conditions: AnyGeneralCondition[];
}

export type AnyGeneralCondition =
  | ConditionWithType<'AnyTasksActive', ConditionAnyTasksActive>
  | ConditionWithType<'AnyWorkAreasActive', ConditionAnyWorkAreasActive>
  | ConditionWithType<'EntityCountComparison', ConditionEntityCountComparison>
  | ConditionWithType<'EntityCountReached', ConditionEntityCountReached>
  | ConditionWithType<'EntityNearMarker', ConditionEntityNearMarker>
  | ConditionWithType<'EraUnlocked', ConditionEraUnlocked>
  | ConditionWithType<'InitGame', ConditionInitGame>
  | ConditionWithType<'IsAlive', ConditionIsAlive>
  | ConditionWithType<'IsGameInteractionPending', ConditionIsGameInteractionPending>
  | ConditionWithType<'NewGame', ConditionNewGame>
  | ConditionWithType<'ScenarioCompleted', ConditionScenarioCompleted>
  | ConditionWithType<'TechUnlocked', ConditionTechUnlocked>
  | ConditionWithType<'TimeElapsed', ConditionTimeElapsed>
  | ConditionWithType<'ValueEquals', ConditionValueEquals>
  | ConditionWithType<'ValueReached', ConditionValueReached>;

export type AnyCondition = | AnyLogicalCondition | AnyGeneralCondition;

export interface ConditionAttributesProps {
  enabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

export interface ConditionTemplateProps<T> {
  values?: Partial<T>;

  onValuesChange?(values: Partial<T>): void;

  onTemplate?(template: string): void;

  onChange?(values: ConditionAttributesProps): void;
}

export interface ConditionProps<T> extends ConditionAttributesProps, ConditionTemplateProps<T> {
  removeIcon?: boolean;
  showCheckbox?: boolean;
  initialValues?: Partial<T>;

  onRemoveClick?(): void;
}
