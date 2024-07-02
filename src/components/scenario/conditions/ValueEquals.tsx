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
import uniqueRandomArray from 'unique-random-array';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {defaultsParams, VALUE_EQUALS} from '~/utils/condition';

// types
import type {
  ConditionAttributesProps, ConditionProps, ConditionValueEquals
} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionValueEquals> {
}

export interface ValueEqualsAttributes extends ConditionAttributesProps {
}

const CONDITION_NAME: string = 'ValueEquals';

const ValueEquals = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionValueEquals>>(
    merge(defaultsParams?.valueEquals || {}, props?.initialValues || {}),
  );

  const state = useValues<ValueEqualsAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  React.useEffect(() => {
    const changeValues = {...valuer.data};

    newProps?.onTemplate(toConditionTemplate('ValueEquals', changeValues, !state.data.enabled));
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
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="ID"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: 6}}
              disabled={isDisabled}
              options={VALUE_EQUALS.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('id', 'Population')}
              onSelect={option => valuer.set('id', option.value)}
              allowShuffle
              onShuffle={() => valuer.set('id', uniqueRandomArray(VALUE_EQUALS))}
            />
          </Row>

          <Row className="mb-1 mt-2">
            <PropertyLabel caption="Value" disabled={isDisabled}/>
            <Col xs="4">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                disabled={isDisabled}
                value={valuer.get('value', '')}
                placeholder="e.g., 2"
                onChange={value => valuer.set('value', value)}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
ValueEquals.propTypes = {
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

export default ValueEquals;
