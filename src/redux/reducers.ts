/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import merge from 'deepmerge';
import {createSlice} from '@reduxjs/toolkit';

// utils
import {jsonToRedux} from '~/data/environments/parser';

// types
import type {PayloadAction} from '@reduxjs/toolkit';
import type {AppState, Environment, Scenario, TemplateType} from './reducers.types';

/**
 * @private
 * Redux store initial state */
const initialState: AppState = {
  environment: {},
  scenario: {},
  initiated: false,
  templates: {
    environment: '',
    scenario: '',
  },
  strings: {
    environment: '',
    scenario: '',
  },
  fileName: 'custom',
  scenarioName: 'scenario',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateInit(state, action: PayloadAction<boolean>) {
      state.initiated = action.payload;
    },
    updateEnvironment(state, action: PayloadAction<Environment>) {
      const {environment} = jsonToRedux({environment: action.payload}, {
        nullResolver: (wrapperKey: string) => ({[wrapperKey]: false}),
      });

      state.environment = merge(state.environment as Environment, environment);
    },
    updateEnvironmentRaw(state, action: PayloadAction<Environment>) {
      state.environment = merge(state.environment as Environment, action.payload as Environment);
    },
    updateScenario(state, action: PayloadAction<Scenario>) {
      state.scenario = merge(state.scenario as Scenario, action.payload as Scenario);
    },
    updateTemplate(state, action: PayloadAction<{ type: TemplateType, text: string }>) {
      state.templates = {
        ...state.templates,
        [action.payload.type]: action.payload.text,
      };
    },
    updateString(state, action: PayloadAction<{ type: TemplateType, text: string }>) {
      state.strings = {
        ...state.strings,
        [action.payload.type]: action.payload.text,
      };
    },
    updateFilename(state, action: PayloadAction<string>) {
      state.fileName = action.payload.trim();
    },
    updateScenarioName(state, action: PayloadAction<string>) {
      state.scenarioName = action.payload.trim();
    },
  },
});

export const {
  updateEnvironment,
  updateEnvironmentRaw,
  updateScenario,
  updateInit,
  updateTemplate,
  updateString,
  updateFilename,
  updateScenarioName,
} = appSlice.actions;

export const reducer = appSlice.reducer;
