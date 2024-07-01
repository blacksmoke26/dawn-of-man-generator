/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-01
 * @version 2.5.0
 */

import cn from 'classname';

// icons
import {COLOR_REDDISH} from '~/components/icons/app';

// utils
import * as Defaults from '~/utils/defaults';

export const temperatureNumberInputProps = (enabled: boolean = false) => ({
  min: Defaults.SEASON_TEMPERATURE_MIN,
  max: Defaults.SEASON_TEMPERATURE_MAX,
  decimals: 0,
  hideArrow: true,
  disabled: !enabled,
  title: 'Edit/Change value',
  className: cn({'text-underline-dotted': enabled}),
  style: {color: COLOR_REDDISH, top: -1},
});
