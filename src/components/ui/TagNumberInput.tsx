/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-27
 * @version 2.3.0
 */

import React from 'react';
import merge from 'deepmerge';
import CreatableSelect from 'react-select/creatable';

// utils
import {
  filterUniqueOptions, handleKeyDownHandler,
  normalizeNumber, valuesToOptions,
} from './libs/tag-input';

// styles
import {styles, theme} from './libs/select';

// types
import type {Required} from 'utility-types';
import type {Props as SelectProps} from 'react-select';
import type {Option} from './libs/tag-input';

// public types
export type {Option};

export interface Props {
  disabled?: boolean;
  styles?: SelectProps['styles'];
  allowClear?: boolean;
  placeholder?: string;
  value?: (string | number)[];
  selectProps?: SelectProps;
  decimal?: number;
  step?: number;
  min?: number;
  max?: number;

  /**
   * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
   */
  enterKey?: string;

  onChange?(values: string[]): void;
}

/** TagNumberInput functional component */
const TagNumberInput = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: true,
    value: [],
    selectProps: {},
    allowClear: true,
    styles: {
      control: (styles: any) => ({
        ...styles, backgroundColor: 'rgb(42 50 66)',
        borderColor: '#2b3345',
        minHeight: 39,
        paddingLeft: 2,
        paddingTop: 0,
      }),
      valueContainer: (styles: any) => ({
        ...styles,
        padding: '0 0 0 4px',
      }),
      input: (styles: any) => ({
        ...styles,
        paddingLeft: 3,
      }),
    },
    step: 1,
    placeholder: 'Type and press enter...',
    enterKey: 'Enter',
    min: undefined,
    max: undefined,
    onChange() {
    },
  }, props);

  const [inputValue, setInputValue] = React.useState<string>('');
  const [value, setValue] = React.useState<readonly Option[]>(valuesToOptions(newProps.value));

  React.useEffect(() => {
    newProps.onChange(value?.map(opt => opt?.value));
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [value]);

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    return handleKeyDownHandler({
      event: event as unknown as KeyboardEvent,
      newProps,
      setValue,
      setInputValue,
      inputValue,
    });
  };

  const sanitizedValue = filterUniqueOptions(valuesToOptions(
    newProps.value.map(val => normalizeNumber(val, newProps)),
  ));

  return (
    <CreatableSelect
      isMulti
      isDisabled={newProps.disabled}
      options={valuesToOptions(newProps.value)}
      menuIsOpen={false}
      components={{DropdownIndicator: null}}
      inputValue={inputValue}
      isClearable={newProps.allowClear}
      onChange={newValue => setValue(newValue as Option[])}
      onInputChange={newValue => {
        setInputValue('' + normalizeNumber(newValue, newProps));
      }}
      onKeyDown={handleKeyDown}
      placeholder={newProps.placeholder}
      value={sanitizedValue}
      theme={theme}
      styles={merge<SelectProps['styles']>(styles, newProps.styles)}
      {...newProps.selectProps}
    />
  );
};

export default TagNumberInput;
