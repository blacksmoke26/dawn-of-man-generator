/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// utils
import {
  LOCK_FLAGS,
  FEATURE_TYPE,
  MARKER_TYPES,
  WEATHER_TYPES,
  LOCATION_TYPE,
  REF_POSITIONS,
  GAMEPLAY_FLAGS,
  UI_MARKER_TYPES,
  UI_CONTEXT_ACTIONS,
  DANGER_LEVEL_TYPES,
  BUILDABLE_CATEGORIES,
  GENDER_TYPES, SPAWN_TYPES,
  BEHAVIOUR_TYPES, AGE_TYPES,
  PLACEMENT_TYPES, ACTIONS_NAME,
} from '~/utils/action';

// types
import type {EraType} from '~/types/condition.types';
import type {AnimalEntityType, EntityType, TechEntityType} from '~/types/entity.types';

// public types
export type AgeType = typeof AGE_TYPES[number];
export type LockFlag = typeof LOCK_FLAGS[number];
export type SpawnType = typeof SPAWN_TYPES[number];
export type MarkerType = typeof MARKER_TYPES[number];
export type GenderType = typeof GENDER_TYPES[number];
export type FeatureType = typeof FEATURE_TYPE[number];
export type WeatherType = typeof WEATHER_TYPES[number];
export type RefPosition = typeof REF_POSITIONS[number];
export type LocationType = typeof LOCATION_TYPE[number];
export type GameplayFlag = typeof GAMEPLAY_FLAGS[number];
export type UiMarkerType = typeof UI_MARKER_TYPES[number];
export type BehaviourType = typeof BEHAVIOUR_TYPES[number];
export type PlacementType = typeof PLACEMENT_TYPES[number];
export type UiContextAction = typeof UI_CONTEXT_ACTIONS[number];
export type DangerLevelType = typeof DANGER_LEVEL_TYPES[number];
export type BuildableCategories = typeof BUILDABLE_CATEGORIES[number];

export type EraFactor = [number, number?, number?, number?, number?, number?];

export interface ActionClearGoals {
  /** No parameters */
}

export interface ActionClearLocationMarkers {
  /** No parameters */
}

export interface ActionClearTrees {
  /**
   * Decimal Number
   * @default 30
   */
  radius: number;
  /**
   * 2D Vector
   * @default (0.0, 0.0) */
  position?: [number, number];
}

export interface ActionClearUiMarkers {
  /** No parameters */
}

export interface ActionFocusCamera {
  location: LocationType;
  entityName: string;
  /**
   * Decimal Number
   * @default 40
   */
  distance?: number;
  /**
   * Decimal Number
   * @default 0
   */
  rotation?: number;
}

export interface ActionHideUi {
  entityTypes: EntityType[];
  buildableCategories: BuildableCategories;
  /**
   * @default false
   */
  hideDisabledUi?: boolean;
  /**
   * @default false
   */
  hideQuickPanels?: boolean;
}

export interface ActionModifyLocation {
  /**
   * Integer Number
   * @default -1 */
  locationIndex?: number;
  /**
   * 3D Vector
   * @default [(0.0, 0.0, 0.0] */
  position?: [number, number, number];

  modification: string; // TODO Check for `MakeNodeShallow` type
}

export interface ActionQuitGame {
  /** @default true */
  success?: boolean;
}

export interface ActionSetAnimalPopulation {
  animalType?: AnimalEntityType;
  animalTypes?: AnimalEntityType[];
  /**
   * Integer Number
   * @default 0 */
  min?: number;
  /**
   * Integer Number
   * @default 0 */
  max?: number;
  eraFactors?: EraFactor;
}

export interface ActionSetBirthParameters {
  /**
   * Integer Number
   * @default 150 */
  decreaseStartPopulation?: number;
  /**
   * Integer Number
   * @default 100 */
  decreaseHalfingPopulation?: number;
}

export interface ActionSetDiseaseParameters {
  /**
   * Time Value
   * @default 1.5 */
  period?: number;
  /**
   * Time Value
   * @default 0.5 */
  variance?: number;
  /**
   * Decimal Number
   * @default 0.5 */
  individualDiseaseChance?: number;
}

export interface ActionSetFeatureEnabled {
  feature: FeatureType;
  /** @default false */
  value?: boolean;
}

export interface ActionSetGameplayFlags {
  /** @default 'None' */
  flags: GameplayFlag;
  controllableAnimal?: AnimalEntityType;
}

export interface ActionSetGoal {
  id: string;
}

export interface ActionSetGoalsHint {
  value: string;
}

export interface ActionSetKnowledgeParameters {
  /**
   * Decimal Number
   * @default 1 */
  techCostMultiplier: number;
}

export interface ActionSetLocationMarker {
  /** @default 'NearestBank' */
  markerType?: MarkerType;
  entityType: EntityType;
  requiredGoal?: string;
  excludedGoal?: string;
  workAreaId: string;
  /** @default [0, 0] */
  position?: [number, number];
  /**
   * Decimal Number
   * @default 4 */
  scale?: number;
  /** @default 'Settlement' */
  refPosition?: RefPosition;
}

export interface ActionSetMigrationParameters {
  /**
   * Decimal Number
   * @default 1 */
  min?: number;
  /**
   * Decimal Number
   * @default 1 */
  max?: number;
  /**
   * Time Value
   * @default 0.5 */
  period?: number;
  /**
   * Integer Number
   * @default 50 */
  decreaseStartPopulation?: number;
  /**
   * Integer Number
   * @default 50 */
  decreaseHalfingPopulation?: number;
}

export interface RaidWaveParameters {
  shieldRatio?: number;
  armorRatio?: number;
  disabledTechs?: TechEntityType[];
}

export interface ActionSetRaider {
  /** @default 'Paleolithic' */
  era?: EraType;
  /**
   * Time Value (Decimal), e.g. '10y'
   * @default MAX_FLOAT */
  hardcoreTimer?: number;
  entityTypes: EntityType[];
  /**
   * Decimal Number
   * @default 1 */
  min?: number;
  /**
   * Decimal Number
   * @default 1 */
  max?: number;
  /** Decimal Numbers */
  mins?: number[];
  /** Decimal Numbers */
  maxes?: number[];
  /**
   * Integer Number
   * @default 0 */
  extraRaiderPerPopulation?: number;
  /**
   * Time Value
   * @default 1 */
  gracePeriod?: number;
  /**
   * Time Value
   * @default 1.5 */
  period?: number;
  /**
   * Time Value
   * @default 0.5 */
  variance?: number;
  /** @default [] */
  waves?: RaidWaveParameters[];
}

export interface ActionSetTimeOfYear {
  /**
   * Decimal Number
   * @default 0 */
  value?: number;
}

export interface ActionSetTimeScale {
  /**
   * Decimal Number
   * @default 0 */
  index?: number;
}

export interface ActionSetTraderPeriod {
  /**
   * Time value
   * @default 0 */
  value?: number;
}

export interface ActionSetUiLocked {
  /** @default 'None' */
  lockFlags?: LockFlag;
}

export interface ActionSetUiMarker {
  /** @default 'Build' */
  markerType?: UiMarkerType;
  entityType: EntityType;
  contextAction: UiContextAction;
  workAreaId: string;
  excludedGoal?: string;
  requiredGoal?: string;
  /** @default 'VeryHigh' */
  maxDangerLevel?: DangerLevelType;
}

export interface ActionSetWeather {
  /** @default 'Sunny' */
  value?: WeatherType;
}

export interface ActionShowMessage {
  title: string;
  text: string;
}

export interface ActionSpawn {
  entityType: EntityType;
  placement: | PlacementType | string;
  /**
   * Integer Number
   * @default 1 */
  amount: number;
  /**
   * Decimal Number
   * @default 60 */
  angle?: number;
  /**
   * Decimal Number
   * @default 10 */
  radius?: number;
  age?: AgeType;
  /**
   * Integer Number
   * @default 0 */
  yearsOld?: number;
  gender?: GenderType;
  name?: string;
  /** 2D Vector
   * @default [0, 0] */
  position?: [number, number];
  /** @default 'Auto' */
  spawnType?: SpawnType;
  /** @default 'None' */
  behaviour?: BehaviourType;
}

export interface ActionTriggerRaiderAttack {
  /**
   * Integer Number
   * @default 1 */
  amount?: number;
}

export interface ActionUnlock {
  techType: TechEntityType;
  techEra: EraType;
}

export type ActionName = typeof ACTIONS_NAME[number];

export type ActionWithType<Name = ActionName, Action extends object = object> = {
  type: Name;
} & Action;

export type AnyAction =
  | ActionWithType<'ClearGoals', ActionClearGoals>
  | ActionWithType<'ClearLocationMarkers', ActionClearLocationMarkers>
  | ActionWithType<'ClearTrees', ActionClearTrees>
  | ActionWithType<'ClearUiMarkers', ActionClearUiMarkers>
  | ActionWithType<'FocusCamera', ActionFocusCamera>
  | ActionWithType<'HideUi', ActionHideUi>
  | ActionWithType<'ModifyLocation', ActionModifyLocation>
  | ActionWithType<'QuitGame', ActionQuitGame>
  | ActionWithType<'SetAnimalPopulation', ActionSetAnimalPopulation>
  | ActionWithType<'SetBirthParameters', ActionSetBirthParameters>
  | ActionWithType<'SetDiseaseParameters', ActionSetDiseaseParameters>
  | ActionWithType<'SetFeatureEnabled', ActionSetFeatureEnabled>
  | ActionWithType<'SetGameplayFlags', ActionSetGameplayFlags>
  | ActionWithType<'SetGoal', ActionSetGoal>
  | ActionWithType<'SetGoalsHint', ActionSetGoalsHint>
  | ActionWithType<'SetKnowledgeParameters', ActionSetKnowledgeParameters>
  | ActionWithType<'SetLocationMarker', ActionSetLocationMarker>
  | ActionWithType<'SetMigrationParameters', ActionSetMigrationParameters>
  | ActionWithType<'SetRaider', ActionSetRaider>
  | ActionWithType<'SetTimeOfYear', ActionSetTimeOfYear>
  | ActionWithType<'SetTimeScale', ActionSetTimeScale>
  | ActionWithType<'SetTraderPeriod', ActionSetTraderPeriod>
  | ActionWithType<'SetUiLocked', ActionSetUiLocked>
  | ActionWithType<'SetUiMarker', ActionSetUiMarker>
  | ActionWithType<'SetWeather', ActionSetWeather>
  | ActionWithType<'ShowMessage', ActionShowMessage>
  | ActionWithType<'Spawn', ActionSpawn>
  | ActionWithType<'TriggerRaiderAttack', ActionTriggerRaiderAttack>
  | ActionWithType<'Unlock', ActionUnlock>;

export interface ActionDefaultParams {
  clearGoals: ActionClearGoals;
  clearLocationMarkers: ActionClearLocationMarkers;
  clearTrees: ActionClearTrees;
  clearUiMarkers: ActionClearUiMarkers;
  focusCamera: ActionFocusCamera;
  hideUi: ActionHideUi;
  modifyLocation: ActionModifyLocation;
  quitGame: ActionQuitGame;
  setAnimalPopulation: ActionSetAnimalPopulation;
  setBirthParameters: ActionSetBirthParameters;
  setDiseaseParameters: ActionSetDiseaseParameters;
  setFeatureEnabled: ActionSetFeatureEnabled;
  setGameplayFlags: ActionSetGameplayFlags;
  setGoal: ActionSetGoal;
  setGoalsHint: ActionSetGoalsHint;
  setKnowledgeParameters: ActionSetKnowledgeParameters;
  setLocationMarker: ActionSetLocationMarker;
  setMigrationParameters: ActionSetMigrationParameters;
  setRaider: ActionSetRaider;
  setTimeOfYear: ActionSetTimeOfYear;
  setTimeScale: ActionSetTimeScale;
  setTraderPeriod: ActionSetTraderPeriod;
  setUiLocked: ActionSetUiLocked;
  setUiMarker: ActionSetUiMarker;
  setWeather: ActionSetWeather;
  showMessage: ActionShowMessage;
  spawn: ActionSpawn;
  triggerRaiderAttack: ActionTriggerRaiderAttack;
  unlock: ActionUnlock;
}


export interface ActionAttributesProps {
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

export interface ActionTemplateProps<T> {
  onValuesChange?(values: Partial<T>): void;

  onTemplate?(template: string): void;

  onChange?(values: ActionAttributesProps): void;
}

export interface ActionProps<T> extends ActionAttributesProps, ActionTemplateProps<T> {
  removeIcon?: boolean;
  showHeader?: boolean;
  initialValues?: Partial<T>;

  onRemoveClick?(): void;
}
