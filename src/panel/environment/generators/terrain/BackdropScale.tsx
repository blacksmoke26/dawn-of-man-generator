/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import * as PropTypes from 'prop-types';

// elemental components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';

// icons
import {COLOR_REDDISH, COLOR_WHITISH} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import {Json} from '~/types/json.types';

/**
 * BackdropScale `props` type
 */
export interface BackdropScaleProps {
  checked?: boolean;
  angle1?: number;
  angle2?: number;
  angle3?: number;

  onChange?(template: string, values?: Json): void;
}

/** Default values */
const defaultValues: { angle3: number; angle1: number; angle2: number } = {
  angle1: 1.0,
  angle2: 0.25,
  angle3: 1.0,
};

/** BackdropScale functional component */
const BackdropScale = (props: BackdropScaleProps) => {
  props = merge({
    checked: false,
    ...defaultValues,
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
  const [angle1, setAngle1] = React.useState<number | string>(props.angle1 as number);
  const [angle2, setAngle2] = React.useState<number | string>(props.angle2 as number);
  const [angle3, setAngle3] = React.useState<number | string>(props.angle3 as number);

  const backdropScaleAttribute = useAppSelector(({environment}) => environment?.values?.backdropScale);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = backdropScaleAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    } else if (Array.isArray(extValue)) {
      setChecked(true);
      setAngle1(extValue[0]);
      setAngle2(extValue[1]);
      setAngle3(extValue[2]);
    }
  }, [backdropScaleAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), {angle1, angle2, angle3});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, angle1, angle2, angle3]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return checked
      ? `<backdrop_scale value="${angle1}, ${angle2}, ${angle3}"/>`
      : '';
  }, [checked, angle1, angle2, angle3]);

  const numberInputProps = {
    min: Defaults.ANGLE_MIN,
    max: Defaults.ANGLE_MAX,
    decimals: 2,
    hideArrow: true,
    disabled: !checked,
    title: 'Edit/Change value',
    className: cn({'text-underline-dotted': checked}),
    style: {color: COLOR_REDDISH, top: -1},
  };

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        checked={checked}
        heading="Backdrop Scale"
        description="Change the size of backdrops (the mountains you see beyond the map)."
        onCheckboxChange={state => setChecked(state)}
        value={(
          <>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle1 as number}
              onSave={value => setAngle1(value as number)}/>
            <strong style={{marginRight: 7, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle2 as number}
              onSave={value => setAngle2(value as number)}/>
            <strong style={{marginRight: 7, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle3 as number}
              onSave={value => setAngle3(value as number)}/>
          </>
        )}
        allowShuffle
        onShuffle={() => {
          const rand = random.randomBackdropScale();
          setAngle1(rand[0]);
          setAngle2(rand[1]);
          setAngle3(rand[2]);
        }}
        allowRestore
        onRestore={() => {
          setAngle1(defaultValues.angle1);
          setAngle2(defaultValues.angle2);
          setAngle3(defaultValues.angle3);
        }}
        disabled={!checked}/>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={Number(angle1)}
          onChange={v => setAngle1(v as number)}/>
      </div>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={Number(angle2)}
          onChange={v => setAngle2(v as number)}/>
      </div>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={Number(angle3)}
          onChange={v => setAngle3(v as number)}/>
      </div>
    </div>
  );
};

// Default properties
BackdropScale.propTypes = {
  checked: PropTypes.bool,
  angle1: PropTypes.number,
  angle2: PropTypes.number,
  angle3: PropTypes.number,
  onChange: PropTypes.func,
};

export default BackdropScale;
