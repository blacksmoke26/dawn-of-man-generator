/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import merge from 'deepmerge';
import {Row} from 'react-bootstrap';

// elemental components
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition, IconConditionLogical} from '~/components/icons/app';

// utils
import {CONDITIONS_OPTIONS, LOGICAL_CONDITION} from '~/utils/condition';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';

export interface Props {
  disabled?: boolean;

  onChange?(condition: KVDocument): void;
}

/** ConditionDropdown functional component */
const ConditionDropdown = (props: Props = {}) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    onChange() {
    },
  }, props);

  return (
    <div className="mb-3">
      <div className="mb-2">
        <IconCondition
          width="17" height="17"
          color={newProps.disabled ? COLOR_DISABLED : COLOR_REDDISH}/>
        {' '}
        <strong>Condition</strong>: None
      </div>
      <Row>
        <AttributeSelect
          className="w-75"
          colProps={{sm: '10'}}
          disabled={newProps.disabled}
          options={CONDITIONS_OPTIONS as unknown as Option[]}
          value={null}
          selectProps={{
            isSearchable: true,
            placeholder: 'Choose condition...',
            formatOptionLabel: (option: Option | any) => (
              <>
                {option.type === 'logical' && <IconConditionLogical width="17" height="17" color={COLOR_REDDISH}/>}
                {option.type === 'general' && <IconCondition width="17" height="17" color={COLOR_REDDISH}/>}
                {' '} {option?.label}
              </>
            ),
          }}
          onSelect={(option) => {
            const params: KVDocument = {type: option.value};

            if (LOGICAL_CONDITION.includes(option.value)) {
              params.conditions = [];
            }

            newProps.onChange(params);
          }}
        />
      </Row>
    </div>
  );
};

export default ConditionDropdown;
