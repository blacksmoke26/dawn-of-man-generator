/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import RCSlider, {SliderProps} from 'rc-slider';

import {handleRender, defaultProps} from './libs/slider';

/**
 * UiSlider functional component
 */
const Range = (props: SliderProps) => {
  return (
    <RCSlider
      range={true}
      step={defaultProps.step}
      min={defaultProps.min}
      max={defaultProps.max}
      defaultValue={0}
      handleRender={handleRender}
      {...props}
    />
  );
};

export default Range;
