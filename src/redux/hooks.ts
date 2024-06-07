/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {useDispatch, useSelector} from 'react-redux';

// types
import type {AppDispatch, RootState} from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
