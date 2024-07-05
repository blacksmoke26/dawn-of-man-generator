/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import obPath from 'object-path';

// utils
import {isObject} from '~/helpers/object';

// modules
import {jsonToRedux as ClearGoals} from '../clear-goals';
import {jsonToRedux as ClearLocationMarkers} from '../clear-location-markers';
import {jsonToRedux as ClearTrees} from '../clear-trees';
import {jsonToRedux as ClearUiMarkers} from '../clear-ui-markers';
import {jsonToRedux as FocusCamera} from '../focus-camera';
import {jsonToRedux as HideUi} from '../hide-ui';
import {jsonToRedux as ModifyLocation} from '../modify-location';
import {jsonToRedux as QuitGame} from '../quit-game';
import {jsonToRedux as SetAnimalPopulation} from '../set-animal-population';
import {jsonToRedux as SetBirthParameters} from '../set-birth-parameters';
import {jsonToRedux as SetDiseaseParameters} from '../set-disease-parameters';
import {jsonToRedux as SetFeatureEnabled} from '../set-feature-enabled';
import {jsonToRedux as SetGameplayFlags} from '../set-gameplay-flags';
import {jsonToRedux as SetGoal} from '../set-goal';
import {jsonToRedux as SetGoalsHint} from '../set-goals-hint';
import {jsonToRedux as SetKnowledgeParameters} from '../set-knowledge-parameters';
import {jsonToRedux as SetLocationMarker} from '../set-location-marker';
import {jsonToRedux as SetMigrationParameters} from '../set-migration-parameters';
import {jsonToRedux as SetRaider} from '../set-raider';
import {jsonToRedux as SetTimeOfYear} from '../set-time-of-year';
import {jsonToRedux as SetTimeScale} from '../set-time-scale';
import {jsonToRedux as SetTraderPeriod} from '../set-trader-period';
import {jsonToRedux as SetUiLocked} from '../set-ui-locked';
import {jsonToRedux as SetUiMarker} from '../set-ui-marker';
import {jsonToRedux as SetWeather} from '../set-weather';
import {jsonToRedux as ShowMessage} from '../show-message';
import {jsonToRedux as Spawn} from '../spawn';
import {jsonToRedux as TriggerRaiderAttack} from '../trigger-raider-attack';
import {jsonToRedux as Unlock} from '../unlock';

// types
import type {AnyAction} from '~/types/action.types';
import type {Json, KVDocument} from '~/types/json.types';

const actionMap: KVDocument<(action: Json | any) => Json | null> = {
  ClearGoals,
  ClearLocationMarkers,
  ClearTrees,
  ClearUiMarkers,
  FocusCamera,
  HideUi,
  ModifyLocation,
  QuitGame,
  SetAnimalPopulation,
  SetBirthParameters,
  SetDiseaseParameters,
  SetFeatureEnabled,
  SetGameplayFlags,
  SetGoal,
  SetGoalsHint,
  SetKnowledgeParameters,
  SetLocationMarker,
  SetMigrationParameters,
  SetRaider,
  SetTimeOfYear,
  SetTimeScale,
  SetTraderPeriod,
  SetUiLocked,
  SetUiMarker,
  SetWeather,
  ShowMessage,
  Spawn,
  TriggerRaiderAttack,
  Unlock,
};

export const parseAction = (action: Json): Json | AnyAction | null => {
  const type = isObject(action)
    ? obPath.get<string | null>(action, 'type', null)
    : null;

  if (type === null) {
    return null;
  }

  return type in actionMap
    ? actionMap[type].call(null, action)
    : null;
};
