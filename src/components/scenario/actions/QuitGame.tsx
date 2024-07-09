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

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeCheckbox from '~/components/ui/elements/AttributeCheckbox';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import {ActionAttributesProps, ActionName, ActionProps, ActionQuitGame} from '~/types/action.types';

export interface Props extends ActionProps<ActionQuitGame> {
}

export interface QuitGameActionAttributesProps extends ActionAttributesProps {
  successChecked: boolean;
}

const ACTION_NAME: ActionName = 'QuitGame';

const QuitGame = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionQuitGame>>(
    merge(defaultsParams?.quitGame || {}, props?.initialValues || {}),
  );

  const state = useValues<QuitGameActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    successChecked: !valuer.is('success', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.successChecked) {
      changeValues.success = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.successChecked, valuer.data,
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
    <div className={cn('mb-3 checkbox-align', {'text-muted': isDisabled})}>
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
        <Accordion
          noBodyPad={true}
          noCard={true}
          header="Optional parameters"
          eventKey="optional_parameters">
          <Row className="mt-2">
            <PropertyCheckboxLabel
              caption="Success"
              checked={state.data.successChecked}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'success', true]}
              onChange={isChecked => state.set('successChecked', isChecked)}
            />
            <AttributeCheckbox
              checked={valuer.get<boolean>('success', true)}
              caption={(
                <span className={cn({'text-muted': isDisabled || !state.data.successChecked})}>Yes</span>
              )}
              disabled={isDisabled || !state.data.successChecked}
              onChange={isChecked => {
                valuer.set('success', isChecked);
              }}
            />
          </Row>
        </Accordion>
      )}
    </div>
  );
};

// Properties validation
QuitGame.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    success: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default QuitGame;
