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
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {defaultsParams, TIME_ELAPSED} from '~/utils/condition';

// types
import type {$Keys, DeepPartial} from 'utility-types';
import type {
  ConditionTimeElapsed as ConditionAttributes,
  TimeElapsed as TimeElapsedList,
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

const CONDITION_NAME: string = 'TimeElapsed';

const TimeElapsed = (props: DeepPartial<Props>) => {
  const newProps = merge.all<Props>([{
    enabled: true,
    disabledCheckbox: false,
    removeIcon: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, defaultsParams.timeElapsed as Props, props]);

  const [attributes, setAttributes] = React.useState<Attributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean,
    timer: toString<TimeElapsedList>(newProps?.timer),
    value: toInteger(newProps?.value),
  });

  const setAttribute = <T = any>(name: $Keys<Attributes>, value: T) => {
    setAttributes(current => {
      return ({...current, [name]: value as T});
    });
  };

  const toTemplateText = (): string => {
    return !attributes.enabled || !attributes?.timer.trim() || attributes?.value < 0
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
    setAttribute('enabled', props.enabled);
    setAttribute('disabledCheckbox', props.disabledCheckbox);
    setAttribute('expanded', props.expanded);

    if (props.enabled) {
      props?.timer && setAttribute('timer', props.timer);
      props?.value && setAttribute('value', props.value);
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
                Timer
              </div>
            </Col>
            <Col xs="5">
              <Select
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={TIME_ELAPSED.map(value => ({label: capitalCase(value), value}))}
                defaultValue={attributes?.timer ? {label: attributes.timer, value: attributes.timer} : null}
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
										Value: <code className={cn({'text-muted': isDisabled})}>{attributes.value}y</code>
									</span>
              <Button disabled={isDisabled}
                      className="button-reset-sm" variant="link"
                      onClick={() => setAttribute('value', +random.randomPeriod())}>
                Random
              </Button>
              <Slider
                min={PERIOD_MIN}
                max={PERIOD_MAX}
                step={0.1} disabled={isDisabled}
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
TimeElapsed.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  time: PropTypes.oneOf(TIME_ELAPSED),
  value: PropTypes.number,
};

export default TimeElapsed;
