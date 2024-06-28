/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import React from 'react';

// components
import SetMigrationParameters, {Props} from '~/components/scenario/actions/SetMigrationParameters';

/**
 * Primary UI component for user interaction
 */
export const ActionSetMigrationParameters = ({...props}: Props) => {
  return (
    <SetMigrationParameters {...props}/>
  );
};
