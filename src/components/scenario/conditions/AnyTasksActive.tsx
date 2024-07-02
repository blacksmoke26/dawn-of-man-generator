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
import Accordion from '~/components/ui/Accordion';
import TextInput from '~/components/ui/TextInput';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {defaultsParams, PERFORMERS_MAX, PERFORMERS_MIN} from '~/utils/condition';

// types
import type {ConditionAnyTasksActive, ConditionProps, ConditionAttributesProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionAnyTasksActive> {
}

export interface AnyTasksActiveAttributes extends ConditionAttributesProps {
  minPerformersChecked: boolean;
}

const CONDITION_NAME: string = 'AnyTasksActive';

const AnyTasksActive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionAnyTasksActive>>(
    merge(defaultsParams?.anyTasksActive || {}, props?.initialValues || {}),
  );

  const state = useValues<AnyTasksActiveAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    minPerformersChecked: !valuer.is('minPerformers', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.minPerformersChecked) {
      changeValues.minPerformers = undefined;
    }

    newProps?.onTemplate(toConditionTemplate('AnyTasksActive', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, valuer.data, state.data.minPerformersChecked]);

  // Reflect state changes
  React.useEffect(() => {
    newProps.onChange(state.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('enabled', props?.enabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = state.data.disabledCheckbox || !state.data.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={state.data.enabled}
        onEnabled={(isEnabled: boolean) => state.set('enabled', isEnabled)}
        disabledCheckbox={state.data.disabledCheckbox}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(isExpended: boolean) => state.set('expanded', isExpended)}
        expanded={state.data.expanded}/>
      {state.data.expanded && (
        <>
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="Task Type"/>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                caseType="SNAKE_CASE"
                maxLength={80}
                disabled={isDisabled}
                value={valuer.data.taskType}
                placeholder="e.g., protein_hoarding"
                onChange={value => valuer.set('taskType', value)}/>
            </Col>
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Min Performers"
                checked={state.get<boolean>('minPerformersChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'minPerformers', 10]}
                onChange={isChecked => state.set('minPerformersChecked', isChecked)}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={PERFORMERS_MIN}
                  max={PERFORMERS_MAX}
                  disabled={isDisabled || !state.data.minPerformersChecked}
                  placeholder="0"
                  value={valuer.get('minPerformers', 10)}
                  onChange={value => valuer.set('minPerformers', value)}
                  shuffle={true}
                  onShuffle={() => valuer.set('minPerformers', random.randomPerformers())}
                  allowRestore
                  onRestore={() => valuer.set('minPerformers', PERFORMERS_MAX)}
                />
              </Col>
            </Row>
          </Accordion>
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
