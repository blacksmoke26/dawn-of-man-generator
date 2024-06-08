/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

// redux
import {useAppDispatch} from '~redux/hooks';
import {updateEnvironment} from '~redux/reducers';

// components
import XmlImporter from './XmlImporter';
import Select, {Option} from '~/components/ui/Select';

// utils
import {labels, environments} from '~/data/environments/builtin';

// types
import {$Keys} from 'utility-types';
import {Json} from '~/types/json.types';

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
            <div>
              <div className="text-info">{option?.label}</div>
              <div className="text-size-xxs text-muted">{option?.desc}</div>
            </div>
          );
        }}
        isClearable={true}
        getOptionValue={(option: Option | any) => option.value}
        styles={{
          control: styles => ({...styles, paddingTop: 5, paddingBottom: 5}),
        }}
        menuPortalTarget={document.body}
        options={labels}
        placeholder="Choose preset..."
        onChange={(option: Option | any, {action}): void => {
          if (action === 'select-option' && option) {
            const value = option.value as $Keys<typeof environments>;
            const {environment} = environments[value]();
            dispatch(updateEnvironment(environment as Json));
          }
        }}
      />
      <XmlImporter/>
    </div>
  );
};

export default Presets;
