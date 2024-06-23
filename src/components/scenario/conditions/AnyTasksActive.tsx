/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import NumberInput from '~/components/ui/NumberInput';
import TextInput from '~/components/ui/TextInput';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import * as random from '~/utils/random';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAnyTasksActive, ConditionProps, ConditionAttributesProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionAnyTasksActive> {
}

const CONDITION_NAME: string = 'AnyTasksActive';

const AnyTasksActive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const [attributes, setAttr, getAttr] = useAttributes<ConditionAttributesProps>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const [values, setValue, getValue] = useAttributes<ConditionAnyTasksActive>(
    merge(defaultsParams?.anyTasksActive || {}, newProps?.initialValues || {}),
  );

  React.useEffect(() => {
    if (attributes.enabled) {
      setValue('taskType', props?.values?.taskType, true);
      setValue('minPerformers', props?.values?.minPerformers, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.enabled, props?.values?.taskType, props?.values?.minPerformers]);


  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toConditionTemplate('AnyTasksActive', values, !attributes.enabled));
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
                Task Type
              </div>
            </Col>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                disabled={isDisabled}
                value={getValue('taskType', '')}
                placeholder="e.g., protein_hoarding"
                onChange={value => setValue('taskType', value)}/>
            </Col>
          </Row>
          <Row className="mb-1 mt-2">
            <Col sm="2">
              <div className="position-relative pl-3" style={{top: 7}}>
                Min Performers
              </div>
            </Col>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={PERFORMERS_MIN}
                max={PERFORMERS_MAX}
                disabled={isDisabled}
                allowClear
                placeholder="e.g. 0"
                value={getValue('minPerformers', '')}
                onChange={value => setValue('minPerformers', value)}
                shuffle={true}
                onShuffle={() => setValue('minPerformers', random.randomPerformers())}
                allowRestore
                onRestore={() => setValue('minPerformers', PERFORMERS_MAX)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
AnyTasksActive.propTypes = {
  enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  taskType: PropTypes.string,
  minPerformers: PropTypes.number,
  onChange: PropTypes.func,
};

export default AnyTasksActive;
