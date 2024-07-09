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
import {Row} from 'react-bootstrap';
import {capitalCase} from 'change-case';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {defaultsParams, GAMEPLAY_FLAGS} from '~/utils/action';
import {animalEntities} from '~/utils/entities';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetGameplayFlags
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetGameplayFlags> {
}

export interface SetGameplayFlagsActionAttributesProps extends ActionAttributesProps {
  controllableAnimalChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetGameplayFlags';

const SetGameplayFlags = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetGameplayFlags>>(
    merge(defaultsParams?.setGameplayFlags || {}, props?.initialValues || {}),
  );

  const state = useValues<SetGameplayFlagsActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    controllableAnimalChecked: !valuer.is('value', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.controllableAnimalChecked) {
      changeValues.controllableAnimal = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.controllableAnimalChecked,
    valuer.data,
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
    <div className={cn('mb-3', {'text-muted': isDisabled}, 'checkbox-align')}>
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
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="Flags"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '6'}}
              disabled={isDisabled}
              options={GAMEPLAY_FLAGS.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('flags', 'None')}
              onSelect={option => valuer.set('flags', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('flags', uniqueRandomArray(GAMEPLAY_FLAGS));
              }}
            />
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Controllable animal"
                checked={state.data.controllableAnimalChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'controllableAnimal', 'ancient_bison']}
                onChange={isChecked => state.set('controllableAnimalChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.data.controllableAnimalChecked}
                options={animalEntities.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('controllableAnimal', 'ancient_bison')}
                onSelect={option => valuer.set('controllableAnimal', option.value)}
                selectProps={{isSearchable: true}}
                allowShuffle
                onShuffle={() => {
                  valuer.set('controllableAnimal', uniqueRandomArray(animalEntities));
                }}
              />
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              valuer.set('flags', uniqueRandomArray(GAMEPLAY_FLAGS));

              state.is('controllableAnimalChecked', true)
              && valuer.set('controllableAnimal', uniqueRandomArray(animalEntities));
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetGameplayFlags.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    flags: PropTypes.oneOf(GAMEPLAY_FLAGS),
    controllableAnimal: PropTypes.oneOf(animalEntities),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetGameplayFlags;
