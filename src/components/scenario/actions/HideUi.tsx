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
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeCheckbox from '~/components/ui/elements/AttributeCheckbox';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {randomArray} from '~/utils/random';
import {actionDefaultProps} from './utils/default';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {BUILDABLE_CATEGORIES, defaultsParams} from '~/utils/action';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {ActionAttributesProps, ActionHideUi, ActionName, ActionProps} from '~/types/action.types';

export interface Props extends ActionProps<ActionHideUi> {
}

export interface HideUiActionAttributesProps extends ActionAttributesProps {
  entityTypesChecked: boolean;
  buildableCategoriesChecked: boolean;
  hideDisabledUiChecked: boolean;
  hideQuickPanelsChecked: boolean;
}

const ACTION_NAME: ActionName = 'HideUi';

const HideUi = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionHideUi>>(
    merge(defaultsParams?.hideUi || {}, props?.initialValues || {}),
  );

  const state = useValues<HideUiActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    entityTypesChecked: !valuer.is('entityTypes', undefined),
    buildableCategoriesChecked: !valuer.is('buildableCategories', undefined),
    hideDisabledUiChecked: !valuer.is('hideDisabledUi', undefined),
    hideQuickPanelsChecked: !valuer.is('hideQuickPanels', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.entityTypesChecked && (changeValues.entityTypes = undefined);
    !state.data.buildableCategoriesChecked && (changeValues.buildableCategories = undefined);
    !state.data.hideDisabledUiChecked && (changeValues.hideDisabledUi = undefined);
    !state.data.hideQuickPanelsChecked && (changeValues.hideQuickPanels = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.entityTypesChecked,
    state.data.buildableCategoriesChecked,
    state.data.hideDisabledUiChecked,
    state.data.hideQuickPanelsChecked,
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
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="hide_ui_optional_parameters">
          <Row className="mb-3 mt-2">
            <PropertyCheckboxLabel
              caption="Entity types"
              checked={state.get<boolean>('entityTypesChecked', false)}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'entityTypes', []]}
              onChange={isChecked => {
                state.set('entityTypesChecked', isChecked);
              }}
            />
            <AttributeSelect
              className="w-75"
              colProps={{sm: '10'}}
              disabled={isDisabled || !state.get<boolean>('entityTypesChecked', false)}
              options={ENTITIES_OPTIONS as unknown as Option[]}
              value={valuer.get<string[]>('entityTypes', [])?.map(value => ({label: capitalCase(value), value})) || []}
              selectProps={{isSearchable: true, isMulti: true}}
              onChange={(option, {action}) => {
                if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
                  valuer.overwrite('entityTypes', option?.map(({value}) => value) || []);
                }
              }}
              allowShuffle
              onShuffle={() => {
                valuer.set('entityTypes', [...(new Set<string>(randomArray(ENTITIES, 5) as string[]) as unknown as string[])]);
              }}
              allowClear
              onClear={() => valuer.set('entityTypes', [])}
            />
          </Row>
          <Row className="mb-3 mt-2">
            <PropertyCheckboxLabel
              caption="Buildable categories"
              checked={state.get<boolean>('buildableCategoriesChecked', false)}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'buildableCategories', []]}
              onChange={isChecked => {
                state.set('buildableCategoriesChecked', isChecked);
              }}
            />
            <AttributeSelect
              disabled={isDisabled || !state.get<boolean>('buildableCategoriesChecked', false)}
              options={BUILDABLE_CATEGORIES.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('buildableCategories', 'Residence')}
              onSelect={option => valuer.set('buildableCategories', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('buildableCategories', uniqueRandomArray(BUILDABLE_CATEGORIES));
              }}
            />
          </Row>
          <Row className="mb-1 mt-2">
            <PropertyCheckboxLabel
              caption="Disabled UI"
              checked={state.get<boolean>('hideDisabledUiChecked', false)}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'hideDisabledUi', false]}
              onChange={isChecked => {
                state.set('hideDisabledUiChecked', isChecked);
              }}
            />
            <AttributeCheckbox
              checked={valuer.get<boolean>('hideDisabledUi', false)}
              caption="Yes"
              disabled={isDisabled || !state.get<boolean>('hideDisabledUiChecked', false)}
              onChange={isChecked => {
                valuer.set('hideDisabledUi', isChecked);
              }}
            />
          </Row>
          <Row className="mb-1 mt-2">
            <PropertyCheckboxLabel
              caption="Quick panels"
              checked={state.get<boolean>('hideQuickPanelsChecked', false)}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'hideQuickPanels', false]}
              onChange={isChecked => {
                state.set('hideQuickPanelsChecked', isChecked);
              }}
            />
            <AttributeCheckbox
              checked={valuer.get<boolean>('hideQuickPanels', false)}
              caption="Hide"
              disabled={isDisabled || !state.get<boolean>('hideQuickPanelsChecked', false)}
              onChange={isChecked => {
                valuer.set('hideQuickPanels', isChecked);
              }}
            />
          </Row>
          </Accordion>

          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {

              if (state.is('entityTypesChecked', true)) {
                valuer.set('entityTypes', [...(new Set<string>(randomArray(ENTITIES, 5) as string[]) as unknown as string[])]);
              }

              if (state.is('buildableCategoriesChecked', true)) {
                valuer.set('buildableCategories', uniqueRandomArray(BUILDABLE_CATEGORIES));
              }

              if (state.is('hideDisabledUiChecked', true)) {
                valuer.set('hideDisabledUi', randomArray([true, false], 1)[0]);
              }

              if (state.is('hideQuickPanelsChecked', true)) {
                valuer.set('hideQuickPanels', randomArray([true, false], 1)[0]);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
HideUi.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    entityTypes: PropTypes.arrayOf(PropTypes.oneOf(ENTITIES)),
    buildableCategories: PropTypes.oneOf(BUILDABLE_CATEGORIES),
    hideDisabledUi: PropTypes.bool,
    hideQuickPanels: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default HideUi;
