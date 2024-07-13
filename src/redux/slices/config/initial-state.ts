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
    showXmlToScenario: true,
    showXmlToEnvironment: true,
  },
  session: {
    activeTab: 'environment',
    environment: {
      template: '',
      strings: '',
      filename: 'custom',
      panelsShown: {
        noiseAmplitudes: false,
        terrain: false,
        deposit: false,
        detail: false,
        prop: false,
        trees: false,
        seasons: false,
      },
    },
    scenario: {
      template: '',
      strings: '',
      filename: 'scenario',
      panelsShown: {
        general: false,
        disasters: false,
        milestones: false,
        goals: false,
        events: false,
        locations: false,
      },
    },
    xmlEditor: {
      template: '',
      filename: 'file',
    },
    xmlJson: {
      template: '',
    },
    xmlEnvironment: {
      template: '',
    },
    xmlScenario: {
      template: '',
    },
  },
} as ConfigurationState;
