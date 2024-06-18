/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import {Button} from 'react-bootstrap';

// icons
import {
  COLOR_REDDISH, IconChevronDown, IconChevronUp,
  IconClear, IconConditionAnd, IconConditionNot, IconConditionOr,
} from '~/components/icons/app';

// types
import type {LogicalCondition} from '~/types/condition.types';

export const conditionIcon = (operator: LogicalCondition) => {
  return operator === 'And'
    ? <IconConditionAnd/>
    : (operator === 'Not'
      ? <IconConditionNot/>
      : <IconConditionOr/>);
};

export const RemoveButton = (props: { disabledCheckbox: boolean, onClick: () => void }) => (
  <div className="d-inline-block ml-1">
    <Button
      variant="link" className="p-0"
      style={{top: '-0.10rem', color: props.disabledCheckbox ? 'rgba(255, 255, 255, 0.4)' : COLOR_REDDISH}}
      title="Remove condition"
      disabled={props.disabledCheckbox}
      onClick={props.onClick}>
      <IconClear width="16" height="16"/>
    </Button>
  </div>
);

export const CollapseAllButton = (props: { disabled: boolean, onClick: () => void }) => (
  <div className="d-inline-block">
    <Button variant="link" className="p-0"
            title="Collapse all conditions"
            style={{top: '-0.2rem', marginRight: '0.1rem'}}
            disabled={props.disabled}
            onClick={props.onClick}>
      <IconChevronUp width="16" height="16"/>
    </Button>
  </div>
);

export const ExpandAllButton = (props: { disabled: boolean, onClick: () => void }) => (
  <div className="d-inline-block ml-1">
    <Button variant="link" className="p-0"
            title="Expand all conditions"
            style={{top: '-0.2rem', marginRight: '0.05rem'}}
            disabled={props.disabled}
            onClick={props.onClick}>
      <IconChevronDown width="16" height="16"/>
    </Button>
  </div>
);

export const RemoveAllButton = (props: { disabled: boolean, onClick: () => void }) => (
  <div className="d-inline-block">
    <Button
      variant="link" className="p-0 ml-1"
      style={{
        top: '-0.20rem',
        color: props.disabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH,
      }}
      title="Remove all sub conditions"
      disabled={props.disabled}
      onClick={props.onClick}>
      <IconClear width="16" height="16"/>
    </Button>
  </div>
);
