/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

// types
import type {scenario} from '~/data/scenario/parser/types';

export interface ScenarioState {
  name: string,
  values: scenario.Scenario;
  template: string;
  strings: string;
}
