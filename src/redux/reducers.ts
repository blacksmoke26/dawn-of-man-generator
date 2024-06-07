/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {createSlice} from '@reduxjs/toolkit';
import merge from 'deepmerge';

// types
import type {PayloadAction} from '@reduxjs/toolkit';
import type {AppState, Environment, Scenario} from './reducers.types';

// utils
import { jsonToRedux } from '~/data/environments/parser';

/**
 * @private
 * Redux store initial state */
const initialState: AppState = {
  environment: {},
  scenario: {},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateEnvironment: (state, action: PayloadAction<Environment>) => {
      const {environment} = jsonToRedux({environment: action.payload}, {
        nullResolver: ( wrapperKey: string ) => ({[wrapperKey]: false}),
      });

      state.environment = merge(state.environment as Environment, environment);
    },
    updateEnvironmentRaw: (state, action: PayloadAction<Environment>) => {
      state.environment = merge(state.environment as Environment, action.payload as Environment);
    },
    updateScenario: (state, action: PayloadAction<Scenario>) => {
      state.scenario = merge(state.scenario as Scenario, action.payload as Scenario);
    }
  }
});

export const {updateEnvironment, updateEnvironmentRaw, updateScenario} = appSlice.actions;

export const reducer = appSlice.reducer;
