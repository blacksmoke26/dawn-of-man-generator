/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, ColProps} from 'react-bootstrap';

// components
import Range from '../Range';
import LinkButton from '../LinkButton';

// icons
import {IconRestore, IconShuffle} from '../../icons/app';

// types
import type {SliderProps} from 'rc-slider';
import type {Required} from 'utility-types';

interface Props {
  disabled?: boolean;
  colProps?: ColProps;
  min?: number;
  max?: number;
  allowShuffle?: boolean;
  allowRestore?: boolean;
  sliderProps?: SliderProps;

  onShuffle?(): void;

  onRestore?(): void;

  onChange?(min: number, max: number): void;
}

/** AttributeRangeValue functional component */
const AttributeRangeValue = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    min: 0,
    max: 0,
    colProps: {},
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
    <Col sm="10" {...newProps.colProps}>
      <div>
        <div className="text-size-xs font-family-code float-left">
          Min: <code className={cn({'text-muted': newProps.disabled})}>
          {newProps.min}
        </code>
          {' / '}
          Max: <code className={cn({'text-muted': newProps.disabled})}>
          {newProps.max}
        </code>
        </div>
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
        <div className="clearfix"></div>
      </div>
      <Range
        disabled={newProps.disabled}
        value={[newProps.min, newProps.max]}
        onChange={value => {
          const [min, max] = value as [number, number];
          newProps.onChange(min, max);
        }}
        {...newProps.sliderProps}/>
    </Col>
  );
};

export default React.memo(AttributeRangeValue);
