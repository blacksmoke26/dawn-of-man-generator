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
import ActionHeader from './elements/ActionHeader';
import PropertyLabel from '~/components/ui/PropertyLabel';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
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
          <Row className="mb-1 mt-3">
            <PropertyLabel caption="Tech era"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '6'}}
              disabled={isDisabled}
              options={ERAS.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('techEra', null)}
              onSelect={option => valuer.set('techEra', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('techEra', uniqueRandomArray(ERAS));
              }}
            />
          </Row>

          <Row className="mb-1 mt-3">
            <PropertyLabel caption="Tech type"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '6'}}
              disabled={isDisabled}
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
              valuer.set('techEra', uniqueRandomArray(ERAS));
              valuer.set('techType', uniqueRandomArray(techEntities));
            }}
          />
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
