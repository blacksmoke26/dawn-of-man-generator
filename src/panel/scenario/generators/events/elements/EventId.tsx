/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';

// types
import type {Required} from 'utility-types';

export interface Props {
  disabled?: boolean;
  value?: string;
  onChange?(value: string): void;
}

/** FlagsDropdown functional component */
const EventId = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    value: '',
    onChange() {
    },
  }, props);

  return (
    <div className="mb-2">
      <Row className="mt-2">
        <PropertyLabel
          colProps={{sm: 1, style: {marginTop: 1}}}
          caption="ID"
          disabled={props.disabled}
        />
        <Col sm={6}>
          <TextInput
            caseType="SNAKE_CASE"
            disabled={newProps.disabled}
            maxLength={50}
            allowClear
            value={newProps.value}
            placeholder="e.g., back_to_game"
            onChange={value => newProps.onChange(value as string)}/>
        </Col>
      </Row>
    </div>
  );
};

export default EventId;
