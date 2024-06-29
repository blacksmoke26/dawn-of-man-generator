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
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import TextInput from '~/components/ui/TextInput';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {defaultsParams, LOCATION_TYPE} from '~/utils/action';
import {randomDistance, randomRotation} from '~/utils/random';
import {RADIUS_MAX, RADIUS_MIN, ROTATION_MAX, ROTATION_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {ActionAttributesProps, ActionFocusCamera, ActionName, ActionProps} from '~/types/action.types';

export interface Props extends ActionProps<ActionFocusCamera> {
}

export interface FocusCameraActionAttributesProps extends ActionAttributesProps {
  distanceChecked: boolean;
  rotationChecked: boolean;
}

const ACTION_NAME: ActionName = 'FocusCamera';

const FocusCamera = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionFocusCamera>>(
    merge(defaultsParams?.focusCamera || {}, props?.initialValues || {}),
  );

  const state = useValues<FocusCameraActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    distanceChecked: !valuer.is('distance', undefined),
    rotationChecked: !valuer.is('rotation', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.distanceChecked) {
      changeValues.distance = undefined;
    }

    if (!state.data.rotationChecked) {
      changeValues.rotation = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.distanceChecked,
    state.data.rotationChecked, valuer.data,
  ]);

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
          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Location"/>
            <AttributeSelect
              disabled={isDisabled}
              options={LOCATION_TYPE.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('location', 'LastMarker')}
              onSelect={option => valuer.set('location', option.value)}
              allowShuffle={true}
              onShuffle={() => {
                valuer.set('location', uniqueRandomArray(LOCATION_TYPE));
              }}
            />
          </Row>
          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Entity name"/>
            <Col sm="4">
              <TextInput
                selectOnLoad
                focusOnLoad
                value={valuer.get('entityName', '')}
                disabled={isDisabled}
                placeholder="e.g., human"
                caseType="SNAKE_CASE"
                onChange={value => valuer.set('entityName', value)}/>
            </Col>
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="spawn_optional_parameters">
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Distance"
                checked={state.get<boolean>('distanceChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'distance', 40]}
                onChange={isChecked => {
                  state.set('distanceChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  decimals={1}
                  maxLength={3}
                  min={RADIUS_MIN}
                  max={RADIUS_MAX}
                  disabled={isDisabled || !state.get<boolean>('distanceChecked', false)}
                  placeholder="e.g. 30"
                  value={valuer.get('distance', 40)}
                  onChange={value => valuer.set('distance', value)}
                  shuffle
                  onShuffle={() => valuer.set('distance', randomDistance())}
                  allowRestore
                  onRestore={() => valuer.set('distance', 40)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Rotation"
                checked={state.get<boolean>('rotationChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'rotation', 0]}
                onChange={isChecked => {
                  state.set('rotationChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  decimals={1}
                  maxLength={3}
                  min={ROTATION_MIN}
                  max={ROTATION_MAX}
                  disabled={isDisabled || !state.get<boolean>('rotationChecked', false)}
                  placeholder="e.g. 30"
                  value={valuer.get('rotation', 0)}
                  onChange={value => valuer.set('rotation', value)}
                  shuffle
                  onShuffle={() => valuer.set('rotation', randomRotation())}
                  allowRestore
                  onRestore={() => valuer.set('rotation', 0)}
                />
              </Col>
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              valuer.set('location', uniqueRandomArray(LOCATION_TYPE));

              if (state.get<boolean>('distanceChecked')) {
                valuer.set('distance', randomDistance());
              }

              if (state.get<boolean>('rotationChecked')) {
                valuer.set('rotation', randomRotation());
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
FocusCamera.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    location: PropTypes.oneOf(LOCATION_TYPE),
    entityName: PropTypes.string,
    distance: PropTypes.number,
    rotation: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default FocusCamera;
