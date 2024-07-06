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

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {SUN_ANGLE_FACTOR_DEFAULT} from '~/utils/defaults';

// parsers
import {toSunAngleFactorTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

/**
 * SunAngleFactor `props` type
 */
export interface SunAngleFactorProps {
  checked?: boolean;
  angle?: number;

  onChange?(template: string, value: number): void;
}

/** SunAngleFactor functional component */
const SunAngleFactor = (props: SunAngleFactorProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [angle, setAngle] = React.useState<number>(props?.angle ?? random.randomSunAngleFactor());

  const reduxState = useAppSelector(({environment}) => environment.values?.sunAngleFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setAngle(SUN_ANGLE_FACTOR_DEFAULT);
      dispatch(clearProperty('sunAngleFactor'));
    } else if (typeof reduxState === 'number') {
      setChecked(true);
      setAngle(reduxState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toSunAngleFactorTemplate(angle, !checked), angle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={angle}
        checked={checked}
        checkboxPosition="right"
        heading="Sun Angle Factor"
        description="How high is the sun in the sky"
        allowNumberInput
        numberInputProps={{
          min: Defaults.SUN_ANGLE_FACTOR_MIN,
          max: Defaults.SUN_ANGLE_FACTOR_MAX,
          decimals: 2,
        }}
        onCheckboxChange={state => setChecked(state)}
        onChange={(val: number) => setAngle(+val)}
        allowShuffle
        onShuffle={() => setAngle(random.randomSunAngleFactor(true))}
        allowMin
        onMin={() => setAngle(Defaults.SUN_ANGLE_FACTOR_MIN)}
        allowMax
        onMax={() => setAngle(Defaults.SUN_ANGLE_FACTOR_MAX)}
        allowRestore
        onRestore={() => setAngle(Defaults.SUN_ANGLE_FACTOR_DEFAULT)}
        disabled={!checked}/>
      <Slider
        min={Defaults.SUN_ANGLE_FACTOR_MIN}
        max={Defaults.SUN_ANGLE_FACTOR_MAX}
        step={0.1} disabled={!checked}
        value={+angle}
        onChange={v => setAngle(v as number)}/>
    </div>
  );
};

// Default properties
SunAngleFactor.propTypes = {
  checked: PropTypes.bool,
  angle: PropTypes.number,
  onChange: PropTypes.func,
};

export default SunAngleFactor;
