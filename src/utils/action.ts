/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import {capitalCase} from 'change-case';

// types
import {DeepPartial} from 'utility-types';
import {ActionDefaultParams, type ActionName, RaidWaveParameters} from '~/types/action.types';

export const LOCATION_TYPE = [
  'LastMarker', 'MarkerAverage', 'Entity',
] as const;

export const BUILDABLE_CATEGORIES = [
  'Residence', 'Storage', 'Production', 'Metallurgy',
  'Defensive', 'Spiritual', 'Funerary', 'Transport',
] as const;

export const FEATURE_TYPE = [
  'Hints', 'Warnings', 'Knowledge',
  'TameableAnimalSpawn', 'TechConfirmMessages',
] as const;

export const GAMEPLAY_FLAGS = [
  'None', 'OneShotHunt', 'DisableFailureConditions',
  'AnimalControl',
] as const;

export const MARKER_TYPES = [
  'NearestBank', 'NearestMinable', 'NearestDetail',
  'NearestEntity', 'NearestWorkArea', 'Position',
] as const;

export const REF_POSITIONS = [
  'Settlement', 'NearestMarker',
] as const;

export const LOCK_FLAGS = [
  'None', 'BuildMenu', 'WorkAreas', 'Techs',
  'CraftRecipes', 'PrimalVision', 'ContextActions',
  'Management',
] as const;

export const UI_MARKER_TYPES = [
  'Build', 'Craft', 'WorkArea', 'WorkAreaMaxPeople',
  'ContextAction', 'Research', 'SpeedUp', 'PrimalVision',
] as const;

export const UI_CONTEXT_ACTIONS = [
  'CutDown', 'GatherDetail', 'GatherProp', 'Collect',
  'Butcher', 'Hunt', 'Capture', 'EditWorkArea', 'Recycle',
  'Upgrade', 'Fish', 'Refuel', 'KeepAnimals', 'Repair',
  'ExtractMud', 'ExtractWater', 'Mine', 'Plant',
  'Harvest', 'OpenClose', 'PrepareForTransport',
  'NextWorkArea', 'PreviousWorkArea', 'Limits',
  'AnimalLimits', 'Defense', 'Megaliths', 'WorkAreas',
  'Slaughter', 'Milk', 'Shear', 'Empty', 'Enable',
  'Disable', 'RemovePlant', 'RemoveWorkArea', 'CancelTask',
  'PriorityUp', 'PriorityDown', 'CancelConstruction',
  'PlaceCombatPosition',
] as const;

export const DANGER_LEVEL_TYPES = [
  'VeryLow', 'Low', 'Moderate', 'High', 'VeryHigh',
] as const;

export const WEATHER_TYPES = [
  'Sunny', 'Rainy', 'Snowy', 'Storm', 'Blizzard',
] as const;

export const GENDER_TYPES = [
  'Male', 'Female',
] as const;

export const SPAWN_TYPES = [
  'Auto', 'Leader', 'Follower',
] as const;

export const BEHAVIOUR_TYPES = [
  'None', 'NoTasks', 'NoOutfitChange',
] as const;

export const AGE_TYPES = [
  'Young', 'Adult', 'Old',
] as const;

export const PLACEMENT_TYPES = [
  'StartLocationCircular', 'Storage', 'Human',
] as const;

export const ACTIONS_NAME = [
  'ClearGoals',
  'ClearLocationMarkers',
  'ClearTrees',
  'ClearUiMarkers',
  'FocusCamera',
  'HideUi',
  'ModifyLocation',
  'QuitGame',
  'SetAnimalPopulation',
  'SetBirthParameters',
  'SetDiseaseParameters',
  'SetFeatureEnabled',
  'SetGameplayFlags',
  'SetGoal',
  'SetGoalsHint',
  'SetKnowledgeParameters',
  'SetLocationMarker',
  'SetMigrationParameters',
  'SetRaider',
  'SetTimeOfYear',
  'SetTimeScale',
  'SetTraderPeriod',
  'SetUiLocked',
  'SetUiMarker',
  'SetWeather',
  'ShowMessage',
  'Spawn',
  'TriggerRaiderAttack',
  'Unlock',
] as const;

export const PROMINENT_ACTIONS_NAME: ActionName[] = [
  'SetAnimalPopulation',
  'SetBirthParameters',
  'SetDiseaseParameters',
  'SetFeatureEnabled',
  'SetGameplayFlags',
  'SetKnowledgeParameters',
  'SetMigrationParameters',
  'SetRaider',
  'SetTraderPeriod',
] as const;

export const ACTIONS_NAME_OPTIONS = [...ACTIONS_NAME].sort().map(value => ({label: capitalCase(value), value}));

export const actionsNameOptionsGrouped = (activeList: ActionName[] = []) => {
  const groups = [];

  if (activeList.length) {
    groups.push({
      label: 'Active',
      options: activeList
        .map(value => ({label: capitalCase(value), value, type: 'active'})),
    });
  }

  groups.push({
    label: 'Prominent',
    options: PROMINENT_ACTIONS_NAME
      .filter(name => !activeList.includes(name))
      .map(value => ({label: capitalCase(value), value, type: 'prominent'})),
  });

  groups.push({
    label: 'Other',
    options: ACTIONS_NAME
      .filter(name => !PROMINENT_ACTIONS_NAME.includes(name))
      .filter(name => !activeList.includes(name))
      .map(value => ({label: capitalCase(value), value, type: 'other'})),
  });

  return groups;
};
export const PLACEMENT_TYPES_OPTIONS = [...PLACEMENT_TYPES].sort().map(value => ({label: capitalCase(value), value}));

export const defaultRaiderWaveParams: RaidWaveParameters = {
  armorRatio: 1,
  shieldRatio: 1,
  disabledTechs: undefined,
};

export const defaultsParams: DeepPartial<ActionDefaultParams> = {
  clearGoals: {},
  clearLocationMarkers: {},
  clearTrees: {
    radius: 30,
    position: undefined,
  },
  clearUiMarkers: {},
  focusCamera: {
    location: 'LastMarker',
    entityName: 'untitled',
    distance: undefined,
    rotation: undefined,
  },
  hideUi: {
    entityTypes: undefined,
    buildableCategories: undefined,
    hideDisabledUi: undefined,
    hideQuickPanels: undefined,
  },
  modifyLocation: {
    locationIndex: undefined,
    position: undefined,
    modification: '',
  },
  quitGame: {
    success: undefined,
  },
  setAnimalPopulation: {
    animalType: 'ancient_bison',
    animalTypes: [],
    min: 0,
    max: 0,
    eraFactors: [],
  },
  setBirthParameters: {
    decreaseStartPopulation: undefined,
    decreaseHalfingPopulation: undefined,
  },
  setDiseaseParameters: {
    period: undefined, //1.5,
    variance: undefined, //0.5,
    individualDiseaseChance: undefined, //0.5,
  },
  setFeatureEnabled: {
    feature: 'Hints',
    value: undefined,
  },
  setGameplayFlags: {
    flags: 'None',
    controllableAnimal: undefined,
  },
  setGoal: {
    id: 'unnamed',
  },
  setGoalsHint: {
    value: 'unnamed',
  },
  setKnowledgeParameters: {
    techCostMultiplier: 1,
  },
  setLocationMarker: {
    markerType: undefined,//'NearestBank',
    entityType: 'primitive_human',
    requiredGoal: undefined,//'',
    excludedGoal: undefined,//'',
    workAreaId: 'untitled',
    position: undefined,//[0, 0],
    scale: undefined,//4,
    refPosition: undefined,//'Settlement',
  },
  setMigrationParameters: {
    min: undefined, //1,
    max: undefined, //1,
    period: undefined, //0.5,
    decreaseStartPopulation: undefined, //50,
    decreaseHalfingPopulation: undefined, //50,
  },
  setRaider: {
    era: 'Paleolithic',
    hardcoreTimer: undefined,
    entityTypes: ['primitive_human'],
    min: undefined,
    max: undefined,
    mins: undefined,
    maxes: undefined,
    extraRaiderPerPopulation: undefined,
    gracePeriod: undefined,
    period: undefined,
    variance: undefined,
    waves: undefined,
  },
  setTimeOfYear: {
    value: undefined,
  },
  setTimeScale: {
    index: undefined,
  },
  setTraderPeriod: {
    value: undefined,
  },
  setUiLocked: {
    lockFlags: undefined,
  },
  setUiMarker: {
    markerType: undefined,
    entityType: 'primitive_human',
    contextAction: 'CutDown',
    workAreaId: 'untitled',
    excludedGoal: undefined,
    requiredGoal: undefined,
    maxDangerLevel: undefined,
  },
  setWeather: {
    value: undefined,
  },
  showMessage: {
    title: '',
    text: '',
  },
  spawn: {
    entityType: 'primitive_human',
    placement: 'StartLocationCircular',
    amount: 1,
    angle: undefined,
    radius: undefined,
    age: undefined,
    yearsOld: undefined,
    gender: undefined,
    name: undefined,
    position: undefined,
    spawnType: undefined,
    behaviour: undefined,
  },
  triggerRaiderAttack: {
    amount: 1,
  },
  unlock: {
    techType: undefined,
    techEra: undefined,
  },
};
