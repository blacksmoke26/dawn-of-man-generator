import React from 'react';
import merge from 'deepmerge';
import ReactSelect, {Props} from 'react-select';

import {styles, theme} from './libs/select';

export interface Option {
  label: string;
  desc?: string;
  value: string;
}

const Select = (props: Props) => {
  return (
    <ReactSelect {...props} theme={theme} styles={merge(styles, props?.styles ?? {})}/>
  );
};

export default Select;
