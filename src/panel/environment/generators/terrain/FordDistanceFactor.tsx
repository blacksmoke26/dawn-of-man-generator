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
import {FORD_DISTANCE_FACTOR_DEFAULT} from '~/utils/defaults';

// parsers
import {toFordDistanceFactorTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

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
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [distance, setDistance] = React.useState<number>(props?.distance ?? random.randomFloat());

  const reduxState = useAppSelector(({environment}) => environment.values?.fordDistanceFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setDistance(FORD_DISTANCE_FACTOR_DEFAULT);
      dispatch(clearProperty('fordDistanceFactor'));
    } else if(typeof reduxState === 'number') {
      setChecked(true);
      setDistance(reduxState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toFordDistanceFactorTemplate(distance, !checked), distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={distance}
        checked={checked}
        checkboxPosition="right"
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
