/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import {Form} from 'react-bootstrap';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {UseValuesHook} from '~/hooks/use-values.types';
import {optionalDefaultValueSetter} from '~/components/scenario/actions/utils/default';

type UndefinedSetterType =
  | [UseValuesHook<any>, string, any]
  | [UseValuesHook<any>, [string, any][]];

export interface Props {
  caption?: React.ReactNode;
  tooltip?: string,
  disabled?: boolean,
  checked?: boolean
  style?: React.CSSProperties;
  undefinedSetter?: UndefinedSetterType;

  onChange?(state: boolean): void
}

/** PropertyCheckboxLabel functional component */
const PropertyCheckboxLabel = (props: Props = {}) => {
  return (
    <Form.Label className="text-size-sm" column={true} sm="2">
      <Form.Check
        disabled={props?.disabled}
        className={cn('text-size-xs', {'text-white': !props?.disabled})}
        type="switch"
        id={`checkbox-label-${nanoid(5)}`}
        style={props?.style}
        label={(
          <span
            style={{textDecoration: props?.tooltip ? 'underline dotted' : ''}}
            title={props?.tooltip || ''}>
            {props?.caption || 'Untitled'}
        </span>
        )}
        checked={props?.checked}
        onChange={(e) => {
          'function' === typeof props?.onChange && props?.onChange(e.currentTarget.checked);

          if (Array.isArray(props?.undefinedSetter)) {
            const [setter, property, value] = props.undefinedSetter;
            const list = Array.isArray(property) ? property : [[property, value]];
            list.forEach(([prop, val]) => {
              optionalDefaultValueSetter(setter, prop, val);
            });
          }
        }}
      />
    </Form.Label>
  );
};

export default React.memo(PropertyCheckboxLabel);
