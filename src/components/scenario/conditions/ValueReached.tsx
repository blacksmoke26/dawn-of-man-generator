/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import NumberInput from '~/components/ui/NumberInput';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import {toString} from '~/helpers/string';
import {toInteger} from '~/helpers/number';
import {defaultsParams, VALUE_REACHED} from '~/utils/condition';
import {toValueReachedTemplate} from '~/utils/parser/templates';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionValueReached as ConditionAttributes, ValueReachedType} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;
  showCheckbox?: boolean,

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'ValueReached';

const ValueReached = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    showCheckbox: true,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.valueReached as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    id: toString<ValueReachedType>(newProps.id),
    value: toInteger(newProps?.value),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  // Reflect state changes
  React.useEffect(() => {
    const args: [string, Attributes] = !attributes.enabled
      ? ['', {} as Attributes]
      : [toValueReachedTemplate(attributes), attributes];

    typeof newProps.onChange === 'function' && newProps.onChange.apply(null, args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setAttribute('enabled', props.enabled);
    props?.disabledCheckbox !== undefined && setAttribute('disabledCheckbox', props.disabledCheckbox);
    props?.expanded !== undefined && setAttribute('expanded', props.expanded);

    if (props?.enabled) {
      props?.id !== undefined && setAttribute('id', props.id?.toString());
      props?.value !== undefined && setAttribute('value', props.value?.toString()?.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={attributes.enabled}
        onEnabled={(isEnabled: boolean) => setAttribute('enabled', isEnabled)}
        disabledCheckbox={attributes.disabledCheckbox}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(state: boolean) => setAttribute('expanded', state)}
        expanded={attributes.expanded}/>
      {attributes?.expanded && (
        <>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>ID</div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                isSearchable={false}
                defaultValue={attributes?.id ? {label: attributes.id, value: attributes.id} : null}
                menuPortalTarget={document.body}
                options={VALUE_REACHED.map(value => ({label: capitalCase(value), value}))}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setAttribute('id', option.value);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-2">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>Value</div>
            </Col>
            <Col xs="3">
              <NumberInput
                maxLength={4}
                min={1}
                max={9990}
                disabled={isDisabled}
                allowClear={true}
                placeholder="e.g. 350"
                value={attributes?.value}
                onChange={value => setAttribute('value', value)}
                shuffle={false}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
ValueReached.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.oneOf(VALUE_REACHED),
  value: PropTypes.number,
};

export default ValueReached;
