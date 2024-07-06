/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

// types
import type {environment} from '~/data/environments/parser/types';

export interface EnvironmentState {
  name: string,
  values: environment.Environment;
  template: string;
  strings: string;
}
