/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

// types
import type {ObjectTemplateAttributes} from '~/utils/objects';

export type InitialValues = ObjectTemplateAttributes;

export interface ValuesState {
  density: {
    disabled?: boolean
    value: number;
  };
  angle: {
    disabled?: boolean;
    min: number;
    max: number;
  };
  altitude: {
    disabled?: boolean;
    min: number;
    max: number;
  };
  humidity: {
    disabled?: boolean;
    min: number;
    max: number;
  };
}

export const toTemplateValues = (values: ValuesState, allowRender: boolean = true): InitialValues => {
  const changed: InitialValues = {};

  if (!allowRender) {
    return changed;
  }

  if (!values.density.disabled) {
    changed.density = values.density.value;
  }

  if (!values.angle.disabled) {
    changed.angle = [
      values.angle.min,
      values.angle.max,
    ];
  }

  if (!values.altitude.disabled) {
    changed.altitude = [
      values.altitude.min,
      values.altitude.max,
    ];
  }

  if (!values.humidity.disabled) {
    changed.humidity = [
      values.humidity.min,
      values.humidity.max,
    ];
  }

  return changed;
};
