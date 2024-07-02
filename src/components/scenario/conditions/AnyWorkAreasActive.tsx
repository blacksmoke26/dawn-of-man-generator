/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
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
import type {ConditionAnyWorkAreasActive, ConditionAttributesProps, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionAnyWorkAreasActive> {
}

export interface AnyWorkAreasActiveAttributes extends ConditionAttributesProps {
  maxWorkersChecked: boolean;
}

const CONDITION_NAME: string = 'AnyWorkAreasActive';

const AnyWorkAreasActive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionAnyWorkAreasActive>>(
    merge(defaultsParams?.anyWorkAreasActive || {}, props?.initialValues || {}),
  );

  const state = useValues<AnyWorkAreasActiveAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    maxWorkersChecked: !valuer.is('maxWorkers', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.maxWorkersChecked) {
      changeValues.maxWorkers = undefined;
    }

    newProps?.onTemplate(toConditionTemplate('AnyWorkAreasActive', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, valuer.data, state.data.maxWorkersChecked]);

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
            <PropertyLabel caption="Work Area ID"/>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                disabled={isDisabled}
                caseType="SNAKE_CASE"
                maxLength={100}
                value={valuer.data.workAreaId}
                placeholder="e.g., mountain_side"
                onChange={value => valuer.set('workAreaId', value)}/>
            </Col>
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Max Workers"
                checked={state.get<boolean>('maxWorkersChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'maxWorkers', 10]}
                onChange={isChecked => state.set('maxWorkersChecked', isChecked)}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={PERFORMERS_MIN}
                  max={PERFORMERS_MAX}
                  disabled={isDisabled || !state.data.maxWorkersChecked}
                  placeholder="e.g. 26"
                  value={valuer.get('maxWorkers', 10)}
                  onChange={value => valuer.set('maxWorkers', value)}
                  shuffle={true}
                  onShuffle={() => valuer.set('maxWorkers', random.randomPerformers())}
                  allowRestore
                  onRestore={() => valuer.set('maxWorkers', PERFORMERS_MAX)}
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
AnyWorkAreasActive.propTypes = {};

export default AnyWorkAreasActive;
