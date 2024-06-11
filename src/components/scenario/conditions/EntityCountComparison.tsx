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
import {capitalCase} from 'change-case';
import {Button, Col, Row} from 'react-bootstrap';

// elemental components
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import * as random from '~/utils/random';
import {toString} from '~/helpers/string';
import {toInteger} from '~/helpers/number';
import {toEntityCount} from '~/utils/units';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {COMPARISONS, COUNTERS, defaultsParams, ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {EntityType} from '~/types/entity.types';
import type {
  ComparisonType,
  ConditionEntityCountComparison as ConditionAttributes,
  CounterType,
} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
}

interface Props extends Attributes {
  removeIcon?: boolean;

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'EntityCountComparison';

const EntityCountComparison = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.entityCountComparison as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    counter: toString<CounterType>(newProps.counter),
    entityType: toString<EntityType>(newProps.entityType),
    value: toInteger(newProps.value) as number,
    comparison: toString<ComparisonType>(newProps.comparison),
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
        + ` value="${attributes?.value}"`
        + ` comparison="${attributes?.comparison}"/>`
      );
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);
    setAttribute('expanded', props.expanded);

    if (props.enabled) {
      props?.counter && setAttribute('counter', props.counter);
      props?.entityType && setAttribute('entityType', props.entityType);
      props?.value && setAttribute('value', toEntityCount(props.value));
      props?.comparison && setAttribute('comparison', props.comparison);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isDisabled = attributes.disabledCheckbox || !attributes.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader caption={CONDITION_NAME}
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
              <div className="position-relative pl-3" style={{top: 7}}>
                Counter
              </div>
            </Col>
            <Col xs="4">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                defaultValue={newProps?.counter ? {
                  label: capitalCase(newProps.counter as string),
                  value: newProps.counter
                } : null}
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
              <div className="position-relative pl-3" style={{top: 7}}>
                Entity Type
              </div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={ENTITIES_OPTIONS}
                defaultValue={newProps?.entityType ? {
                  label: capitalCase(newProps.entityType as string),
                  value: newProps.entityType
                } : null}
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
              <div className="position-relative pl-3" style={{top: 7}}>
                Comparison
              </div>
            </Col>
            <Col xs="4">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={COMPARISONS.map(value => ({label: capitalCase(value), value}))}
                placeholder="Choose..."
                defaultValue={newProps?.comparison
                  ? {label: capitalCase(newProps.comparison), value: newProps.comparison}
                  : null
                }
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setAttribute('comparison', option.value);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Value
              </div>
            </Col>
            <Col xs="6">
          <span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': isDisabled})}>{attributes.value}</code>
									</span>
              <Button disabled={isDisabled}
                      className="button-reset-sm" variant="link"
                      onClick={() => setAttribute('value', random.randomEntityCount())}>
                Random
              </Button>
              <Slider
                min={ENTITY_COUNT_MIN}
                max={ENTITY_COUNT_MAX}
                step={1} disabled={isDisabled}
                value={toInteger(attributes.value)}
                onChange={value => setAttribute('value', Number(value))}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
EntityCountComparison.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  counter: PropTypes.oneOf(COUNTERS),
  entityType: PropTypes.oneOf(ENTITIES),
  value: PropTypes.number,
  comparison: PropTypes.oneOf(COMPARISONS),
};

export default EntityCountComparison;
