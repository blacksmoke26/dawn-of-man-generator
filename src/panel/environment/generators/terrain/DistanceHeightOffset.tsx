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

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils//defaults';

// redux
import {useAppSelector} from '~redux/hooks';

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
  props = merge({
    checked: false,
    distance: random.randomFloat(),
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
  const [distance, setDistance] = React.useState<number>(props.distance as number);

  const distanceHeightOffsetAttribute = useAppSelector(({environment}) => environment?.values?.distanceHeightOffset);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = distanceHeightOffsetAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    } else if (typeof extValue === 'number') {
      setChecked(true);
      setDistance(extValue);
    }
  }, [distanceHeightOffsetAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, checked]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return checked
      ? `<distance_height_offset value="${distance}"/>`
      : '';
  }, [distance, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={distance}
        checked={checked}
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
