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
import TextInput from '~/components/ui/TextInput';
import ActionHeader from './elements/ActionHeader';
import PropertyLabel from '~/components/ui/PropertyLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {defaultsParams} from '~/utils/action';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionShowMessage
} from '~/types/action.types';

export interface Props extends ActionProps<ActionShowMessage> {
}

export interface ShowMessageActionAttributesProps extends ActionAttributesProps {
}

const ACTION_NAME: ActionName = 'ShowMessage';

const ShowMessage = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionShowMessage>>(
    merge(defaultsParams?.showMessage || {}, props?.initialValues || {}),
  );

  const state = useValues<ShowMessageActionAttributesProps>({
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
          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Title"/>
            <Col sm="4">
              <TextInput
                selectOnLoad
                focusOnLoad
                value={valuer.get('title', '')}
                disabled={isDisabled}
                placeholder="e.g., before_dawn_well_done"
                caseType="SNAKE_CASE"
                onChange={value => valuer.set('title', value)}/>
            </Col>
          </Row>

          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Text"/>
            <Col sm="4">
              <TextInput
                value={valuer.get('text', '')}
                disabled={isDisabled}
                placeholder="e.g., before_dawn_completed"
                caseType="SNAKE_CASE"
                onChange={value => valuer.set('text', value)}/>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Properties validation
ShowMessage.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    title: PropTypes.string,
    text: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ShowMessage;
