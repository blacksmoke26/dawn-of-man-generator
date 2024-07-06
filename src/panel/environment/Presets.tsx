/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

// components
import Select, {Option} from '~/components/ui/Select';

// icons
import {IconEnvironment} from '~/components/icons/app';

// utils
import {BuiltinEnvironmentName, environments, labels} from '~/data/environments/builtin';

// redux
import {useAppDispatch} from '~redux/hooks';
import {updateValuesRaw} from '~redux/slices/environment/reducers';

// types
import type {Json} from '~/types/json.types';

/**
 * Presets functional component
 */
const Presets = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="mb-2">
      <Select
        isSearchable={false}
        formatOptionLabel={(option: Option | any) => {
          return (
            <>
              <div className="text-info" style={{color: '#8dccff'}}>
                <IconEnvironment width="13" height="13"/> {option?.label}
              </div>
              <div className="text-size-xxs text-muted">{option?.desc}</div>
            </>
          );
        }}
        isClearable={true}
        getOptionValue={(option: Option | any) => option.value}
        styles={{
          control: styles => ({...styles, paddingTop: 5, paddingBottom: 5}),
        }}
        menuPortalTarget={document.body}
        options={labels}
        placeholder="Choose to load built-in preset..."
        onChange={(option: Option | any, {action}): void => {
          if (action === 'select-option' && option) {
            if (option.value in environments) {
              const {environment} = environments[option.value as BuiltinEnvironmentName]();
              dispatch(updateValuesRaw(environment as Json));
            }
          }
        }}
      />
    </div>
  );
};

export default Presets;
