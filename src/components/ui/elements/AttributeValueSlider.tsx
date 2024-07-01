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
import PopoverNumberInput from '../PopoverNumberInput';

// icons
import {COLOR_REDDISH, IconRestore, IconShuffle} from '../../icons/app';

// utils
import {stepToDecimal} from '~/helpers/number';
import {invokeHandler} from '../../environment/PanelToolbar';

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
    onChange(){
    },
    sliderProps: {
      min: 1,
      max: 100,
      step: 1,
    },
  }, props);

  return (
    <Col sm="10">
      <div className="text-right">
        <PopoverNumberInput
          className={cn('text-size-xs position-relative d-inline-block', {'text-underline-dotted': !props?.disabled})}
          hideArrow
          disabled={newProps.disabled}
          title="Edit/Change value"
          min={newProps?.sliderProps?.min}
          max={newProps?.sliderProps?.max}
          decimals={stepToDecimal(newProps?.sliderProps?.step ?? 0)}
          style={{top: 0, color: COLOR_REDDISH}}
          value={props?.value ?? 0}
          onSave={changedValue => invokeHandler(props, 'onChange', changedValue)}
        />
        {newProps.allowShuffle && (
          <LinkButton
            className="ml-2"
            disabled={newProps.disabled}
            onClick={() => newProps.onShuffle()}>
            <IconShuffle width="13" height="13"/>
          </LinkButton>
        )}
        {newProps.allowRestore && (
          <LinkButton
            className="ml-2"
            disabled={newProps.disabled}
            onClick={() => newProps.onRestore()}>
            <IconRestore width="13" height="13"/>
          </LinkButton>
        )}
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
