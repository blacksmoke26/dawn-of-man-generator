/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import merge from 'deepmerge';
import cn from 'classname';
import {ButtonGroup, Col, ColProps} from 'react-bootstrap';

// components
import LinkButton from '../LinkButton';
import Slider from '~/components/ui/Slider';
import {Option as SelectOption} from '~/components/ui/Select';

// icons
import {COLOR_DISABLED, COLOR_REDDISH, IconRestore, IconShuffle} from '../../icons/app';

// types
import type {Required} from 'utility-types';
import type {SliderProps} from 'rc-slider';

export type Option = Omit<SelectOption, 'desc'>;

interface Props {
  disabled?: boolean;
  colProps?: ColProps;
  allowShuffle?: boolean;
  allowRestore?: boolean;
  first?: number;
  second?: number;
  third?: number;

  sliderProps?: SliderProps;

  onShuffle?(): void;

  onRestore?(): void;

  onChange?(first: number, second: number, third: number): void;
}


/** AttributeTripleSlider functional component */
const AttributeTripleSlider = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    colProps: {},
    first: 0,
    second: 0,
    third: 0,
    allowShuffle: false,
    allowRestore: false,
    sliderProps: {
      min: 1,
      max: 100,
      step: 0.01,
    },
    onShuffle() {
    },
    onRestore() {
    },
    onChange() {
    },
  }, props);

  const valueFirst = newProps?.first || 0;
  const valueSecond = newProps?.second || 0;
  const valueThird = newProps?.third || 0;

  return (
    <Col sm="8" {...newProps.colProps}>
      <div className="mb-2">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueFirst}
            {...newProps.sliderProps}
            onChange={value => {
              newProps.onChange(value as number, valueSecond, valueThird);
            }}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueFirst}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="mb-2">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueSecond}
            {...newProps.sliderProps}
            onChange={value => {
              newProps.onChange(valueFirst, value as number, valueThird);
            }}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueSecond}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      <div>
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueThird}
            {...newProps.sliderProps}
            onChange={value => {
              newProps.onChange(valueFirst, valueSecond, value as number);
            }}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueThird}</code>
        </div>
        <div className="clearfix"></div>
      </div>

      <div>
        <ButtonGroup className="mt-1">
          {newProps.allowShuffle && (
            <LinkButton
              disabled={newProps.disabled}
              className="ml-0"
              title="Randomize all values"
              onClick={() => newProps.onShuffle()}>
              <IconShuffle width="14" height="14"/> Randomize all
            </LinkButton>
          )}
          {newProps.allowRestore && (
            <LinkButton
              disabled={newProps.disabled}
              className="ml-2"
              title="Restore values to their default"
              onClick={() => newProps.onRestore()}>
              <IconRestore
                color={newProps.disabled ? COLOR_DISABLED : COLOR_REDDISH}
                width="14" height="14"/> Restore all
            </LinkButton>
          )}
        </ButtonGroup>
      </div>
    </Col>
  );
};

export default React.memo(AttributeTripleSlider);
