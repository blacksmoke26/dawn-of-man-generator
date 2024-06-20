/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

// utils
import {ENV_DEV} from '~/utils/env';

// types
import type {ConfigurationState} from './reducers.types';

/** Redux store initial state */
export default {
  initiated: false,
  panels: {
    showXmlToJson: ENV_DEV,
    showXmlToScenario: ENV_DEV,
  },
} as ConfigurationState;
