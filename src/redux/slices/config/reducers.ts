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

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateInit(state, action: PayloadAction<boolean>) {
      state.initiated = action.payload;
    },
    updateByPath(state, action: PayloadAction<{ path: Path; value: any }>) {
      const {path, value} = action.payload;
      objPath.set(state, path, value);
    },
  },
});

export const {
  updateInit,
  updateByPath,
} = configSlice.actions;

export const reducer = configSlice.reducer;
