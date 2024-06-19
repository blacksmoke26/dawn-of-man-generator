/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import NumberInput from '~/components/ui/NumberInput';
import Select, {Option} from '~/components/ui/Select';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import * as random from '~/utils/random';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {defaultsParams, TIME_ELAPSED} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {
  ConditionAttributesProps, ConditionTimeElapsed, ConditionProps,
} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionTimeElapsed> {
}

const CONDITION_NAME: string = 'TimeElapsed';

const TimeElapsed = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionTimeElapsed>(
    merge(defaultsParams?.timeElapsed || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('timer', props?.values?.timer, true);
      setValue('value', props?.values?.value, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    attributes.enabled,
    props?.values?.timer, props?.values?.value,
  ]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('TimeElapsed', values, !attributes.enabled));
    newProps?.onValuesChange(filterEmpty(values));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.enabled, values]);

  // Reflect state changes
  React.useEffect(() => {
    newProps.onChange(attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttr('enabled', props?.enabled, true);
    setAttr('disabledCheckbox', props?.disabledCheckbox, true);
    setAttr('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = getAttr('disabledCheckbox') || !getAttr('enabled');

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={getAttr('enabled')}
        onEnabled={(isEnabled: boolean) => setAttr('enabled', isEnabled)}
        disabledCheckbox={getAttr('disabledCheckbox')}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(state: boolean) => setAttr('expanded', state)}
        expanded={getAttr('expanded')}/>
      {getAttr('expanded') && (
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
                defaultValue={getValue('timer') ? {label: getValue('timer'), value: getValue('timer')} : null}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setValue('timer', option.value);
                  }

                  if (['clear', 'remove-value'].includes(action)) {
                    setValue('timer', '');
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
                value={getValue('value')}
                onChange={value => setValue('value', value)}
                shuffle={true}
                onShuffle={() => setValue('value', +random.randomPeriod())}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
TimeElapsed.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  time: PropTypes.oneOf(TIME_ELAPSED),
  value: PropTypes.number,*/
};

export default TimeElapsed;
