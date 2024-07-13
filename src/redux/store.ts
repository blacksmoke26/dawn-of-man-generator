/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {configureStore, combineSlices} from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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

const persistedReducer = persistReducer({
  key: 'dow-state',
  version: 1,
  storage,
  whitelist: ['config'],
}, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: ENV_DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
