/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import React from 'react';

// components
import TriggerRaiderAttack, {Props} from '~/components/scenario/actions/TriggerRaiderAttack';

/**
 * Primary UI component for user interaction
 */
export const ActionTriggerRaiderAttack = ({...props}: Props) => {
  return (
    <TriggerRaiderAttack {...props}/>
  );
};
