import React from 'react';
import merge from 'deepmerge';
import ReactSelect, {Props, OptionsOrGroups, GroupBase} from 'react-select';

import {styles, theme} from './libs/select';

export interface Option {
  [key: string]: any;

  label: string;
  value: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export type Options = OptionsOrGroups<Option, GroupBase<Option>>;

const Select = (props: Props) => {
  return (
    <ReactSelect {...props} theme={theme} styles={merge(styles, props?.styles ?? {})}/>
  );
};

export default Select;
