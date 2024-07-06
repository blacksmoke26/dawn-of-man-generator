/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';

// elemental components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';

// icons
import {COLOR_REDDISH, COLOR_WHITISH} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {BACKDROP_SCALE_DEFAULT} from '~/utils/defaults';

// parsers
import {toBackdropScaleTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

// types
import type {Json} from '~/types/json.types';

const ANGLE1_DEFAULT = BACKDROP_SCALE_DEFAULT[0] as number;
const ANGLE2_DEFAULT = BACKDROP_SCALE_DEFAULT[1] as number;
const ANGLE3_DEFAULT = BACKDROP_SCALE_DEFAULT[2] as number;

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

/** BackdropScale functional component */
const BackdropScale = (props: BackdropScaleProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [angle1, setAngle1] = React.useState<number>(props?.angle1 ?? ANGLE1_DEFAULT as number);
  const [angle2, setAngle2] = React.useState<number>(props?.angle2 ?? ANGLE2_DEFAULT as number);
  const [angle3, setAngle3] = React.useState<number>(props?.angle3 ?? ANGLE3_DEFAULT as number);

  const reduxState = useAppSelector(({environment}) => environment?.values?.backdropScale);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setAngle1(ANGLE1_DEFAULT);
      setAngle2(ANGLE2_DEFAULT);
      setAngle3(ANGLE3_DEFAULT);
      dispatch(clearProperty('backdropScale'));
    } else if (Array.isArray(reduxState)) {
      setChecked(true);
      setAngle1(reduxState[0] || ANGLE1_DEFAULT);
      setAngle2(reduxState[1] || ANGLE2_DEFAULT);
      setAngle3(reduxState[2] || ANGLE3_DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(
      toBackdropScaleTemplate([angle1, angle2, angle3], !checked),
      {angle1, angle2, angle3}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        checkboxPosition="right"
        heading="Backdrop Scale"
        description="Change the size of backdrops (the mountains you see beyond the map)."
        onCheckboxChange={state => setChecked(state)}
        value={(
          <>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle1 || ANGLE1_DEFAULT as number}
              onSave={setAngle1}/>
            <strong style={{marginRight: 7, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle2 || ANGLE1_DEFAULT}
              onSave={setAngle2}/>
            <strong style={{marginRight: 7, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...numberInputProps}
              value={angle3 || ANGLE1_DEFAULT}
              onSave={setAngle3}/>
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
          setAngle1(ANGLE1_DEFAULT);
          setAngle2(ANGLE2_DEFAULT);
          setAngle3(ANGLE3_DEFAULT);
        }}
        disabled={!checked}/>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={angle1}
          onChange={value => setAngle1(+value)}/>
      </div>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={angle2}
          onChange={value => setAngle2(+value)}/>
      </div>
      <div className="mb-2">
        <Slider
          disabled={!checked} step={0.01} value={angle3}
          onChange={value => setAngle3(+value)}/>
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
