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
import TextInput from '~/components/ui/TextInput';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeTripleSlider from '~/components/ui/elements/AttributeTripleSlider';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';
import {randomLocationIndex, randomVectorPosition} from '~/utils/random';
import {LOCATION_INDEX_MAX, LOCATION_INDEX_MIN, POSITION_VECTOR_MAX, POSITION_VECTOR_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {ActionAttributesProps, ActionModifyLocation, ActionName, ActionProps} from '~/types/action.types';

export interface Props extends ActionProps<ActionModifyLocation> {
}

export interface ModifyLocationActionAttributesProps extends ActionAttributesProps {
  positionChecked: boolean;
  locationIndexChecked: boolean;
}

const ACTION_NAME: ActionName = 'ModifyLocation';

const ModifyLocation = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionModifyLocation>>(
    merge(defaultsParams?.modifyLocation || {}, props?.initialValues || {}),
  );

  const state = useValues<ModifyLocationActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    positionChecked: !valuer.is('position', undefined),
    locationIndexChecked: !valuer.is('locationIndex', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.positionChecked) {
      changeValues.position = undefined;
    }

    if (!state.data.locationIndexChecked) {
      changeValues.locationIndex = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.positionChecked,
    state.data.locationIndexChecked, valuer.data,
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
            <PropertyLabel caption="Modification"/>
            <Col sm="4">
              <TextInput
                selectOnLoad
                focusOnLoad
                value={valuer.get('modification', '')}
                disabled={isDisabled}
                placeholder="e.g., MakeNodeShallow"
                caseType="SNAKE_CASE"
                onChange={value => valuer.set('modification', value)}/>
            </Col>
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="modify_location_optional_parameters">
            <Row className="mb-3 mt-3">
              <PropertyCheckboxLabel
                caption="Position"
                checked={state.get<boolean>('positionChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('positionChecked', isChecked);
                }}
              />
              <AttributeTripleSlider
                sliderProps={{
                  min: POSITION_VECTOR_MIN,
                  max: POSITION_VECTOR_MAX,
                  step: 0.1,
                }}
                first={valuer.get('position.0', 0)}
                second={valuer.get('position.1', 0)}
                third={valuer.get('position.2', 0)}
                allowShuffle
                onShuffle={() => {
                  valuer.overwrite('position', randomVectorPosition());
                }}
                allowRestore
                onRestore={() => {
                  valuer.overwrite('position', [0, 0, 0]);
                }}
                disabled={isDisabled || !state.get<boolean>('positionChecked', false)}
                onChange={(first, second, third) => {
                  valuer.overwrite('position', [first, second, third]);
                }}
              />
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Location index"
                checked={state.get<boolean>('locationIndexChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('locationIndexChecked', isChecked);
                }}
              />
              <Col sm="5">
                <NumberInput
                  maxLength={3}
                  min={LOCATION_INDEX_MIN}
                  max={LOCATION_INDEX_MAX}
                  disabled={isDisabled || !state.get<boolean>('locationIndexChecked', false)}
                  placeholder="e.g. 15"
                  value={valuer.get('locationIndex', -1)}
                  onChange={value => valuer.set('locationIndex', value)}
                  shuffle
                  onShuffle={() => valuer.set('locationIndex', randomLocationIndex())}
                  allowRestore
                  onRestore={() => valuer.set('locationIndex', -1)}
                />
              </Col>
            </Row>
          </Accordion>

          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              if (state.is('positionChecked', true)) {
                valuer.overwrite('position', randomVectorPosition());
              }

              if (state.is('locationIndexChecked', true)) {
                valuer.set('locationIndex', randomLocationIndex());
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
ModifyLocation.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    locationIndex: PropTypes.number,
    position: PropTypes.arrayOf(PropTypes.number),
    modification: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ModifyLocation;
