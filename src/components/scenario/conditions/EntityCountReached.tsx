// noinspection HtmlUnknownAttribute

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
import {ENTITIES_OPTIONS} from '~/utils/entities';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {
  defaultsParams, ENTITY_COUNT_DEFAULT,
  COUNTERS, ENTITY_COUNT_MIN, ENTITY_COUNT_MAX
} from '~/utils/condition';

// types
import type {ConditionAttributesProps, ConditionEntityCountReached, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionEntityCountReached> {
}

const CONDITION_NAME: string = 'EntityCountReached';

const EntityCountReached = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionEntityCountReached>(
    merge(defaultsParams?.entityCountReached || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('counter', props?.values?.counter, true);
      setValue('entityType', props?.values?.entityType, true);
      setValue('value', props?.values?.value, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    attributes.enabled, props?.values?.counter,
    props?.values?.entityType, props?.values?.value,
  ]);

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('EntityCountReached', values, !attributes.enabled));
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
            <Col xs="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Counter
              </div>
            </Col>
            <Col xs="4">
              <Select
                isClearable
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                defaultValue={getValue('counter') ? {
                  label: capitalCase(getValue('counter') as string),
                  value: getValue('counter'),
                } : null}
                options={COUNTERS.map(value => ({label: capitalCase(value), value}))}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setValue('counter', option.value);
                  }

                  if (['clear', 'remove-value'].includes(action)) {
                    setValue('counter', '');
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
                defaultValue={getValue('entityType') ? {
                  label: capitalCase(getValue('entityType') as string),
                  value: getValue('entityType'),
                } : null}
                placeholder="Choose..."
                onChange={(option: Option | any, {action}): void => {
                  if (action === 'select-option' && option) {
                    setValue('entityType', option.value);
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
            <Col xs="4">
              <NumberInput
                maxLength={3}
                min={ENTITY_COUNT_MIN}
                max={ENTITY_COUNT_MAX}
                disabled={isDisabled}
                allowClear={true}
                value={getValue('value')}
                onChange={value => setValue('value', value)}
                shuffle={true}
                onShuffle={() => setValue('value', random.randomEntityCount())}
                allowRestore
                onRestore={() => setValue('value', ENTITY_COUNT_DEFAULT)}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
EntityCountReached.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  counter: PropTypes.oneOf(COUNTERS),
  entityType: PropTypes.oneOf(ENTITIES),
  value: PropTypes.number,*/
};

export default EntityCountReached;
