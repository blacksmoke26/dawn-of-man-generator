/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

import React from 'react';

// elemental components
import LinkButton from '~/components/ui/LinkButton';

// icons
import {IconShuffle} from '~/components/icons/app';

export interface Props {
  disabled?: boolean;
  label?: string;
  title?: string;
  className?: string;
  buttonOnly?: boolean;

  onClick?(): void;
}

/** RandomizeValuesButton functional component */
const RandomizeValuesButton = (props: Props) => {
  const button = (
    <LinkButton
      className="ml-0"
      title={props?.title?.trim() || 'Randomize all values except for the disabled ones'}
      disabled={props?.disabled}
      onClick={() => {
        'function' === typeof props?.onClick && props?.onClick();
      }}>
      <IconShuffle/> {props?.label?.trim() || 'Randomize values'}
    </LinkButton>
  );

  return props?.buttonOnly ? button : (
    <div className={props?.className}>
      <hr className="mb-2"/>
      {button}
    </div>
  );
};

export default React.memo(RandomizeValuesButton);
