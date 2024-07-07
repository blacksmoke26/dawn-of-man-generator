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
import * as Defaults from '~/utils//defaults';
import {DISTANCE_HEIGHT_OFFSET_DEFAULT} from '~/utils/defaults';

// parsers
import {toDistanceHeightOffsetTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

/**
 * DistanceHeightOffset `props` type
 */
export interface DistanceHeightOffsetProps {
  checked?: boolean;
  distance?: number;

  onChange?(template: string, value: number): void;
}

/** DistanceHeightOffset functional component */
const DistanceHeightOffset = (props: DistanceHeightOffsetProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [distance, setDistance] = React.useState<number>(props?.distance ?? random.randomDistance());

  const reduxState = useAppSelector(({environment}) => environment?.values?.distanceHeightOffset);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setDistance(DISTANCE_HEIGHT_OFFSET_DEFAULT);
      dispatch(clearProperty('distanceHeightOffset'));
    } else if (typeof reduxState === 'number') {
      setChecked(true);
      setDistance(reduxState);
      dispatch(clearProperty('distanceHeightOffset'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toDistanceHeightOffsetTemplate(distance, !checked), distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={distance}
        checked={checked}
        checkboxPosition="right"
        heading="Distance Height Offset"
        description="How much bigger are mountains at the edge of map."
        allowNumberInput
        numberInputProps={{
          min: Defaults.DISTANCE_HEIGHT_OFFSET_MIN,
          max: Defaults.DISTANCE_HEIGHT_OFFSET_MAX,
          decimals: 2,
        }}
        onCheckboxChange={state => setChecked(state)}
        onChange={(val: number) => setDistance(+val)}
        allowShuffle
        onShuffle={() => setDistance(random.randomDistanceHeightOffset(true))}
        allowMin
        onMin={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_MIN)}
        allowMax
        onMax={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_MAX)}
        allowRestore
        onRestore={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_DEFAULT)}
        disabled={!checked}/>
      <Slider
        min={Defaults.DISTANCE_HEIGHT_OFFSET_MIN}
        max={Defaults.DISTANCE_HEIGHT_OFFSET_MAX}
        step={0.01} disabled={!checked}
        value={Number(distance)} onChange={v => setDistance(v as number)}/>
    </div>
  );
};

// Default properties
DistanceHeightOffset.propTypes = {
  checked: PropTypes.bool,
  distance: PropTypes.number,
  onChange: PropTypes.func,
};

export default DistanceHeightOffset;
