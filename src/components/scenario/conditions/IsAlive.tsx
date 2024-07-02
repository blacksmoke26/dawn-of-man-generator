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
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAttributesProps, ConditionIsAlive, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionIsAlive> {
}

export interface IsAliveAttributes extends ConditionAttributesProps {
}

const CONDITION_NAME: string = 'IsAlive';

const IsAlive = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionIsAlive>>(
    merge(defaultsParams?.anyTasksActive || {}, props?.initialValues || {}),
  );

  const state = useValues<IsAliveAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    newProps?.onTemplate(toConditionTemplate('IsAlive', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, valuer.data]);

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
          <Row className="mb-2 mt-1">
            <PropertyLabel caption="Name"/>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                caseType="SNAKE_CASE"
                maxLength={80}
                disabled={isDisabled}
                value={valuer.data.name}
                placeholder="e.g., deer"
                onChange={value => valuer.set('name', value)}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
IsAlive.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,*/
};

export default IsAlive;
