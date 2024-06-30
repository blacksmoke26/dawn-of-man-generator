/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-25
 * @version 2.3.0
 */

import React from 'react';
import merge from 'deepmerge';
import {Props as SelectProps} from 'react-select';
import CreatableSelect from 'react-select/creatable';

// styles
import {styles, theme} from './libs/select';

// styles
import {valuesToOptions, createOption, filterUniqueOptions} from './libs/tag-input';

// types
import type {Required} from 'utility-types';
import type {KeyboardEventHandler} from 'react';
import type {Option} from './libs/tag-input';

export interface Props {
  options?: Option[];
  styles?: SelectProps['styles'];
  allowClear?: boolean;
  placeholder?: string;
  value?: (string | number)[];
  selectProps?: SelectProps;
  /**
   * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
   */
  enterKey?: string;

  onChange?(values: string[]): void;

  onInputChange?(value: string): string;

  onValidate?(value: string): boolean;

  onLabelTransform?(label: string): string;

  onValueTransform?(value: string): string;
}

/** TagInput functional component */
const TagInput = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    options: [],
    selectProps: {},
    allowClear: true,
    styles: {},
    placeholder: 'Type and press enter...',
    enterKey: 'Enter',
    onChange() {
    },
    onValidate() {
      return true;
    },
    onValueTransform(value) {
      return value;
    },
    onLabelTransform(label) {
      return label;
    },
    onInputChange(value) {
      return value;
    },
  }, props || {});

  const [inputValue, setInputValue] = React.useState<string>('');
  const [value, setValue] = React.useState<readonly Option[]>(valuesToOptions(newProps.value));

  React.useEffect(() => {
    newProps.onChange(value?.map(opt => opt?.value));
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [value]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    switch (event.key) {
      case newProps.enterKey:
        if (newProps.onValidate(inputValue)) {
          setValue(prev => filterUniqueOptions([...prev, createOption(
            newProps.onValueTransform(inputValue.trim()),
            newProps.onLabelTransform(inputValue.trim()),
          )]));
          setInputValue('');
        }

        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      isMulti
      options={valuesToOptions(newProps.value)}
      menuIsOpen={false}
      components={{DropdownIndicator: null}}
      inputValue={inputValue}
      isClearable={newProps.allowClear}
      onChange={newValue => setValue(newValue as Option[])}
      onInputChange={newValue => setInputValue(newProps.onInputChange(newValue))}
      onKeyDown={handleKeyDown}
      placeholder={newProps.placeholder}
      value={filterUniqueOptions(valuesToOptions(newProps.value))}
      theme={theme}
      styles={merge<SelectProps['styles']>(styles, newProps.styles)}
      {...newProps.selectProps}
    />
  );
};

export default TagInput;
