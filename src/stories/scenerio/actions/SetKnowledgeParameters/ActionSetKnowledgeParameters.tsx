/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import React from 'react';

// components
import SetKnowledgeParameters, {Props} from '~/components/scenario/actions/SetKnowledgeParameters';

/**
 * Primary UI component for user interaction
 */
export const ActionSetKnowledgeParameters = ({...props}: Props) => {
  return (
    <SetKnowledgeParameters {...props}/>
  );
};
