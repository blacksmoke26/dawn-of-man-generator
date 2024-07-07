/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

import merge from 'deepmerge';
import objPath, {Path} from 'object-path';
import {createSlice} from '@reduxjs/toolkit';

// utils
import {jsonToRedux} from '~/data/environments/parser';

// redux
import initialState from './initial-state';
import {resetValues as envResetValues} from '~/data/environments/parser/defaults';

// types
import type {PayloadAction} from '@reduxjs/toolkit';
import type {environment} from '~/data/environments/parser/types';

type Environment = environment.Environment;

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    /**
     * Update environment values from the given action. Missing values will be set to false.<br>
     * **Note:** This is a workaround for the issue of not being able to merge objects in parser objects.
     */
    updateValues(state, action: PayloadAction<Environment>) {
      const {environment} = jsonToRedux({environment: action.payload}, {
        nullResolver: (wrapperKey: string) => ({[wrapperKey]: false}),
      });
      state.values = merge(state.values, environment as Environment);
    },
    /**
     * Update environment values from the given action. It will simply merge without post-processing.
     */
    updateValuesRaw(state, action: PayloadAction<Environment>) {
      state.values = merge(state.values, action.payload);
    },
    /**
     * Update environment values from the given action. It will simply merge without post-processing.
     */
    overwriteValues(state, action: PayloadAction<Environment>) {
      state.values = {...envResetValues, ...action.payload};
    },
    /**
     * Reset environment values (simply removing everything in forms)
     */
    resetValues(state) {
      state.values = {...envResetValues};
    },
    /**
     * Update xml template from the given action.
     */
    updateTemplate(state, action: PayloadAction<string>) {
      state.template = action.payload.trim();
    },
    /**
     * Update language strings template from the given action.
     */
    updateString(state, action: PayloadAction<string>) {
      state.strings = action.payload.trim();
    },
    /**
     * Update environment name
     */
    updateName(state, action: PayloadAction<string>) {
      state.name = action.payload.trim();
    },
    /**
     * Update environment state value by the given path. No value will be set if the path does not exist.<br>
     * **Warning:** It will overwrite the existing value.
     */
    updateByPath(state, action: PayloadAction<
      | { path: Path; value: any , overwrite?: boolean}
      | { path: keyof Environment; value: any, overwrite?: boolean }
    >) {
      const path = action.payload.path;
      const values = {...state.values};

      action.payload?.overwrite && objPath.empty(values, path);

      objPath.set(values, path, action.payload.value);

      state.values = merge(state.values, values as Environment);
    },
    /**
     * Clears environment property
     */
    clearProperty(state, action: PayloadAction<keyof Environment>) {
      state.values = {...state.values, [action.payload]: undefined};
    },
  },
});

export const {
  updateValues,
  updateValuesRaw,
  updateTemplate,
  updateString,
  updateName,
  updateByPath,
  resetValues,
  clearProperty,
  overwriteValues,
} = environmentSlice.actions;

export const reducer = environmentSlice.reducer;
