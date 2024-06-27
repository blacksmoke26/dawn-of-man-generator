/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import obPath from 'object-path';
import merge from 'deepmerge';
import cn from 'classname';
import {ButtonGroup, Col, ColProps} from 'react-bootstrap';

// components
import LinkButton from '../LinkButton';
import Slider from '~/components/ui/Slider';
import {Option as SelectOption} from '~/components/ui/Select';

// icons
import {IconRaiseDown, IconRaiseUp, IconShuffle} from '../../icons/app';

// utils
import {randomEraFactors} from '~/utils/random';
import {ERA_FACTORS_HIGHEST, ERA_FACTORS_LOWEST, ERA_FACTORS_MAX, ERA_FACTORS_MIN} from '~/utils/defaults';

// types
import type {Required} from 'utility-types';
import type {SliderProps} from 'rc-slider';
import type {EraFactor} from '~/types/action.types';

export type Option = Omit<SelectOption, 'desc'>;

interface Props {
  disabled?: boolean;
  colProps?: ColProps;
  first?: number;
  second?: number;
  third?: number;
  fourth?: number;
  fifth?: number;
  sixth?: number;

  sliderProps?: SliderProps;

  onChange?(values: EraFactor): void;
}


/** AttributeEraFactor functional component */
const AttributeEraFactor = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    colProps: {},
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    sixth: 0,
    sliderProps: {
      min: ERA_FACTORS_MIN,
      max: ERA_FACTORS_MAX,
      step: 0.01,
    },
    onChange() {
    },
  }, props);

  const valueFirst = newProps?.first || 0;
  const valueSecond = newProps?.second || 0;
  const valueThird = newProps?.third || 0;
  const valueFourth = newProps?.fourth || 0;
  const valueFifth = newProps?.fifth || 0;
  const valueSixth = newProps?.sixth || 0;

  const updateValue = (index: number, value: number): EraFactor => {
    const list: EraFactor = [
      valueFirst, valueSecond, valueThird, valueFourth, valueFifth, valueSixth,
    ];

    obPath.set(list, index, value, false);
    return list;
  };

  return (
    <Col sm="8" {...newProps.colProps}>
      {/*<editor-fold desc="Slider 1">*/}
      <div className="mb-1">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueFirst}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(0, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueFirst}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      {/*<editor-fold desc="Slider 2">*/}
      <div className="mb-1">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueSecond}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(1, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueSecond}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      {/*<editor-fold desc="Slider 3">*/}
      <div className="mb-1">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueThird}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(2, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueThird}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      {/*<editor-fold desc="Slider 4">*/}
      <div className="mb-1">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueFourth}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(3, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueFourth}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      {/*<editor-fold desc="Slider 5">*/}
      <div className="mb-1">
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueFifth}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(4, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueFifth}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      {/*<editor-fold desc="Slider 6">*/}
      <div>
        <div className="float-left w-75">
          <Slider
            disabled={newProps.disabled}
            value={valueSixth}
            {...newProps.sliderProps}
            onChange={value => newProps.onChange(updateValue(5, +value))}/>
        </div>
        <div
          className="float-left ml-2 position-relative"
          style={{top: -4}}>
          <code className={cn({'text-line-through text-muted': newProps?.disabled})}>{valueSixth}</code>
        </div>
        <div className="clearfix"></div>
      </div>
      {/*</editor-fold>*/}
      <div>
        <ButtonGroup className="mt-1">
          <LinkButton
            disabled={newProps.disabled}
            className="ml-0"
            title="Randomize all values"
            onClick={() => newProps.onChange(randomEraFactors())}>
            <IconShuffle width="14" height="14"/> Randomize all
          </LinkButton>
          <LinkButton
            disabled={newProps.disabled}
            className="ml-2"
            title="Set all values to min"
            onClick={() => {
              console.log('ERA_FACTORS_LOWEST:', ERA_FACTORS_LOWEST);
              newProps.onChange([...ERA_FACTORS_LOWEST]);
            }}>
            <IconRaiseDown width="14" height="14"/> Min all
          </LinkButton>
          <LinkButton
            disabled={newProps.disabled}
            className="ml-2"
            title="Set all values to max"
            onClick={() => {
              console.log('ERA_FACTORS_HIGHEST:', ERA_FACTORS_HIGHEST);
              newProps.onChange([...ERA_FACTORS_HIGHEST]);
            }}>
            <IconRaiseUp width="14" height="14"/> Max all
          </LinkButton>
        </ButtonGroup>
      </div>
    </Col>
  );
};

export default React.memo(AttributeEraFactor);
