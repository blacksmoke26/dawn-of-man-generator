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
import {Col, Row} from 'react-bootstrap';

// elemental components
import NumberInput from '~/components/ui/NumberInput';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// utils
import * as random from '~/utils/random';
import {toString} from '~/helpers/string';
import {toInteger} from '~/helpers/number';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {defaultsParams, TIME_ELAPSED} from '~/utils/condition';
import {toTimeElapsedTemplate} from '~/utils/parser/templates';

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
  showCheckbox?: boolean,

  onRemoveClick?(): void,

  onChange?(template: string, values: Attributes): void,
}

const CONDITION_NAME: string = 'TimeElapsed';

const TimeElapsed = (props: DeepPartial<Props>) => {
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

  // Reflect state changes
  React.useEffect(() => {
    const args: [string, Attributes] = !attributes.enabled
      ? ['', {} as Attributes]
      : [toTimeElapsedTemplate(attributes), attributes];

    typeof props.onChange === 'function' && props.onChange.apply(null, args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setAttribute('enabled', props.enabled);
    props?.disabledCheckbox !== undefined && setAttribute('disabledCheckbox', props.disabledCheckbox);
    props?.expanded !== undefined && setAttribute('expanded', props.expanded);

    if (props?.enabled) {
      props?.timer !== undefined && setAttribute('timer', props.timer);
      props?.value !== undefined && setAttribute('value', props.value);
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
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Timer
              </div>
            </Col>
            <Col sm="5">
              <Select
                isClearable
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                options={TIME_ELAPSED.map(value => ({label: capitalCase(value), value}))}
                defaultValue={attributes?.timer ? {label: attributes.timer, value: attributes.timer} : null}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setAttribute('timer', option.value);
                  }

                  if (['clear', 'remove-value'].includes(action)) {
                    setAttribute('timer', '');
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Value
              </div>
            </Col>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={PERIOD_MIN}
                max={PERIOD_MAX}
                decimals={1}
                disabled={isDisabled}
                allowClear={true}
                placeholder="e.g. 0"
                value={attributes?.value}
                onChange={value => setAttribute('value', value)}
                shuffle={true}
                onShuffle={() => setAttribute('value', +random.randomPeriod())}/>
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
