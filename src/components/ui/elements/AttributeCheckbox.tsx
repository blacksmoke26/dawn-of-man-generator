/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import merge from 'deepmerge';
import cn from 'classname';
import {Col, ColProps, Form} from 'react-bootstrap';

// components
import {Option as SelectOption} from '~/components/ui/Select';

// types
import type {Required} from 'utility-types';
import {nanoid} from 'nanoid';

export type Option = Omit<SelectOption, 'desc'>;

interface Props {
  disabled?: boolean;
  caption?: React.ReactNode;
  hint?: string;
  colProps?: ColProps;
  checked?: boolean;

  onChange?(state: boolean): void;
}

/** AttributeCheckbox functional component */
const AttributeCheckbox = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    checked: false,
    caption: 'Toggle',
    hint: '',
    colProps: {},
    onChange() {
    },
  }, props);

  return (
    <Col style={{paddingTop: 8}} sm="5" {...newProps.colProps}>
      <Form.Label>
        <Form.Check
          type="switch"
          disabled={newProps.disabled}
          id={`switch-${nanoid(5)}`}
          label=""
          style={{top: -1}}
          className="d-inline p-relative"
          checked={newProps.checked}
          onChange={e => newProps.onChange(e.target.checked)}
        />
        <span
          title={newProps.hint}
          style={{top: -4, textDecoration: newProps.hint.trim() ? 'underline dotted' : ''}}
          className={cn('d-inline-block position-relative', {'text-muted-deep': props?.disabled})}>
          {newProps.caption}
        </span>
      </Form.Label>
    </Col>
  );
};

export default React.memo(AttributeCheckbox);
