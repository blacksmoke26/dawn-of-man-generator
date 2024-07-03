/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-12
 */

import React from 'react';

// utils
import {onlyKeys} from '~/helpers/object';
import {createConditionComponent} from './utils/condition';

// types
import type {ConditionName, ConditionProps} from '~/types/condition.types';
import {LOGICAL_CONDITION} from '~/utils/condition';

export interface Props extends ConditionProps<any> {
  type: ConditionName;
}

/** Condition functional component */
const Condition = (props: Props) => {
  const ConditionComponent = createConditionComponent(props.type);
  const componentProps = onlyKeys<Props>(props, ['type'], true) as Record<string, any>;

  if (LOGICAL_CONDITION.includes(props?.type)) {
    componentProps.operator = props?.type;
    componentProps.values = props?.initialValues?.conditions || [];
    delete componentProps.initialValues;
  }

  return (
    <ConditionComponent removeIcon={true} showCheckbox={false} {...componentProps} />
  );
};

export default Condition;
