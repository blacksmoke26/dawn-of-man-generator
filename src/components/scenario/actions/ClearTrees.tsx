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
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {randomRadius} from '~/utils/random';
import {defaultsParams} from '~/utils/action';
import {randomPosition} from '~/utils/location';
import {actionDefaultProps} from './utils/default';
import {POSITION_MAX, POSITION_MIN, RADIUS_MAX, RADIUS_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionClearTrees, ActionName, ActionProps
} from '~/types/action.types';

export interface Props extends ActionProps<ActionClearTrees> {
}

export interface ClearTreesActionAttributesProps extends ActionAttributesProps {
  positionChecked: boolean;
}

const ACTION_NAME: ActionName = 'ClearTrees';

const ClearTrees = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionClearTrees>>(
    merge(defaultsParams?.clearTrees || {}, props?.initialValues || {}),
  );

  const state = useValues<ClearTreesActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    positionChecked: !valuer.is('position', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.positionChecked) {
      changeValues.position = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.disabled, state.data.positionChecked, valuer.data]);

  // Reflect state changes
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
          <Row className="mb-3 mt-3">
            <PropertyLabel caption="Radius"/>
            <Col sm="4">
              <NumberInput
                decimals={1}
                maxLength={3}
                min={RADIUS_MIN}
                max={RADIUS_MAX}
                disabled={isDisabled}
                placeholder="e.g. 30"
                value={valuer.get('radius', 30)}
                onChange={value => valuer.set('radius', value)}
                shuffle
                onShuffle={() => valuer.set('radius', randomRadius())}
                allowRestore
                onRestore={() => valuer.set('radius', 30)}
              />
            </Col>
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="clear_trees_optional_parameters">
            <Row className="mt-3">
              <PropertyCheckboxLabel
                caption="Position"
                checked={state.get<boolean>('positionChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('positionChecked', isChecked);
                }}
              />
              <AttributeRangeValue
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.get<boolean>('positionChecked')}
                min={valuer.get('position.0', 0)}
                max={valuer.get('position.1', 0)}
                sliderProps={{
                  min: POSITION_MIN,
                  max: POSITION_MAX,
                }}
                allowRestore
                onRestore={() => valuer.overwrite('position', [0, 0])}
                allowShuffle
                onShuffle={() => {
                  valuer.overwrite('position', randomPosition());
                }}
                onChange={(min, max) => {
                  valuer.set('position.0', min);
                  valuer.set('position.1', max);
                }}
              />
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              valuer.set('radius', randomRadius());

              if (state.get<boolean>('positionChecked')) {
                valuer.overwrite('position', randomPosition());
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
ClearTrees.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    radius: PropTypes.number,
    position: PropTypes.arrayOf(PropTypes.number),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ClearTrees;
