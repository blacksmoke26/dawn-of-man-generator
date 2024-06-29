/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import type {UseValuesHook} from '~/hooks/use-values.types';

export const actionDefaultProps = {
  disabled: false,
  disabledCheckbox: false,
  removeIcon: false,
  showCheckbox: true,
  showHeader: true,
  expanded: true,
  initialValues: {},
  onChange: () => {
  },
  onTemplate: () => {
  },
  onValuesChange: () => {
  },
  onRemoveClick: () => {
  },
};

export const optionalDefaultValueSetter = (valuer: UseValuesHook<any>, property: string, defaultValue: any) => {
  if (valuer.get(property) === undefined) {
    valuer.set(property, defaultValue);
  }
};
