/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import type {FormControlProps} from 'react-bootstrap';
import {Button, Form, InputGroup} from 'react-bootstrap';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconEraser, IconRestore, IconShuffle} from '~/components/icons/app';

// types
import type {Required} from 'utility-types';

export interface Props {
  disabled?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  allowRestore?: boolean;
  value?: string | number;
  decimals?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  inputProps?: FormControlProps;

  shuffle?: boolean;

  onChange?(value: string | number): void;

  onShuffle?(): void;
  onRestore?(): void;
}

const sanitizeInput = (value: string, decimal: number = 0): string => {
  if (value === '') {
    return value;
  }

  if (decimal === 0) {
    return String(value).replace(/\D+/, '');
  }

  if (value.replace(/^\d+,/, '').length > decimal) {
    value = Number(value).toFixed(decimal);
  }

  return value.replace('.0', '');
};

const decimalToStep = (decimal: number): string => {
  return decimal === 0 ? '1' : `.${''.padStart(decimal - 1, '0')}1`;
};

/** NumberInput functional component */
const NumberInput = (props: Props) => {
  const inputRef = React.useRef<HTMLInputElement>();

  const newProps = merge<Required<Props>>({
    disabled: false,
    decimals: 0,
    allowClear: false,
    allowRestore: false,
    shuffle: false,
    value: '',
    min: 0,
    max: 999,
    maxLength: 3,
    placeholder: 'e.g., 150',
    inputProps: {},
    onChange() {
    },
    onShuffle() {
    },
    onRestore() {
    },
  }, props);

  return (
    <InputGroup>
      <Form.Control
        type="number"
        size="sm"
        min={newProps.min}
        maxLength={newProps.maxLength}
        disabled={newProps.disabled}
        max={newProps.max}
        aria-disabled={newProps.disabled}
        id={`number-${nanoid(5)}`}
        placeholder={newProps.placeholder}
        value={newProps.value}
        ref={inputRef}
        step={decimalToStep(newProps.decimals)}
        onChange={e => {
          let value = sanitizeInput(e.currentTarget.value, newProps.decimals)
            || (newProps.allowClear ? '' : newProps.min);

          if (Number(value) > newProps.max) {
            value = newProps.max.toString();
          }
          newProps.onChange(value);
        }}
        onKeyUp={e => {
          // @ts-ignore
          e.currentTarget.value = sanitizeInput(e.currentTarget.value, newProps.decimals)
            || (newProps.allowClear ? '' : newProps.min);

          if (Number(e.currentTarget.value) > newProps.max) {
            e.currentTarget.value = newProps.max.toString();
          }
        }}
        {...newProps.inputProps}
      />
      {newProps.shuffle && (
        <Button
          disabled={newProps.disabled}
          title="Randomize value"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})} variant="link"
          onClick={() => {
            newProps.onShuffle();
            inputRef?.current?.focus();
          }}>
          <IconShuffle width="16" height="16"/>
        </Button>
      )}
      {newProps.allowRestore && (
        <Button
          disabled={newProps.disabled}
          title="Restore default value"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})}
          variant="link"
          onClick={() => newProps.onRestore()}>
          <IconRestore width="19" height="19"/>
        </Button>
      )}
      {newProps.allowClear && (
        <Button
          disabled={newProps.disabled}
          title="Clear"
          className="button-reset-sm ml-2"
          style={{color: newProps.disabled ? COLOR_DISABLED : COLOR_REDDISH}}
          variant="link"
          onClick={() => {
            newProps.onChange('');
            inputRef?.current?.focus();
          }}>
          <IconEraser width="19" height="19"/>
        </Button>
      )}
    </InputGroup>
  );
};

export default NumberInput;
