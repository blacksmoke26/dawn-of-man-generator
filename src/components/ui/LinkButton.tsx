/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import React, {CSSProperties, PropsWithChildren} from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Button} from 'react-bootstrap';

// icons
import {
  COLOR_DISABLED, COLOR_GRAYED,
  COLOR_REDDISH, COLOR_WHITISH,
} from '~/components/icons/app';

// types
import {KVDocument} from '~/types/json.types';

const colorsMap = {
  WHITISH: COLOR_WHITISH,
  REDDISH: COLOR_REDDISH,
  GRAYED: COLOR_GRAYED,
} as const;

export interface LinkButtonProps {
  disabled?: boolean;
  className?: string | KVDocument<boolean>;
  style?: CSSProperties;
  color?: keyof typeof colorsMap;
  size?: 'sm' | 'lg';
  title?: string;

  onClick(): void;
}

/** LinkButton functional component */
const LinkButton = (props: PropsWithChildren<LinkButtonProps>) => {
  const newProps = merge<Required<LinkButtonProps>>({
    disabled: false,
    size: 'sm',
    className: '',
    title: '',
    style: {},
    color: 'WHITISH',
    onClick() {
    },
  }, props);

  return (
    <Button
      disabled={newProps.disabled} variant="link"
      className={cn('button-reset-sm', newProps.className)}
      size={newProps.size}
      style={merge({
        color: newProps.disabled
          ? COLOR_DISABLED
          : colorsMap[newProps.color],
      }, newProps.style)}
      onClick={() => newProps.onClick()}
      title={newProps.title}>
      {props?.children}
    </Button>
  );
};

export default LinkButton;
