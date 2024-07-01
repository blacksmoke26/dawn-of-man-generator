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
 * FordDistanceFactor `props` type
 */
export interface FordDistanceFactorProps {
  checked?: boolean;
  distance?: number;

  onChange?(template: string, value: number): void;
}

/** FordDistanceFactor functional component */
function FordDistanceFactor(props: FordDistanceFactorProps) {
  props = merge({
    enabled: false,
    distance: random.randomFloat(),
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
  const [distance, setDistance] = React.useState<number>(props.distance as number);

  const fordDistanceFactorAttribute = useAppSelector(({environment}) => environment.values?.fordDistanceFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = fordDistanceFactorAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    }

    if (typeof extValue === 'number') {
      setChecked(true);
      setDistance(extValue);
    }
  }, [fordDistanceFactorAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, checked]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return checked
      ? `<ford_distance_factor value="${distance}"/>`
      : '';
  }, [distance, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={distance}
        checked={checked}
        heading="Ford Distance Factor"
        description="The average distance between river fords"
        allowNumberInput
        numberInputProps={{
          min: Defaults.FORD_DISTANCE_FACTOR_MIN,
          max: Defaults.FORD_DISTANCE_FACTOR_MAX,
          decimals: 2,
        }}
        onCheckboxChange={state => setChecked(state)}
        onChange={(val: number) => setDistance(+val)}
        allowShuffle
        onShuffle={() => setDistance(random.randomFordDistanceFactor(true))}
        allowMin
        onMin={() => setDistance(Defaults.FORD_DISTANCE_FACTOR_MIN)}
        allowMax
        onMax={() => setDistance(Defaults.FORD_DISTANCE_FACTOR_MAX)}
        allowRestore
        onRestore={() => setDistance(Defaults.FORD_DISTANCE_FACTOR_DEFAULT)}
        disabled={!checked}/>
      <Slider
        min={Defaults.FORD_DISTANCE_FACTOR_MIN}
        max={Defaults.FORD_DISTANCE_FACTOR_MAX}
        step={0.01} disabled={!checked} value={distance}
        onChange={v => setDistance(v as number)}/>
    </div>
  );
}

// Default properties
FordDistanceFactor.propTypes = {
  checked: PropTypes.bool,
  distance: PropTypes.number,
  onChange: PropTypes.func,
};

export default FordDistanceFactor;
