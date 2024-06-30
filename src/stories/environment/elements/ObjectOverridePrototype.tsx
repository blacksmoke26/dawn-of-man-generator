/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @version 2.2
 */

import React from 'react';

// components
import ObjectOverridePrototypeComp, {Props} from '~/components/environment/ObjectOverridePrototype';

/**
 * Primary UI component for user interaction
 */
export const ObjectOverridePrototype = ({type = 'tree', name = 'Flint', ...props}: Props) => {
  return (
    <ObjectOverridePrototypeComp name={name} type={type} {...props}/>
  );
};
