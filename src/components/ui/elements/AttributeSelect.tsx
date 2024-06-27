/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import obPath from 'object-path';
import merge from 'deepmerge';
import cn from 'classname';
import {ButtonGroup, Col, ColProps} from 'react-bootstrap';

// components
import LinkButton from '../LinkButton';
import Select, {Option as SelectOption} from '~/components/ui/Select';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconRestore, IconShuffle, IconEraser} from '../../icons/app';

// types
import type {ActionMeta, Props as SelectProps} from 'react-select';
import type {Required} from 'utility-types';
import {capitalCase} from 'change-case';
import {isObject} from '~/helpers/object';

export type Option = Omit<SelectOption, 'desc'>;

interface Props {
  disabled?: boolean;
  colProps?: ColProps;
  allowShuffle?: boolean;
  allowRestore?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps;
  options?: Option[] | string[];
  value?: null | string | string[] | Option | Option[];
  className?: string;

  onClear?(): void;

  onShuffle?(): void;

  onRestore?(): void;

  onChange?(option: Option | any, actionMeta: ActionMeta<unknown>): void;

  onSelect?(option: Option): void;
}

const valueToOption = (value: null | string | string[] | Option | Option[]): Option | Option[] | null => {
  if ('string' === typeof value) { // handles: string
    return {label: capitalCase(value), value};
  }

  if (isObject(value)) { // handles: Option
    return value as Option;
  }

  if (Array.isArray(value)) {
    const options: Option[] = [];
    for (const option of value) {
      if ('string' === typeof option) {
        options.push(valueToOption(option) as Option);
      }
      if (isObject(option)) {
        options.push(option as Option);
      }
    }

    return options;
  }

  return value; // handles: null
};

export const STYLES_MULTI = {
  control: (styles: any) => ({
    ...styles, backgroundColor: 'rgb(42 50 66)',
    borderColor: '#2b3345',
    minHeight: 35,
  }),
};
/** AttributeSelect functional component */
const AttributeSelect = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    colProps: {},
    options: [],
    value: null,
    className: '',
    allowShuffle: false,
    allowRestore: false,
    allowClear: false,
    onClear() {
    },
    onShuffle() {
    },
    onRestore() {
    },
    onChange() {
    },
    onSelect() {
    },
    selectProps: {},
  }, props);

  if (obPath.get(newProps, 'selectProps.isMulti', false)) {
    obPath.set(newProps, 'selectProps.styles.control', STYLES_MULTI.control);
  }

  return (
    <Col sm="10" {...newProps.colProps}>
      <div className={cn('float-left w-50', newProps?.className)}>
        <Select
          isDisabled={newProps.disabled}
          menuPortalTarget={document.body}
          value={valueToOption(newProps?.value)}
          options={newProps?.options}
          placeholder="Choose..."
          onChange={(option: Option | any, meta): void => {
            newProps.onChange(option, meta);
            if (meta.action === 'select-option' && option) {
              newProps.onSelect(option);
            }
          }}
          {...newProps.selectProps}
        />
      </div>
      <div className="float-left">
        <ButtonGroup className="mt-1">
          {newProps.allowShuffle && (
            <LinkButton
              disabled={newProps.disabled}
              className="mr-1"
              title="Randomize value"
              onClick={() => newProps.onShuffle()}>
              <IconShuffle width="16" height="16"/>
            </LinkButton>
          )}
          {newProps.allowRestore && (
            <LinkButton
              disabled={newProps.disabled}
              title="Restore default value"
              onClick={() => newProps.onRestore()}>
              <IconRestore width="18" height="18"/>
            </LinkButton>
          )}
          {newProps.allowClear && (
            <LinkButton
              disabled={newProps.disabled}
              title="Clear current value"
              onClick={() => newProps.onClear()}>
              <IconEraser
                width="18" height="18"
                color={newProps.disabled ? COLOR_DISABLED : COLOR_REDDISH}/>
            </LinkButton>
          )}
        </ButtonGroup>
      </div>
      <div className="clearfix"></div>
    </Col>
  );
};

export default React.memo(AttributeSelect);
