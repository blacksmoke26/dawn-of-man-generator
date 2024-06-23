/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

// types
import type {Scenario} from '~/types/scenario.types';

export interface ScenarioState {
  name: string,
  values: Scenario;
  template: string;
  strings: string;
}
