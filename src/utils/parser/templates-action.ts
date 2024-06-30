/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// utils
import {onlyKeys} from '~/helpers/object';
import {isKeyInAtt, renderTemplate} from '~/utils/template';

// types
import {KVDocument, MapDocument} from '~/types/json.types';
import {
  ActionClearGoals,
  ActionClearLocationMarkers,
  ActionClearTrees,
  ActionClearUiMarkers,
  ActionFocusCamera,
  ActionHideUi,
  ActionModifyLocation,
  ActionQuitGame,
  ActionSetAnimalPopulation,
  ActionSetBirthParameters,
  ActionSetDiseaseParameters,
  ActionSetFeatureEnabled,
  ActionSetGameplayFlags,
  ActionSetGoal,
  ActionSetGoalsHint,
  ActionSetKnowledgeParameters,
  ActionSetLocationMarker,
  ActionSetMigrationParameters,
  ActionSetRaider,
  ActionSetTimeOfYear,
  ActionSetTimeScale,
  ActionSetTraderPeriod,
  ActionSetUiLocked,
  ActionSetUiMarker,
  ActionSetWeather,
  ActionShowMessage,
  ActionSpawn,
  ActionTriggerRaiderAttack,
  ActionUnlock,
  ActionName, RaidWaveParameters,
  AnyAction,
} from '~/types/action.types';

/** Render `ClearGoals` attributes template */
export const toClearGoalsTemplate = (attributes: ActionClearGoals): string => {
  return renderTemplate('action', 'ClearGoals', []);
};

/** Render `ClearLocationMarkers` attributes template */
export const toClearLocationMarkersTemplate = (attributes: ActionClearLocationMarkers): string => {
  return renderTemplate('action', 'ClearLocationMarkers', []);
};

/** Render `ClearTrees` attributes template */
export const toClearTreesTemplate = (attributes: ActionClearTrees): string => {
  if (!attributes?.radius) {
    return '';
  }

  const props: string[] = [
    `radius="${attributes.radius}"`,
  ];

  isKeyInAtt('position', attributes) && props.push(`position="${attributes?.position?.join(',')}"`);

  return renderTemplate('action', 'ClearTrees', props);
};

/** Render `ClearUiMarkers` attributes template */
export const toClearUiMarkersTemplate = (attributes: ActionClearUiMarkers): string => {
  return renderTemplate('action', 'ClearUiMarkers', []);
};

/** Render `FocusCamera` attributes template */
export const toFocusCameraTemplate = (attributes: ActionFocusCamera): string => {
  if (!attributes?.location?.trim() || !attributes?.entityName?.trim()) {
    return '';
  }

  const props: string[] = [
    `location="${attributes.location}"`,
    `entity_name="${attributes.entityName}"`,
  ];

  isKeyInAtt('distance', attributes) && props.push(`distance="${attributes?.distance}"`);
  isKeyInAtt('rotation', attributes) && props.push(`rotation="${attributes?.rotation}"`);

  return renderTemplate('action', 'FocusCamera', props);
};

/** Render `HideUi` attributes template */
export const toHideUiTemplate = (attributes: ActionHideUi): string => {
  if (!attributes?.entityTypes?.length || !attributes?.buildableCategories?.trim()) {
    return '';
  }

  const props: string[] = [
    `entity_types="${attributes.entityTypes.join(',')}"`,
    `buildable_categories="${attributes.buildableCategories}"`,
  ];

  isKeyInAtt('hideDisabledUi', attributes) && props.push(`hide_disabled_ui="${'' + attributes?.hideDisabledUi}"`);
  isKeyInAtt('hideQuickPanels', attributes) && props.push(`hide_quick_panels="${'' + attributes?.hideQuickPanels}"`);

  return renderTemplate('action', 'HideUi', props);
};

/** Render `ModifyLocation` attributes template */
export const toModifyLocationTemplate = (attributes: ActionModifyLocation): string => {
  if (!attributes?.modification?.trim()) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('locationIndex', attributes) && props.push(`location_index="${attributes?.locationIndex}"`);
  isKeyInAtt('position', attributes) && props.push(`position="${attributes?.position?.join(',')}"`);

  props.push(`modification="${attributes.modification}"`);

  return renderTemplate('action', 'ModifyLocation', props);
};

/** Render `QuitGame` attributes template */
export const toQuitGameTemplate = (attributes: ActionQuitGame): string => {
  const props: string[] = [];

  isKeyInAtt('success', attributes) && props.push(`success="${'' + attributes?.success}"`);

  return renderTemplate('action', 'QuitGame', props);
};

/** Render `SetAnimalPopulation` attributes template */
export const toSetAnimalPopulationTemplate = (attributes: ActionSetAnimalPopulation): string => {
  if (!attributes.animalType?.trim() && !attributes.animalTypes?.length) {
    return '';
  }

  const props: string[] = [];

  (isKeyInAtt('animalType', attributes) && attributes.animalType?.trim())
  && props.push(`animal_type="${attributes?.animalType}"`);

  (isKeyInAtt('animalTypes', attributes) && attributes?.animalTypes?.length)
  && props.push(`animal_types="${attributes?.animalTypes?.join(' ')}"`);

  isKeyInAtt('min', attributes) && props.push(`min="${attributes?.min}"`);
  isKeyInAtt('max', attributes) && props.push(`max="${attributes?.max}"`);
  isKeyInAtt('eraFactors', attributes) && props.push(`era_factors="${attributes?.eraFactors?.join(' ')}"`);

  return renderTemplate('action', 'SetAnimalPopulation', props);
};

/** Render `SetBirthParameters` attributes template */
export const toSetBirthParametersTemplate = (attributes: ActionSetBirthParameters): string => {
  const props: string[] = [];

  isKeyInAtt('decreaseStartPopulation', attributes)
  && props.push(`decrease_start_population="${attributes?.decreaseStartPopulation}"`);

  isKeyInAtt('decreaseHalfingPopulation', attributes)
  && props.push(`decrease_halfing_population="${attributes?.decreaseHalfingPopulation}"`);


  return renderTemplate('action', 'SetBirthParameters', props);
};

/** Render `SetDiseaseParameters` attributes template */
export const toSetDiseaseParametersTemplate = (attributes: ActionSetDiseaseParameters): string => {
  const props: string[] = [];

  isKeyInAtt('period', attributes) && props.push(`period="${attributes?.period}y"`);
  isKeyInAtt('variance', attributes) && props.push(`variance="${attributes?.variance}y"`);
  isKeyInAtt('individualDiseaseChance', attributes) && props.push(`individual_disease_chance="${attributes?.individualDiseaseChance}"`);

  return renderTemplate('action', 'SetDiseaseParameters', props);
};

/** Render `SetFeatureEnabled` attributes template */
export const toSetFeatureEnabledTemplate = (attributes: ActionSetFeatureEnabled): string => {
  if (!attributes.feature?.trim()) {
    return '';
  }

  const props: string[] = [
    `feature="${attributes?.feature}"`,
  ];

  isKeyInAtt('value', attributes) && props.push(`value="${'' + attributes?.value}"`);

  return renderTemplate('action', 'SetFeatureEnabled', props);
};

/** Render `SetGameplayFlags` attributes template */
export const toSetGameplayFlagsTemplate = (attributes: ActionSetGameplayFlags): string => {
  if (!attributes.flags?.trim()) {
    return '';
  }

  const props: string[] = [
    `flags="${attributes?.flags}"`,
  ];

  isKeyInAtt('controllableAnimal', attributes) && props.push(`controllable_animal="${'' + attributes?.controllableAnimal}"`);

  return renderTemplate('action', 'SetGameplayFlags', props);
};

/** Render `SetGoal` attributes template */
export const toSetGoalTemplate = (attributes: ActionSetGoal): string => {
  return !attributes.id?.trim()
    ? ''
    : renderTemplate('action', 'SetGoal', [
      `id="${attributes?.id}"`,
    ]);
};

/** Render `SetGoalsHint` attributes template */
export const toSetGoalsHintTemplate = (attributes: ActionSetGoalsHint): string => {
  return !attributes.value?.trim()
    ? ''
    : renderTemplate('action', 'SetGoalsHint', [
      `value="${attributes?.value}"`,
    ]);
};

/** Render `SetKnowledgeParameters` attributes template */
export const toSetKnowledgeParametersTemplate = (attributes: ActionSetKnowledgeParameters): string => {
  return !attributes?.techCostMultiplier
    ? ''
    : renderTemplate('action', 'SetKnowledgeParameters', [
      `tech_cost_multiplier="${attributes?.techCostMultiplier}"`,
    ]);
};

/** Render `SetLocationMarker` attributes template */
export const toSetLocationMarkerTemplate = (attributes: ActionSetLocationMarker): string => {
  if (!attributes.workAreaId?.trim() || !attributes.entityType?.trim()) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('markerType', attributes) && props.push(`marker_type="${attributes?.markerType}"`);

  props.push(`entity_type="${attributes?.entityType}"`);

  isKeyInAtt('requiredGoal', attributes) && props.push(`required_goal="${attributes?.requiredGoal}"`);
  isKeyInAtt('excludedGoal', attributes) && props.push(`excluded_goal="${attributes?.excludedGoal}"`);

  props.push(`work_area_id="${attributes?.workAreaId}"`);

  isKeyInAtt('position', attributes) && props.push(`position="${attributes?.position}"`);
  isKeyInAtt('scale', attributes) && props.push(`scale="${attributes?.scale}"`);
  isKeyInAtt('refPosition', attributes) && props.push(`ref_position="${attributes?.refPosition}"`);

  return renderTemplate('action', 'SetLocationMarker', props);
};

/** Render `SetMigrationParameters` attributes template */
export const toSetMigrationParametersTemplate = (attributes: ActionSetMigrationParameters): string => {
  const props: string[] = [];

  isKeyInAtt('min', attributes) && props.push(`min="${attributes?.min}"`);
  isKeyInAtt('max', attributes) && props.push(`max="${attributes?.max}"`);
  isKeyInAtt('period', attributes) && props.push(`period="${attributes?.period}y"`);

  isKeyInAtt('decreaseStartPopulation', attributes)
  && props.push(`decrease_start_population="${attributes?.decreaseStartPopulation}"`);

  isKeyInAtt('decreaseHalfingPopulation', attributes)
  && props.push(`decrease_halfing_population="${attributes?.decreaseHalfingPopulation}"`);

  return renderTemplate('action', 'SetMigrationParameters', props);
};

/** Render `SetRaider` attributes template */
export const toSetRaiderTemplate = (attributes: ActionSetRaider): string => {
  if (!attributes.entityTypes?.length || !attributes.era?.trim()) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('era', attributes) && props.push(`era="${attributes?.era}"`);
  isKeyInAtt('hardcoreTimer', attributes) && props.push(`hardcore_timer="${attributes?.hardcoreTimer}"`);

  props.push(`entity_types="${attributes?.entityTypes.join(' ')}"`);

  isKeyInAtt('min', attributes) && props.push(`min="${attributes?.min}"`);
  isKeyInAtt('max', attributes) && props.push(`max="${attributes?.max}"`);

  attributes?.mins?.length && props.push(`mins="${attributes?.mins?.join(' ')}"`);
  attributes?.maxes?.length && props.push(`maxes="${attributes?.maxes?.join(' ')}"`);

  isKeyInAtt('extraRaiderPerPopulation', attributes)
  && props.push(`extra_raider_per_population="${attributes?.extraRaiderPerPopulation}"`);

  isKeyInAtt('gracePeriod', attributes) && props.push(`grace_period="${attributes?.gracePeriod}y"`);
  isKeyInAtt('period', attributes) && props.push(`period="${attributes?.period}y"`);
  isKeyInAtt('variance', attributes) && props.push(`variance="${attributes?.variance}y"`);

  const wavesTemplate = isKeyInAtt('waves', attributes) && attributes?.waves?.length
    ? toSetRaiderWavesTemplate(attributes?.waves)
    : '';

  return renderTemplate('action', 'SetRaider', props, wavesTemplate);
};

const toSetRaiderWavesTemplate = (waves: RaidWaveParameters[]): string => {
  if (!waves.length) {
    return '';
  }

  const templates: string[] = [];

  waves.forEach(wave => {
    if (!String(wave?.armorRatio || '').trim()
      || !String(wave?.shieldRatio || '').trim()) {
      return;
    }

    const props: string[] = [
      `shield_ratio="${wave?.shieldRatio}"`,
      `armor_ratio="${wave?.armorRatio}"`,
    ];

    wave?.disabledTechs?.length && props.push(`disabled_techs="${wave?.disabledTechs?.join(' ')}"`);
    templates.push(renderTemplate('wave', null, props));
  });

  return !templates.length ? '' : `<waves>${templates.join('')}</waves>`;
};

/** Render `SetTimeOfYear` attributes template */
export const toSetTimeOfYearTemplate = (attributes: ActionSetTimeOfYear): string => {
  const props: string[] = [];

  isKeyInAtt('value', attributes) && props.push(`value="${attributes?.value}"`);

  return renderTemplate('action', 'SetTimeOfYear', props);
};

/** Render `SetTimeScale` attributes template */
export const toSetTimeScaleTemplate = (attributes: ActionSetTimeScale): string => {
  const props: string[] = [];

  isKeyInAtt('index', attributes) && props.push(`index="${attributes?.index}"`);

  return renderTemplate('action', 'SetTimeScale', props);
};

/** Render `SetTraderPeriod` attributes template */
export const toSetTraderPeriodTemplate = (attributes: ActionSetTraderPeriod): string => {
  const props: string[] = [];

  isKeyInAtt('value', attributes) && props.push(`value="${attributes?.value}y"`);

  return renderTemplate('action', 'SetTraderPeriod', props);
};

/** Render `SetUiLocked` attributes template */
export const toSetUiLockedTemplate = (attributes: ActionSetUiLocked): string => {
  const props: string[] = [];

  isKeyInAtt('lockFlags', attributes) && props.push(`lock_flags="${attributes?.lockFlags}"`);

  return renderTemplate('action', 'SetUiLocked', props);
};

/** Render `SetUiMarker` attributes template */
export const toSetUiMarkerTemplate = (attributes: ActionSetUiMarker): string => {
  if (!attributes.entityType?.trim()
    || !attributes.contextAction?.trim()
    || !attributes.workAreaId?.length) {
    return '';
  }

  const props: string[] = [];

  isKeyInAtt('markerType', attributes) && props.push(`marker_type="${attributes?.markerType}"`);

  props.push(`entity_type="${attributes?.entityType}"`);
  props.push(`context_action="${attributes?.contextAction}"`);
  props.push(`work_area_id="${attributes?.workAreaId}"`);

  isKeyInAtt('excludedGoal', attributes) && props.push(`excluded_goal="${attributes?.excludedGoal}"`);
  isKeyInAtt('requiredGoal', attributes) && props.push(`required_goal="${attributes?.requiredGoal}"`);
  isKeyInAtt('maxDangerLevel', attributes) && props.push(`max_danger_level="${attributes?.maxDangerLevel}"`);

  return renderTemplate('action', 'SetUiMarker', props);
};

/** Render `SetWeather` attributes template */
export const toSetWeatherTemplate = (attributes: ActionSetWeather): string => {
  const props: string[] = [];

  isKeyInAtt('value', attributes) && props.push(`value="${attributes?.value}"`);

  return renderTemplate('action', 'SetWeather', props);
};

/** Render `ShowMessage` attributes template */
export const toShowMessageTemplate = (attributes: ActionShowMessage): string => {
  return !attributes.title?.trim() || !attributes.text?.trim()
    ? ''
    : renderTemplate('action', 'ShowMessage', [
      `title="${attributes?.title}"`,
      `text="${attributes?.text}"`,
    ]);
};

/** Render `Spawn` attributes template */
export const toSpawnTemplate = (attributes: ActionSpawn): string => {
  if (!attributes.entityType?.trim() || !attributes.placement?.trim()) {
    return '';
  }

  const props: string[] = [
    `entity_type="${attributes?.entityType}"`,
    `placement="${attributes?.placement}"`,
  ];

  isKeyInAtt('amount', attributes) && props.push(`amount="${attributes?.amount}"`);
  isKeyInAtt('angle', attributes) && props.push(`angle="${attributes?.angle}"`);
  isKeyInAtt('radius', attributes) && props.push(`radius="${attributes?.radius}"`);
  isKeyInAtt('age', attributes) && props.push(`age="${attributes?.age}"`);
  isKeyInAtt('yearsOld', attributes) && props.push(`years_old="${attributes?.yearsOld}"`);
  isKeyInAtt('gender', attributes) && props.push(`gender="${attributes?.gender}"`);
  isKeyInAtt('name', attributes) && props.push(`name="${attributes?.name}"`);

  Array.isArray(attributes?.position) && props.push(`position="${attributes.position.join(',')}"`);

  isKeyInAtt('spawnType', attributes) && props.push(`spawn_type="${attributes?.spawnType}"`);
  isKeyInAtt('behaviour', attributes) && props.push(`behaviour="${attributes?.behaviour}"`);

  return renderTemplate('action', 'Spawn', props);
};

/** Render `TriggerRaiderAttack` attributes template */
export const toTriggerRaiderAttackTemplate = (attributes: ActionTriggerRaiderAttack): string => {
  const props: string[] = [];

  isKeyInAtt('amount', attributes) && props.push(`amount="${attributes?.amount}"`);

  return renderTemplate('action', 'TriggerRaiderAttack', props);
};

/** Render `Unlock` attributes template */
export const toUnlockTemplate = (attributes: ActionUnlock): string => {
  return !attributes.techEra?.trim() || !attributes.techType?.trim()
    ? ''
    : renderTemplate('action', 'Unlock', [
      `tech_era="${attributes?.techEra}"`,
      `tech_type="${attributes?.techType}"`,
    ]);
};

const funcRegistry: KVDocument<Function> = {
  ClearGoals: toClearGoalsTemplate,
  ClearLocationMarkers: toClearLocationMarkersTemplate,
  ClearTrees: toClearTreesTemplate,
  ClearUiMarkers: toClearUiMarkersTemplate,
  FocusCamera: toFocusCameraTemplate,
  HideUi: toHideUiTemplate,
  ModifyLocation: toModifyLocationTemplate,
  QuitGame: toQuitGameTemplate,
  SetAnimalPopulation: toSetAnimalPopulationTemplate,
  SetBirthParameters: toSetBirthParametersTemplate,
  SetDiseaseParameters: toSetDiseaseParametersTemplate,
  SetFeatureEnabled: toSetFeatureEnabledTemplate,
  SetGameplayFlags: toSetGameplayFlagsTemplate,
  SetGoal: toSetGoalTemplate,
  SetGoalsHint: toSetGoalsHintTemplate,
  SetKnowledgeParameters: toSetKnowledgeParametersTemplate,
  SetLocationMarker: toSetLocationMarkerTemplate,
  SetMigrationParameters: toSetMigrationParametersTemplate,
  SetRaider: toSetRaiderTemplate,
  SetTimeOfYear: toSetTimeOfYearTemplate,
  SetTimeScale: toSetTimeScaleTemplate,
  SetTraderPeriod: toSetTraderPeriodTemplate,
  SetUiLocked: toSetUiLockedTemplate,
  SetUiMarker: toSetUiMarkerTemplate,
  SetWeather: toSetWeatherTemplate,
  ShowMessage: toShowMessageTemplate,
  Spawn: toSpawnTemplate,
  TriggerRaiderAttack: toTriggerRaiderAttackTemplate,
  Unlock: toUnlockTemplate,
};

export const toActionTemplate = (condition: ActionName, values: KVDocument, disabled: boolean = false): string => {
  return disabled || !(condition in funcRegistry) ? '' : funcRegistry[condition](values as any);
};

const templatesMap: MapDocument<ActionName, Function> = {
  ClearGoals: toClearGoalsTemplate,
  ClearLocationMarkers: toClearLocationMarkersTemplate,
  ClearTrees: toClearTreesTemplate,
  ClearUiMarkers: toClearUiMarkersTemplate,
  FocusCamera: toFocusCameraTemplate,
  HideUi: toHideUiTemplate,
  ModifyLocation: toModifyLocationTemplate,
  QuitGame: toQuitGameTemplate,
  SetAnimalPopulation: toSetAnimalPopulationTemplate,
  SetBirthParameters: toSetBirthParametersTemplate,
  SetDiseaseParameters: toSetDiseaseParametersTemplate,
  SetFeatureEnabled: toSetFeatureEnabledTemplate,
  SetGameplayFlags: toSetGameplayFlagsTemplate,
  SetGoal: toSetGoalTemplate,
  SetGoalsHint: toSetGoalsHintTemplate,
  SetKnowledgeParameters: toSetKnowledgeParametersTemplate,
  SetLocationMarker: toSetLocationMarkerTemplate,
  SetMigrationParameters: toSetMigrationParametersTemplate,
  SetRaider: toSetRaiderTemplate,
  SetTimeOfYear: toSetTimeOfYearTemplate,
  SetTimeScale: toSetTimeScaleTemplate,
  SetTraderPeriod: toSetTraderPeriodTemplate,
  SetUiLocked: toSetUiLockedTemplate,
  SetUiMarker: toSetUiMarkerTemplate,
  SetWeather: toSetWeatherTemplate,
  ShowMessage: toShowMessageTemplate,
  Spawn: toSpawnTemplate,
  TriggerRaiderAttack: toTriggerRaiderAttackTemplate,
  Unlock: toUnlockTemplate,
};
export const toActionsTemplate = (actions: AnyAction[]): string => {
  if (!actions.length) {
    return '';
  }

  const templates = [];

  for (const action of actions) {
    if (!(action.type in templatesMap)) {
      continue;
    }

    const template = (templatesMap[action.type] as Function)(onlyKeys(action, ['type'], true)) as string;

    if (template.trim()) {
      templates.push(template);
    }
  }

  return !templates.length
    ? ''
    : renderTemplate('actions', null, [], templates.join(''));
};
