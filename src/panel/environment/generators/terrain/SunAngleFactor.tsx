/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';

// elemental components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';

// Utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

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
  props = merge({
    checked: false,
    angle: random.randomSunAngleFactor(),
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
  const [angle, setAngle] = React.useState<number>(props.angle as number);

  const sunAngleFactorAttribute = useAppSelector(({environment}) => environment.values?.sunAngleFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = sunAngleFactorAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    } else if (typeof extValue === 'number') {
      setChecked(true);
      setAngle(extValue);
    }
  }, [sunAngleFactorAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), angle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle, checked]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return checked
      ? `<sun_angle_factor value="${angle}"/>`
      : '';
  }, [angle, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={angle}
        checked={checked}
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
