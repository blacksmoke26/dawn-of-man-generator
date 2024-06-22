/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Col} from 'react-bootstrap';

// components
import Slider from '../Slider';
import LinkButton from '../LinkButton';

// icons
import {IconRestore, IconShuffle} from '../../icons/app';

// types
import type {SliderProps} from 'rc-slider';
import type {Required} from 'utility-types';

export interface Props {
  disabled?: boolean;
  value?: number;
  allowShuffle?: boolean;
  allowRestore?: boolean;
  sliderProps?: SliderProps;

  onShuffle?(): void;

  onRestore?(): void;

  onChange?(value: number): void;
}

/** AttributeValueSlider functional component */
const AttributeValueSlider = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    value: 0,
    allowShuffle: true,
    allowRestore: true,
    onShuffle() {
    },
    onRestore() {
    },
    sliderProps: {
      min: 1,
      max: 100,
      step: 1,
    },
  }, props);

  return (
    <Col sm="10">
      <div>
        <div className="float-left text-size-xs font-family-code">
          Value: <code className={cn({'text-muted': newProps.disabled})}>{newProps.value}</code>
        </div>
        {(newProps.allowShuffle || newProps.allowRestore) && (
          <div className="float-right">
            {newProps.allowShuffle && (
              <LinkButton
                disabled={newProps.disabled}
                onClick={() => newProps.onShuffle()}>
                <IconShuffle/>
              </LinkButton>
            )}
            {newProps.allowRestore && (
              <LinkButton
                disabled={newProps.disabled}
                onClick={() => newProps.onRestore()}>
                <IconRestore/>
              </LinkButton>
            )}
          </div>
        )}
        <div className="clearfix"></div>
      </div>
      <Slider
        disabled={newProps.disabled}
        value={newProps.value}
        onChange={value => newProps.onChange(value as number)}
        {...newProps.sliderProps}/>
    </Col>
  );
};

export default React.memo(AttributeValueSlider);
