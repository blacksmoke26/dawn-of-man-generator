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

// elemental components
import ActionHeader from './elements/ActionHeader';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {filterEmpty} from '~/utils/template';
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';

// parsers
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import {ActionAttributesProps, ActionClearGoals, ActionName, ActionProps} from '~/types/action.types';

export interface Props extends ActionProps<ActionClearGoals> {
}

const ACTION_NAME: ActionName = 'ClearGoals';

const ClearGoals = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const state = useValues<ActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
  });

  const valuer = useValues<Partial<ActionClearGoals>>(
    merge(defaultsParams?.clearGoals || {}, props?.initialValues || {}),
  );

  // Reflect values changes
  React.useEffect(() => {
    newProps?.onTemplate(toActionTemplate(ACTION_NAME, valuer.data, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(valuer.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.disabled, valuer.data]);

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

  const isDisabled = newProps.disabledCheckbox || !newProps.disabled;

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
        <div className="pl-3 text-muted mb-3"><i>No parameters</i></div>
      )}
    </div>
  );
};

// Properties validation
ClearGoals.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default ClearGoals;
