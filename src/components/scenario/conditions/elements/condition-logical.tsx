/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';

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

interface CButtonProps {
  onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
  buttonProps?: Partial<ButtonProps>;
  disabled?: boolean;
}

export const RemoveButton = (props: CButtonProps = {}) => {
  const newProps = {
    disabled: false,
    buttonProps: {},
    onClick() {
    },
    ...props,
  } as CButtonProps;

  return (
    <div className="d-inline-block ml-1">
      <Button
        variant="link" className="p-0"
        style={{top: '-0.10rem', color: newProps?.disabled ? 'rgba(255, 255, 255, 0.4)' : COLOR_REDDISH}}
        title="Remove condition"
        disabled={newProps.disabled}
        onClick={newProps.onClick}
        {...(newProps.buttonProps || {})}>
        <IconClear width="16" height="16"/>
      </Button>
    </div>
  );
};

export const CollapseAllButton = (props: CButtonProps = {}) => {
  const newProps = {
    disabled: false,
    buttonProps: {},
    onClick() {
    },
    ...props,
  } as Required<CButtonProps>;

  return (
    <div className="d-inline-block">
      <Button
        variant="link" className="p-0"
        title="Collapse all conditions"
        style={{top: '-0.2rem', marginRight: '0.1rem'}}
        disabled={newProps.disabled}
        onClick={newProps.onClick}
        {...(newProps.buttonProps || {})}>
        <IconChevronUp width="16" height="16"/>
      </Button>
    </div>
  );
};

export const ExpandAllButton = (props: CButtonProps = {}) => {
  const newProps = {
    disabled: false,
    buttonProps: {},
    onClick() {
    },
    ...props,
  } as Required<CButtonProps>;

  return (
    <div className="d-inline-block ml-1">
      <Button
        variant="link" className="p-0"
        title="Expand all conditions"
        style={{top: '-0.2rem', marginRight: '0.05rem'}}
        disabled={newProps.disabled}
        onClick={newProps.onClick}
        {...(newProps.buttonProps || {})}>
        <IconChevronDown width="16" height="16"/>
      </Button>
    </div>
  );
};

export const RemoveAllButton = (props: CButtonProps = {}) => {
  const newProps = {
    disabled: false,
    buttonProps: {},
    onClick() {
    },
    ...props,
  } as Required<CButtonProps>;

  return (
    <div className="d-inline-block">
      <Button
        variant="link" className="p-0 ml-1"
        style={{
          top: '-0.20rem',
          color: newProps.disabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH,
        }}
        title="Remove all sub conditions"
        disabled={newProps.disabled}
        onClick={newProps.onClick}
        {...(newProps.buttonProps || {})}>
        <IconClear width="16" height="16"/>
      </Button>
    </div>
  );
};
