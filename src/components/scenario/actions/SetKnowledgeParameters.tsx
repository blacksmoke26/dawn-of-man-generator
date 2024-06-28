/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';
import {TECH_COST_MULTIPLIER_MAX, TECH_COST_MULTIPLIER_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetKnowledgeParameters
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetKnowledgeParameters> {
}

export interface SetKnowledgeParametersActionAttributesProps extends ActionAttributesProps {
}

const ACTION_NAME: ActionName = 'SetKnowledgeParameters';

const SetKnowledgeParameters = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetKnowledgeParameters>>(
    merge(defaultsParams?.setKnowledgeParameters || {}, props?.initialValues || {}),
  );

  const state = useValues<SetKnowledgeParametersActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
  ]);

  // Reflect state.data changes
  React.useEffect(() => {
    newProps.onChange(state.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('disabled', props?.disabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = state.get<boolean>('disabledCheckbox', false) || state.get<boolean>('disabled', false);

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      {newProps?.showHeader && (
        <ActionHeader
          caption={ACTION_NAME}
          disabled={state.data.disabled}
          disabledCheckbox={state.data.disabledCheckbox}
          removeIcon={newProps.removeIcon}
          onRemoveClick={newProps.onRemoveClick}
          onExpandedClick={(current: boolean) => state.set('expanded', current)}
          expanded={state.data.expanded}/>
      )}
      {state.data.expanded && (
        <>
          <Row className="mb-3 mt-2">
            <PropertyLabel
              caption={<>Tech cost <i className="text-size-xxs text-muted">(multiplier)</i></>}
            />
            <Col sm="4">
              <NumberInput
                maxLength={3}
                decimals={1}
                min={TECH_COST_MULTIPLIER_MIN}
                max={TECH_COST_MULTIPLIER_MAX}
                disabled={isDisabled}
                placeholder="e.g. 1.5"
                value={valuer.get('techCostMultiplier', 1)}
                onChange={value => valuer.set('techCostMultiplier', value)}
                allowRestore
                onRestore={() => valuer.set('techCostMultiplier', 1)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
SetKnowledgeParameters.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    techCostMultiplier: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetKnowledgeParameters;
