/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

// components
import Select, {Option} from '~/components/ui/Select';

// icons
import {COLOR_GRAYED, COLOR_ORANGE, COLOR_WHITISH, IconEnvironment} from '~/components/icons/app';

// utils
import {EnvironmentName, presetOptions, presetsXmlToJson} from '~/data/environments/builtin';

// redux
import {useAppDispatch} from '~redux/hooks';
import {overwriteValues, resetValues} from '~redux/slices/environment/reducers';

// types
import {components, OptionProps, SingleValueProps} from 'react-select';


/**
 * Presets functional component
 */
const Presets = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="mb-2" style={{marginLeft: '0.10em', marginRight: '0.10em'}}>
      <Select
        isSearchable={false}
        components={{
          Option: ({children, ...props}: OptionProps<any>) => (
            <components.Option {...props}>
              <div className="d-flex">
                <div style={{color: !props.isSelected ? (!props.isFocused ? '#fff' : '#8dccff') : COLOR_ORANGE, minWidth: 160}}>
                <IconEnvironment width="13" height="13"/> {props.data?.label}
              </div>
                <div style={{color: props.isSelected ? COLOR_WHITISH : (!props.isFocused ? COLOR_GRAYED : COLOR_WHITISH)}}
                  className="text-size-xxs font-italic font-weight-light">{props.data?.description}</div>
              </div>
            </components.Option>
          ),
          SingleValue: ({children, ...props}: SingleValueProps<any>) => (
            <components.SingleValue {...props}>
              <IconEnvironment width="13" height="13"/> {props.data?.label}
            </components.SingleValue>
          ),
        }}
        isClearable={true}
        getOptionValue={(option: Option | any) => option.value}
        styles={{
          control: styles => ({
            ...styles,
            paddingTop: 1,
            paddingBottom: 0,
            minHeight: 32,
            height: 32,
            borderWidth: 0,
            outline: 0,
          }),
        }}
        menuPortalTarget={document.body}
        options={presetOptions}
        placeholder="Choose to load built-in preset..."
        onChange={(option: Option | any, {action}): void => {
          if (action === 'select-option' && option) {
            const {environment} = presetsXmlToJson(option.value as EnvironmentName);
            dispatch(resetValues());
            setTimeout(() => dispatch(overwriteValues(environment)), 30);
          }
        }}
      />
    </div>
  );
};

export default Presets;
