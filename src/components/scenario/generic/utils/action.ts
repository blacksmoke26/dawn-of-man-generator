/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';

// actions component (order matters)
import ClearGoals from '~/components/scenario/actions/ClearGoals';
import ClearLocationMarkers from '~/components/scenario/actions/ClearLocationMarkers';
import ClearTrees from '~/components/scenario/actions/ClearTrees';
import ClearUiMarkers from '~/components/scenario/actions/ClearUiMarkers';
import FocusCamera from '~/components/scenario/actions/FocusCamera';
import HideUi from '~/components/scenario/actions/HideUi';
import ModifyLocation from '~/components/scenario/actions/ModifyLocation';
import QuitGame from '~/components/scenario/actions/QuitGame';
import SetAnimalPopulation from '~/components/scenario/actions/SetAnimalPopulation';
import SetBirthParameters from '~/components/scenario/actions/SetBirthParameters';
import SetDiseaseParameters from '~/components/scenario/actions/SetDiseaseParameters';
import SetFeatureEnabled from '~/components/scenario/actions/SetFeatureEnabled';
import SetGameplayFlags from '~/components/scenario/actions/SetGameplayFlags';
import SetGoal from '~/components/scenario/actions/SetGoal';
import SetGoalsHint from '~/components/scenario/actions/SetGoalsHint';
import SetKnowledgeParameters from '~/components/scenario/actions/SetKnowledgeParameters';
import SetLocationMarker from '~/components/scenario/actions/SetLocationMarker';
import SetMigrationParameters from '~/components/scenario/actions/SetMigrationParameters';
import SetRaider from '~/components/scenario/actions/SetRaider';
import SetTimeOfYear from '~/components/scenario/actions/SetTimeOfYear';
import SetTimeScale from '~/components/scenario/actions/SetTimeScale';
import SetTraderPeriod from '~/components/scenario/actions/SetTraderPeriod';
import SetUiLocked from '~/components/scenario/actions/SetUiLocked';
import SetUiMarker from '~/components/scenario/actions/SetUiMarker';
import SetWeather from '~/components/scenario/actions/SetWeather';
import ShowMessage from '~/components/scenario/actions/ShowMessage';
import Spawn from '~/components/scenario/actions/Spawn';
import TriggerRaiderAttack from '~/components/scenario/actions/TriggerRaiderAttack';
import Unlock from '~/components/scenario/actions/Unlock';

// types
import type {KVDocument} from '~/types/json.types';
import type {ActionName, ActionProps} from '~/types/action.types';

export const componentsMap: KVDocument<React.FC<any>> = {
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

export const createActionComponent = <T = any>(type: ActionName): React.FC<ActionProps<T>> => {
  if (!(type in componentsMap)) {
    throw new Error(`Unknown action component: ${type}`);
  }

  return componentsMap[type];
};
