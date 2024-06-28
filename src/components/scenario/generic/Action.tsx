/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';

// utils
import {onlyKeys} from '~/helpers/object';
import {createActionComponent} from './utils/action';

// types
import type {ActionProps} from '~/types/action.types';
import type {ActionName} from '~/types/action.types';

export interface Props extends ActionProps<any> {
  type: ActionName;
}

/** Action functional component */
const Action = (props: Props) => {
  const ActionComponent = createActionComponent(props.type);
  const componentProps = onlyKeys<Props>(props, ['type'], true) as Record<string, any>;

  return (
    <ActionComponent removeIcon={true} {...componentProps} />
  );
};

export default Action;
