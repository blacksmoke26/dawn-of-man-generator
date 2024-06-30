/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-30
 * @version 2.5
 */

import React from 'react';

// components
import PopoverNumberInput, {PopoverNumberInputProps} from '~/components/ui/PopoverNumberInput';

/**
 * Primary UI component for user interaction
 */
export const Component = ({...props}: PopoverNumberInputProps) => {
  return (
    <PopoverNumberInput {...props}/>
  );
};
