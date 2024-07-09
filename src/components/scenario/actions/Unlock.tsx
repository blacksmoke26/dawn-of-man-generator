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
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {ERAS} from '~/utils/condition';
import {defaultsParams} from '~/utils/action';
import {techEntities} from '~/utils/entities';
import {actionDefaultProps} from './utils/default';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {Required} from 'utility-types';
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionUnlock,
} from '~/types/action.types';

export interface Props extends ActionProps<ActionUnlock> {
}

export interface UnlockActionAttributesProps extends ActionAttributesProps {
  techEraChecked: boolean;
  techTypeChecked: boolean;
}

const ACTION_NAME: ActionName = 'Unlock';

const Unlock = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionUnlock>>(
    merge(defaultsParams?.unlock || {}, props?.initialValues || {}),
  );

  const state = useValues<UnlockActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    techEraChecked: !valuer.is('techEra', undefined),
    techTypeChecked: !valuer.is('techType', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.techEraChecked && (changeValues.techEra = undefined);
    !state.data.techTypeChecked && (changeValues.techType = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.techEraChecked, state.data.techTypeChecked,
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
    <div className={cn('pb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
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
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="hide_ui_optional_parameters">
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Tech era"
                checked={state.get<boolean>('techEraChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'techEra', 'Paleolithic']}
                onChange={isChecked => {
                  state.set('techEraChecked', isChecked);
                }}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.get<boolean>('techEraChecked', false)}
                options={ERAS.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('techEra', 'Paleolithic')}
                onSelect={option => valuer.set('techEra', option.value)}
                allowShuffle
                onShuffle={() => {
                  valuer.set('techEra', uniqueRandomArray(ERAS));
                }}
              />
            </Row>
            <Row className=" mt-2">
              <PropertyCheckboxLabel
                caption="Tech type"
                checked={state.get<boolean>('techTypeChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'techType', 'None']}
                onChange={isChecked => {
                  state.set('techTypeChecked', isChecked);
                }}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.get<boolean>('techTypeChecked', false)}
                options={techEntities.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('techType', 'None')}
                onSelect={option => valuer.set('techType', option.value)}
                allowShuffle
                onShuffle={() => {
                  valuer.set('techType', uniqueRandomArray(techEntities));
                }}
              />
            </Row>

            <RandomizeValuesButton
              disabled={isDisabled}
              onClick={() => {
                state.get<boolean>('techEraChecked', false)
                && valuer.set('techEra', uniqueRandomArray(ERAS));

                state.get<boolean>('techTypeChecked', false)
                && valuer.set('techType', uniqueRandomArray(techEntities));
              }}
            />
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
Unlock.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    techType: PropTypes.oneOf(techEntities),
    techEra: PropTypes.oneOf(ERAS),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default Unlock;
