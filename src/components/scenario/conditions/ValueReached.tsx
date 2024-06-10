// noinspection HtmlUnknownAttribute

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Col, Form, Row} from 'react-bootstrap';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {defaultsParams, ENTITY_COUNT_DEFAULT, VALUE_EQUALS, VALUE_REACHED} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {ConditionValueReached as ConditionAttributes, ValueReachedType} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'ValueReached';

const ValueReached = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    value: ENTITY_COUNT_DEFAULT,
    onChange: () => {
    },
  }, defaultsParams.valueReached as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    id: newProps.id as ValueReachedType,
    value: newProps.value as number,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled
    || !String(attributes?.id ?? '').trim()
    || !String(attributes?.value ?? '').trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` id="${attributes?.id}"`
        + ` value="${attributes?.value}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    'enabled' in props && setAttribute('enabled', props.enabled);

    if (attributes.enabled) {
      props?.id && setAttribute('id', props.id?.toString());
      props?.value && setAttribute('value', props.value?.toString()?.trim());
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: ValueReached
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`condition-switch-${nanoid(5)}`}
            label=""
            checked={attributes.enabled}
            onChange={e => setAttribute('enabled', e.target.checked)}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>ID</div>
        </Col>
        <Col xs="5">
          <Select
            isDisabled={!attributes.enabled}
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
          <Form.Control
            type="number"
            size="sm"
            maxLength={4}
            min={1}
            max={9990}
            disabled={!attributes.enabled}
            className="pull-right"
            aria-disabled={!attributes.enabled}
            id={`condition-${nanoid(5)}`}
            placeholder="e.g., 50"
            value={attributes?.value || ''}
            onChange={e => setAttribute('value', Number(String(e.target.value).replace(/\D+/, '')) || 0)}
            onKeyUp={e => {
              // @ts-ignore
              e.target.value = Number(String(e.target.value).replace(/\D+/, '')) || 0;
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
ValueReached.propTypes = {
  enabled: PropTypes.bool,
  id: PropTypes.oneOf(VALUE_REACHED),
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default ValueReached;