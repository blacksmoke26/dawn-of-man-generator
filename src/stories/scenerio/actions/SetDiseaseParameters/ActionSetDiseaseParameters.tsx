/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import React from 'react';

// components
import SetDiseaseParameters, {Props} from '~/components/scenario/actions/SetDiseaseParameters';

/**
 * Primary UI component for user interaction
 */
export const ActionSetDiseaseParameters = ({...props}: Props) => {
  return (
    <SetDiseaseParameters {...props}/>
  );
};
