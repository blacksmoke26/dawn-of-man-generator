/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {configureStore, combineSlices} from '@reduxjs/toolkit';

// utils
import {ENV_DEV} from '~/utils/env';

// reducers
import {reducer as configReducer} from './slices/config/reducers';
import {reducer as environmentReducer} from './slices/environment/reducers';
import {reducer as scenarioReducer} from './slices/scenario/reducers';

// Combine the slices using combineSlices to create a single root reducer
// @see https://borstch.com/snippet/combining-multiple-slices-with-combineslices
const rootReducer = combineSlices({
  config: configReducer,
  environment: environmentReducer,
  scenario: scenarioReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: ENV_DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
