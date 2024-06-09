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
import {Button, Col, Form, Row} from 'react-bootstrap';

// icons
import {IconCondition} from '~/components/icons/app';

// elemental components
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';

// utils
import * as random from '~/utils/random';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {toEntityCount} from '~/utils/units';
import {
  COUNTERS, defaultsParams,
  ENTITY_COUNT_MAX, ENTITY_COUNT_MIN
} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import {
  CounterType,
  ComparisonType,
  ConditionEntityCountReached as ConditionAttributes,
} from '~/types/condition.types';
import type {EntityType} from '~/types/entity.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'EntityCountReached';

const EntityCountReached = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    counter: 'All',
    value: 1,
    onChange: () => {
    },
  }, defaultsParams.entityCountReached as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    counter: newProps.counter as CounterType,
    entityType: newProps.entityType as EntityType,
    value: newProps.value as number,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !String(attributes?.entityType ?? '').trim()
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` counter="${attributes?.counter}"`
        + ` entity_type="${attributes?.entityType}"`
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
      props?.counter && setAttribute('counter', props.counter);
      props?.entityType && setAttribute('entityType', props.entityType);
      props?.value && setAttribute('value', toEntityCount(props.value));
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10"><IconCondition width="17" height="17" color="#ff8a65"/> <strong>Condition</strong>:
          EntityCountReached</Col>
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
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 7}}>
              Counter
            </span>
        </Col>
        <Col xs="4">
          <Select
            isDisabled={!attributes.enabled}
            menuPortalTarget={document.body}
            defaultValue={{label: capitalCase(newProps.counter as string), value: newProps.counter}}
            options={COUNTERS.map(value => ({label: capitalCase(value), value}))}
            placeholder="Choose counter..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setAttribute('counter', option.value);
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 7}}>
              Entity Type
            </span>
        </Col>
        <Col xs="5">
          <Select
            isDisabled={!attributes.enabled}
            menuPortalTarget={document.body}
            options={ENTITIES_OPTIONS}
            placeholder="Choose..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setAttribute('entityType', option.value);
              }
            }}
          />
        </Col>
      </Row>
      <Row className="mb-1 mt-3">
        <Col xs="2">
            <span className="position-relative" style={{top: 7}}>
              Value
            </span>
        </Col>
        <Col xs="6">
          <span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !attributes.enabled})}>{attributes.value}</code>
									</span>
          <Button disabled={!attributes.enabled}
                  className="button-reset-sm" variant="link"
                  onClick={() => setAttribute('value', random.randomEntityCount())}>
            Random
          </Button>
          <Slider
            min={ENTITY_COUNT_MIN}
            max={ENTITY_COUNT_MAX}
            step={1} disabled={!attributes.enabled}
            value={Number(attributes.value)}
            onChange={value => setAttribute('value', Number(value))}/>
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
EntityCountReached.propTypes = {
  enabled: PropTypes.bool,
  counter: PropTypes.oneOf(COUNTERS),
  entityType: PropTypes.oneOf(ENTITIES),
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default EntityCountReached;
