/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Row} from 'react-bootstrap';

// elemental components
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// icons
import {IconFlag} from '~/components/icons/app';

// utils
import {EVENT_FLAGS_OPTIONS} from '~/utils/event';

// types
import type {Required} from 'utility-types';

export interface Props {
  disabled?: boolean;
  value?: string[];

  onChange?(items: string[]): void;
}

/** FlagsDropdown functional component */
const FlagsDropdown = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    value: [],
    onChange() {
    },
  }, props);

  return (
    <>
      <Row className="mt-2">
        <PropertyLabel
          colProps={{sm: 1, style: {marginTop: 4}}}
          caption={(<><IconFlag width="16" height="16"/> {' '} Flags</>)}
          disabled={props.disabled}
        />
        <AttributeSelect
          className="w-75"
          colProps={{sm: 8}}
          disabled={newProps.disabled}
          options={EVENT_FLAGS_OPTIONS}
          value={newProps?.value?.map(value => ({value, label: capitalCase(value)})) || []}
          selectProps={{
            isSearchable: false, isMulti: true,
            placeholder: 'Choose flags...',
            formatOptionLabel: (option: Option | any) => (
              <><IconFlag width="17" height="17"/>{' '} {option?.label}</>
            ),
          }}
          onChange={(option, {action}) => {
            if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
              newProps?.onChange(option?.map(({value}) => value) || []);
            }
          }}
          allowClear
          onClear={() => newProps?.onChange([])}
        />
      </Row>
    </>
  );
};

export default FlagsDropdown;
