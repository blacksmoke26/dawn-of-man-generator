/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// types
import type {DeepPartial} from 'utility-types';
import type {ActionName, AnyAction} from '~/types/action.types';
import type {KVDocument, MapDocument} from '~/types/json.types';

// local types
import type {EventState, Props} from '../Event';

// noinspection JSUnusedGlobalSymbols
export const defaultValues: DeepPartial<Props> = {
  initialValues: {
    flags: [],
    condition: {},
    actions: [],
  },
  disabled: false,
  disabledCheckbox: false,
  expanded: true,
  onValuesChange: () => {
  },
  onRemoveClick: () => {
  },
  onTemplate: () => {
  },
  onConditionChange: () => {
  },
  onActionChange: () => {
  },
};

export const actionTypesCounter = (actions: EventState['actions']): MapDocument<ActionName> => {
  return Object.values(actions as KVDocument).reduce((accum: KVDocument, current: AnyAction) => {
    accum[current.type] = (accum?.[current.type] || 0) + 1;
    return accum;
  }, {}) as MapDocument<ActionName>;
};
