/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

import objPath, {Path} from 'object-path';
import {createSlice} from '@reduxjs/toolkit';

// types
import type {PayloadAction} from '@reduxjs/toolkit';

// redux
import initialState from './initial-state';
import {NestedKeyOf} from '~/types/utility.types';
import {ConfigurationState} from '~redux/slices/config/reducers.types';

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateInit(state, action: PayloadAction<boolean>) {
      state.initiated = action.payload;
    },
    /**
     * Update config state value by the given path. No value will be set if the path does not exist.<br>
     * **Warning:** It will overwrite the existing value.
     */
    updateByPath(state, action: PayloadAction<(
      | { path: NestedKeyOf<ConfigurationState>; value: any, overwrite?: boolean }
      | { path: Path; value: any, overwrite?: boolean }
    )>) {
      const path = action.payload.path;
      action.payload?.overwrite && objPath.empty(state, path);
      objPath.set(state, path, action.payload.value);
    },
  },
});

export const {
  updateInit,
  updateByPath,
} = configSlice.actions;

export const reducer = configSlice.reducer;
