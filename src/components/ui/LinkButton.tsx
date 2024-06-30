/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import {Button, ButtonProps} from 'react-bootstrap';

// icons
import {COLOR_DISABLED, COLORS_MAP, ColorType} from '~/components/icons/app';


export interface LinkButtonProps extends Partial<ButtonProps> {
  color?: ColorType;
}

/** LinkButton functional component */
const LinkButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<LinkButtonProps>>((props, ref) => {
  const style = {
    ...(props?.style || {}),
    color: props?.disabled
      ? COLOR_DISABLED
      : COLORS_MAP[props?.color || 'WHITISH'],
  };

  return (
    <Button
      ref={ref}
      {...props}
      variant="link"
      size={props?.size ?? 'sm'}
      className={cn('button-reset-sm', props?.className)}
      style={style}>
      {props?.children}
    </Button>
  );
});

export default LinkButton;
