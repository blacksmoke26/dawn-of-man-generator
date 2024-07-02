// noinspection HtmlUnknownAnchorTarget

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import {Button, ButtonProps, Form} from 'react-bootstrap';

// icons
import {
  COLOR_DISABLED,
  COLOR_REDDISH, IconChevronDown, IconChevronSimpleDown, IconChevronSimpleUp, IconChevronUp,
  IconClear, IconCondition, IconConditionAnd, IconConditionLogical, IconConditionNot, IconConditionOr,
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

export const ToggleCheckbox = (props: { attr: boolean, disabled: boolean, onClick: () => void }) => (
  <span
    className={cn('mr-1', {'text-muted': !props.attr})}>
      <a href="#disable"
         className={cn({'text-muted': props.disabled})}
         onClick={(e) => {
           e.preventDefault();
           props.onClick();
         }} style={{
        cursor: !props.disabled ? 'pointer' : 'default',
        color: '#FFF',
      }}>
        <span className="position-relative" style={{top: 0}}>

        <IconConditionLogical
          width="17" height="17"
          color={!props.attr ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition:</strong>
          {' '} SubConditions
      </span>
      </a>
    </span>
);

export const OperatorIcon = (props: { operator: LogicalCondition, disabled: boolean }) => (
  <div className={cn('d-inline-block', {'text-muted-deep': props.disabled})}>
    <strong
      style={{color: '#ebeaea'}}
      className={cn('text-size-sm')}>
      {conditionIcon(props.operator)}
      {' '}
      <span className="position-relative" style={{top: '0.01rem'}}>
        {props.operator?.toUpperCase()}
      </span>
    </strong>
  </div>
);

export const ToggleIcon = (props: {
  disabledCheckbox: boolean,
  expanded: boolean,
  disabled: boolean,
  onClick: () => void
}) => {
  return (
    <div className="d-inline-block ml-2">
      <Button
        variant="link" className="p-0" style={{top: '-0.080rem'}}
        disabled={props.disabledCheckbox || props.disabled}
        onClick={() => props.onClick()}>
        {!props.expanded
          ? <IconChevronSimpleUp width="16" height="16"/>
          : <IconChevronSimpleDown width="16" height="16"/>}
      </Button>
    </div>
  );
};
export const ToggleExpand = (props: { disabledCheckbox: boolean, disabled: boolean, onChange: (state: boolean) => void }) => (
  <Form.Check
    type="switch"
    id={`switch-${nanoid(5)}`}
    label={(
      <span className="position-relative" style={{top: 0}}>
        <span className={cn({'text-muted': props.disabled})}>
          <IconCondition
            width="17" height="17"
            color={props.disabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition:</strong>
          {' '} SubConditions
        </span>
      </span>
    )}
    checked={!props.disabled}
    disabled={props.disabledCheckbox}
    onChange={e => props.onChange(e.target.checked)}
  />
);
