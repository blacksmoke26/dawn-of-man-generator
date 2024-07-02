/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, ColProps, Form} from 'react-bootstrap';

// components
import Range from '../Range';
import LinkButton from '../LinkButton';

// icons
import {COLOR_DISABLED, COLOR_ORANGE, COLOR_WHITISH, IconRestore, IconShuffle} from '../../icons/app';

// types
import type {SliderProps} from 'rc-slider';
import type {Required} from 'utility-types';
import {nanoid} from 'nanoid';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';
import {temperatureNumberInputProps} from '~/panel/environment/generators/seasons/utils/params';
import {stepToDecimal} from '~/helpers/number';

interface Props {
  disabled?: boolean;
  colProps?: ColProps;
  min?: number;
  max?: number;
  allowShuffle?: boolean;
  allowRestore?: boolean;
  sliderProps?: SliderProps;
  allowExcludeCheck?: boolean;

  onShuffle?(excludeMin: boolean, excludeMax: boolean): void;

  onRestore?(excludeMin: boolean, excludeMax: boolean): void;

  onChange?(min: number | undefined, max: number | undefined): void;
}

/** AttributeRangeValue functional component */
const AttributeRangeValue = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    allowExcludeCheck: false,
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

  const [minChecked, setMinChecked] = React.useState<boolean>(false);
  const [maxChecked, setMaxChecked] = React.useState<boolean>(false);

  const minValue = minChecked ? 0 : newProps.min;
  const maxValue = maxChecked ? 0 : newProps.max;

  const decimals = stepToDecimal(newProps.sliderProps?.step ?? 0);

  return (
    <Col sm="10" {...newProps.colProps}>
      <div className={cn({'text-muted-deep': newProps.disabled})}>
        <div className="float-right">
          <PopoverNumberInput
            {...temperatureNumberInputProps(!newProps.disabled)}
            min={newProps.sliderProps?.min}
            max={newProps.sliderProps?.max}
            decimals={decimals}
            value={minValue}
            onSave={value => {
              const theValue = value > maxValue ? maxValue : value;
              newProps.onChange(minChecked ? undefined : theValue, maxChecked ? undefined : maxValue)
            }}/>
          <strong style={{marginRight: 5, marginLeft: 3, color: COLOR_WHITISH}}>,</strong>
          <PopoverNumberInput
            {...temperatureNumberInputProps(!newProps.disabled)}
            min={newProps.sliderProps?.min}
            max={newProps.sliderProps?.max}
            decimals={decimals}
            value={maxValue}
            onSave={value => {
              const theValue = value < minValue ? minValue : value;
              newProps.onChange(minChecked ? undefined : minValue, maxChecked ? undefined : theValue)
            }}/>
          {newProps.allowShuffle && (
            <LinkButton
              className="ml-2"
              disabled={newProps.disabled}
              onClick={() => newProps.onShuffle(minChecked, maxChecked)}>
              <IconShuffle/>
            </LinkButton>
          )}
          {newProps.allowRestore && (
            <LinkButton
              className="ml-2"
              disabled={newProps.disabled}
              onClick={() => newProps.onRestore(minChecked, maxChecked)}>
              <IconRestore color={props?.disabled ? COLOR_DISABLED : COLOR_ORANGE}/>
            </LinkButton>
          )}
        </div>
        <div className="clearfix"></div>
      </div>
      <Range
        disabled={newProps.disabled}
        value={[minValue, maxValue]}
        onChange={value => {
          const [min, max] = value as [number, number];
          newProps.onChange(minChecked ? undefined : min, maxChecked ? undefined : max);
        }}
        {...newProps.sliderProps}/>
      {newProps.allowExcludeCheck && (
        <div className="mt-2">
          <div className={cn('float-left', {'text-muted': newProps.disabled})}>
            <Form.Label>
              <Form.Check
                type="switch"
                disabled={newProps.disabled}
                id={`switch-${nanoid(5)}`}
                label=""
                style={{top: -1}}
                className="d-inline p-relative"
                checked={minChecked}
                onChange={e => {
                  setMinChecked(e.target.checked);
                  setTimeout(() => {
                    newProps.onChange(e.target.checked ? undefined : newProps.min, maxChecked ? undefined : newProps.max);
                  }, 20);
                }}
              />
              <span
                title="Exclude minimum value"
                style={{top: -4}}
                className="d-inline-block position-relative">
                    Exclude <code className={cn('pt-0 pb-0', {'text-muted': newProps.disabled})}>min</code>
                  </span>
            </Form.Label>
          </div>
          <div className={cn('float-left ml-3', {'text-muted': newProps.disabled})}>
            <Form.Label>
              <Form.Check
                type="switch"
                disabled={newProps.disabled}
                id={`switch-${nanoid(5)}`}
                label=""
                style={{top: -1}}
                className="d-inline p-relative"
                checked={maxChecked}
                onChange={e => {
                  setMaxChecked(e.target.checked);
                  newProps.onChange(minChecked ? undefined : newProps.min, e.target.checked ? undefined : newProps.max);
                }}
              />
              <span
                title="Exclude maximum value"
                style={{top: -4}}
                className="d-inline-block position-relative">
                  Exclude <code className={cn('pt-0 pb-0', {'text-muted': newProps.disabled})}>max</code>
              </span>
            </Form.Label>
          </div>
          <div className="clearfix"></div>
        </div>
      )}
    </Col>
  );
};

export default React.memo(AttributeRangeValue);
