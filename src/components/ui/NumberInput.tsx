/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, Form, InputGroup} from 'react-bootstrap';

// hooks
import {useDebouncedCallback} from 'use-debounce';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconEraser, IconRestore, IconShuffle} from '~/components/icons/app';

// utils
import {decimalToStep} from '~/helpers/number';
import {handleKeyDownEvent, normalizeNumber} from '~/components/ui/libs/tag-input';

// types
import type {Required} from 'utility-types';
import type {FormControlProps} from 'react-bootstrap';

export interface Props {
  /** Input should be disabled or not
   * @default false */
  disabled?: boolean;

  /** Number of decimals
   * @default 0 */
  decimals?: number;
  /** Minimum number limit
   * @default 0 */
  min?: number;
  /** Maximum number limit
   * @default 100 */
  max?: number;
  /** Maximum number of allowed characters
   * @default 3 */
  maxLength?: number;
  /** Input value */
  value?: string | number;

  /** Input properties pass to FormControl component
   * @default 3 */
  inputProps?: FormControlProps;
  /** Input placeholder text */
  placeholder?: string;
  /** A text display at the beginning */
  labelBefore?: React.ReactNode;
  /** A text display at the end */
  labelAfter?: React.ReactNode;

  /** Input `title` attribute to display a tooltip on hover */
  tooltip?: string;
  /** Hint (form text) to display after the input */
  hints?: React.ReactNode;

  /** Display shuffle icon button */
  shuffle?: boolean;
  /** Display clear icon button */
  allowClear?: boolean;
  /** Display restore icon button */
  allowRestore?: boolean;
  /** Allow focus input on mount */
  allowFocus?: boolean;

  /** A callback fire when input has been changed */
  onChange?(value: string | number): void;

  /** A callback fire when clicked on `shuffle` icon button */
  onShuffle?(): void;

  /** A callback fire when clicked on `restore` icon button */
  onRestore?(): void;

  /** A callback fire when clicked on `clear` icon button */
  onClear?(): void;
}


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
    tooltip: '',
    labelBefore: undefined,
    labelAfter: undefined,
    hints: undefined,
    min: 0,
    max: 100,
    maxLength: 3,
    placeholder: '',
    inputProps: {},
    onChange() {
    },
    onShuffle() {
    },
    onRestore() {
    },
    onClear: undefined,
  }, props);

  const numberProps = {
    step: decimalToStep(newProps.decimals),
    min: newProps.min,
    max: newProps.max,
  };

  React.useEffect(() => {
    props?.allowFocus && inputRef.current?.focus();
  }, [props?.allowFocus])

  const debounced = useDebouncedCallback(
    // function
    newProps.onChange,
    // delay in ms
    150, {maxWait: 250},
  );

  return (
    <div className={cn({'text-muted-deep': newProps.disabled})}>
      <InputGroup>
        {newProps?.labelBefore && (
          <InputGroup.Text
            className={cn('ui-input-group-text-before', {'disabled': newProps?.disabled})}>
            {newProps?.labelBefore}
          </InputGroup.Text>
        )}

        {/*<editor-fold desc="Form control">*/}
        <Form.Control
          type="number"
          size="sm"
          min={newProps.min}
          maxLength={newProps.maxLength}
          title={newProps?.tooltip}
          disabled={newProps.disabled}
          aria-disabled={newProps.disabled}
          id={`number-${nanoid(5)}`}
          placeholder={newProps.placeholder}
          value={newProps.value}
          ref={inputRef}
          step={decimalToStep(newProps.decimals)}
          onChange={e => debounced(normalizeNumber(e.currentTarget.value, numberProps))}
          onKeyUp={e => handleKeyDownEvent(e as unknown as any, numberProps)}
          {...newProps.inputProps}
        />
        {/*</editor-fold>*/}

        {newProps?.labelAfter && (
          <InputGroup.Text
            className={cn('ui-input-group-text-after', {'disabled': newProps?.disabled})}>
            {newProps?.labelAfter}
          </InputGroup.Text>
        )}

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
              'function' === typeof newProps?.onClear
                ? newProps?.onClear()
                : newProps.onChange('');
              inputRef?.current?.focus();
            }}>
            <IconEraser width="19" height="19"/>
          </Button>
        )}
      </InputGroup>
      {newProps?.hints && (
        <Form.Text
          className={cn('text-xxs position-relative', {'text-muted-deep': newProps.disabled})}
          style={{top: -3}}>
          {newProps?.hints}
        </Form.Text>
      )}
    </div>
  );
};

export default NumberInput;
