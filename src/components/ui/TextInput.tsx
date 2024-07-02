/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React, {PropsWithChildren} from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';
import {Button, Form, type FormControlProps, InputGroup} from 'react-bootstrap';

// icons
import {
  COLOR_DISABLED, COLOR_REDDISH,
  IconEraser, IconRestore, IconShuffle
} from '~/components/icons/app';

// hooks
import {useDebouncedCallback} from 'use-debounce';

// utils
import {type CaseTypeFull, toTextCase} from '~/utils/strings';

// types
import type {Required} from 'utility-types';

export interface Props {
  disabled?: boolean;
  placeholder?: string;
  allowShuffle?: boolean;
  caseType?: CaseTypeFull;
  allowClear?: boolean;
  allowRestore?: boolean;
  focusOnLoad?: boolean;
  selectOnLoad?: boolean;
  value?: string | number;
  maxLength?: number;
  inputProps?: FormControlProps;

  onChange?(value: string | number): void;

  onShuffle?(): void;

  onRestore?(): void;
}

const TextInput = (props: PropsWithChildren<Props> = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    allowClear: false,
    allowRestore: false,
    caseType: 'DEFAULT',
    allowShuffle: false,
    focusOnLoad: false,
    selectOnLoad: false,
    maxLength: 999999,
    value: '',
    placeholder: 'e.g., protein_hoarding',
    inputProps: {},
    onChange() {
    },
    onShuffle() {
    },
    onRestore() {
    },
  }, props);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const debounced = useDebouncedCallback(
    // function
    newProps.onChange,
    // delay in ms
    60, {maxWait: 250},
  );
  React.useEffect(() => {
    newProps?.focusOnLoad && inputRef?.current?.focus();
    newProps?.selectOnLoad && inputRef?.current?.select();
  }, [newProps?.focusOnLoad, newProps?.selectOnLoad]);

  return (
    <InputGroup>
      <Form.Control
        ref={inputRef}
        type="text"
        size="sm"
        maxLength={newProps.maxLength}
        disabled={newProps.disabled}
        aria-disabled={!newProps.disabled}
        id={`text_input-${nanoid(5)}`}
        value={newProps?.value || ''}
        onChange={e => {
          debounced(toTextCase(e.currentTarget.value, newProps.caseType, 'CHANGE'));
          //newProps.onChange(value);
        }}
        onKeyUp={e => {
          // @ts-ignore
          e.currentTarget.value = toTextCase(e.currentTarget.value, newProps.caseType, 'KEYUP');
        }}
        placeholder={newProps.placeholder}
        {...newProps.inputProps}
      />
      {newProps.allowShuffle && (
        <Button
          disabled={newProps.disabled}
          title="Randomize value"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})}
          variant="link"
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
          title="Restore default"
          className={cn('button-reset-sm ml-2', {'text-white': !newProps.disabled})}
          variant="link"
          onClick={() => newProps.onRestore()}>
          <IconRestore width="19" height="19"/>
        </Button>
      )}
      {newProps.allowClear && (
        <Button
          disabled={newProps.disabled}
          title="Clear value"
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
      {props?.children}
    </InputGroup>
  );
};

export default TextInput;

