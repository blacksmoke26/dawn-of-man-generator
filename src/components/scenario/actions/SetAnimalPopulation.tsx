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

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeEraFactor from '~/components/ui/elements/AttributeEraFactor';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {animalEntities} from '~/utils/entities';
import {actionDefaultProps, optionalDefaultValueSetter} from './utils/default';
import {randomAnimalMinMax, randomArray, randomEraFactors} from '~/utils/random';
import {ANIMAL_POPULATION_MAX, ANIMAL_POPULATION_MIN, ERA_FACTORS_LOWEST} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps,
  ActionName,
  ActionProps,
  ActionSetAnimalPopulation,
  EraFactor,
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetAnimalPopulation> {
}

export interface SetAnimalPopulationActionAttributesProps extends ActionAttributesProps {
  minMaxChecked: boolean;
  eraFactorsChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetAnimalPopulation';

const SetAnimalPopulation = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetAnimalPopulation>>(
    merge(defaultsParams?.quitGame || {}, props?.initialValues || {}),
  );

  const state = useValues<SetAnimalPopulationActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    minMaxChecked: !valuer.is('min', undefined),
    eraFactorsChecked: !valuer.is('eraFactors', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (changeValues?.animalTypes?.length === 1) {
      changeValues.animalType = changeValues?.animalTypes[0];
      changeValues.animalTypes = [];
    }

    if (!state.data.minMaxChecked) {
      changeValues.min = undefined;
      changeValues.max = undefined;
    }

    if (!state.data.eraFactorsChecked) {
      changeValues.eraFactors = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.minMaxChecked,
    state.data.eraFactorsChecked,
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

  const eraFactor: EraFactor = valuer.get('eraFactors', ERA_FACTORS_LOWEST);

  const minMaxDisabled: boolean = newProps.disabled || !state.get<boolean>('minMaxChecked', false);

  return (
    <div className={cn('mb-2 checkbox-align', {'text-muted': isDisabled})}>
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
          <Row className="mb-2 mt-3">
            <PropertyLabel caption="Animal type(s)"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '10'}}
              disabled={isDisabled}
              options={animalEntities.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get<string[]>('animalTypes', [])?.map(value => ({label: capitalCase(value), value})) || []}
              selectProps={{isSearchable: true, isMulti: true, isClearable: false}}
              onChange={(option, {action}) => {
                if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                  valuer.overwrite('animalTypes', option?.map(({value}) => value) || []);
                }
              }}
              allowShuffle
              onShuffle={() => {
                valuer.set('animalTypes', [...(new Set<string>(randomArray(animalEntities, 1) as string[]) as unknown as string[])]);
              }}
            />
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="set_animal_population_optional_parameters">
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Population"
                checked={state.get<boolean>('minMaxChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[
                  valuer, [['min', 0], ['max', 0]]
                ]}
                onChange={isChecked => {
                  state.set('minMaxChecked', isChecked);
                }}
              />
              <AttributeRangeValue
                colProps={{sm: '6'}}
                disabled={minMaxDisabled}
                min={valuer.get('min', 0)}
                max={valuer.get('max', 0)}
                sliderProps={{
                  min: ANIMAL_POPULATION_MIN,
                  max: ANIMAL_POPULATION_MAX,
                }}
                allowRestore
                onRestore={(excludeMin, excludeMax) => {
                  !excludeMin && valuer.set('min', defaultsParams.setAnimalPopulation?.min);
                  !excludeMax && valuer.set('max', defaultsParams.setAnimalPopulation?.max);
                }}
                allowShuffle
                onShuffle={(excludeMin, excludeMax) => {
                  const [min, max] = randomAnimalMinMax();
                  !excludeMin && valuer.set('min', min);
                  !excludeMax && valuer.set('max', max);
                }}
                onChange={(min, max) => {
                  valuer.set('min', min);
                  valuer.set('max', max);
                }}
                allowExcludeCheck
              />
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Era factors"
                checked={state.get<boolean>('eraFactorsChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[
                  valuer, 'eraFactors', ERA_FACTORS_LOWEST
                ]}
                onChange={isChecked => {
                  state.set('eraFactorsChecked', isChecked);
                }}
              />
              <AttributeEraFactor
                disabled={isDisabled || !state.get<boolean>('eraFactorsChecked', false)}
                first={eraFactor?.[0] || ERA_FACTORS_LOWEST[0]}
                second={eraFactor?.[1] || ERA_FACTORS_LOWEST[1]}
                third={eraFactor?.[2] || ERA_FACTORS_LOWEST[2]}
                fourth={eraFactor?.[3] || ERA_FACTORS_LOWEST[3]}
                fifth={eraFactor?.[4] || ERA_FACTORS_LOWEST[4]}
                sixth={eraFactor?.[5] || ERA_FACTORS_LOWEST[5]}
                onChange={values => {
                  valuer.overwrite('eraFactors', values);
                }}
              />
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              valuer.set('animalTypes', [...(new Set<string>(randomArray(animalEntities, 1) as string[]) as unknown as string[])]);

              if (state.is('minMaxChecked', true)) {
                const [min, max] = randomAnimalMinMax();
                valuer.set('min', min);
                valuer.set('max', max);
              }

              if (state.is('eraFactorsChecked', true)) {
                valuer.overwrite('eraFactors', randomEraFactors());
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetAnimalPopulation.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    animalType: PropTypes.oneOf(animalEntities),
    animalTypes: PropTypes.arrayOf(PropTypes.oneOf(animalEntities)),
    min: PropTypes.number,
    max: PropTypes.number,
    eraFactors: PropTypes.arrayOf(PropTypes.number),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetAnimalPopulation;
