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
import {COLOR_DISABLED, COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// elemental components
import Slider from '~/components/ui/Slider';
import Select, {Option} from '~/components/ui/Select';

// utils
import * as random from '~/utils/random';
import {PERIOD_MIN, PERIOD_MAX} from '~/utils/defaults';
import {defaultsParams, TIME_ELAPSED} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {
  ConditionTimeElapsed as ConditionAttributes,
  TimeElapsed as TimeElapsedList
} from '~/types/condition.types';

interface Attributes extends ConditionAttributes {
  enabled: boolean;
}

interface Props extends Attributes {
  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'TimeElapsed';

const TimeElapsed = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: false,
    timer: 'RealTime',
    value: 0,
    onChange: () => {
    },
  }, defaultsParams.timeElapsed as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    timer: newProps.timer as TimeElapsedList,
    value: newProps.value as number,
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !attributes?.timer.trim() || !attributes?.value
      ? ''
      : (
        `<condition type="${CONDITION_NAME}"`
        + ` timer="${attributes?.timer}"`
        + ` value="${attributes?.value}y"/>`
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
      props?.timer && setAttribute('timer', props.timer);
      props?.value && setAttribute('value', props.value);
    }
  }, [props, attributes.enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !attributes.enabled}, 'checkbox-align')}>
      <Row className="mb-1">
        <Col xs="10">
          <IconCondition width="17" height="17"
                         color={!attributes.enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition</strong>: TimeElapsed
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
          <div className="position-relative pl-3" style={{top: 7}}>
            Timer
          </div>
        </Col>
        <Col xs="5">
          <Select
            isDisabled={!attributes.enabled}
            menuPortalTarget={document.body}
            options={TIME_ELAPSED.map(value => ({label: capitalCase(value), value}))}
            defaultValue={attributes?.value ? {label: attributes.value, value: attributes.value} : null}
            placeholder="Choose..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                setAttribute('timer', option.value);
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
										Value: <code className={cn({'text-muted': !attributes.enabled})}>{attributes.value}y</code>
									</span>
          <Button disabled={!attributes.enabled}
                  className="button-reset-sm" variant="link"
                  onClick={() => setAttribute('value', +Number(random.randomPeriod()).toFixed(0))}>
            Random
          </Button>
          <Slider
            min={PERIOD_MIN}
            max={PERIOD_MAX}
            step={1} disabled={!attributes.enabled}
            value={Number(attributes.value)}
            onChange={value => setAttribute('value', Number(value))}/>
        </Col>
      </Row>
    </div>
  );
};

// Properties validation
TimeElapsed.propTypes = {
  enabled: PropTypes.bool,
  time: PropTypes.oneOf(TIME_ELAPSED),
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default TimeElapsed;
