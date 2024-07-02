/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';

// Components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';

// Utils
import * as random from '~/utils/scenario/random';
import * as Defaults from '~/utils/scenario/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toSizeTemplate} from '~/utils/parser/templates-general';

/** MapSize `props` type */
interface Props {
  enabled?: boolean,
  value?: number,

  onChange?(template: string, value: number): void,
}

/** MapSize functional component */
const MapSize = (props: Props) => {
  props = merge({
    enabled: true,
    value: Defaults.MAP_SIZE_DEFAULT,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [value, setValue] = React.useState<number>(props.value as number);

  const sizeAttribute = useAppSelector(({scenario}) => scenario.values?.size);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = sizeAttribute ?? null;

    // noinspection SuspiciousTypeOfGuard
    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (typeof extValue === 'number') {
      setEnabled(true);
      setValue(extValue);
    }
  }, [sizeAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toSizeTemplate(value, enabled), value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <PanelToolbar
        value={value}
        checked={enabled}
        checkboxPosition="right"
        heading="Map size"
        description="Defines the size of the map, beware that big maps can drain performance."
        allowNumberInput
        numberInputProps={{
          min: Defaults.MAP_SIZE_MIN,
          max: Defaults.MAP_SIZE_MAX,
          decimals: 0,
        }}
        onCheckboxChange={state => setEnabled(state)}
        onChange={(val: number) => setValue(+val)}
        allowShuffle
        onShuffle={() => setValue(random.randomMapSize())}
        allowRestore
        onRestore={() => setValue(Defaults.MAP_SIZE_DEFAULT)}
        disabled={!enabled}/>
      <Slider
        min={Defaults.MAP_SIZE_MIN}
        max={Defaults.MAP_SIZE_MAX}
        step={1} disabled={!enabled}
        value={Number(value)} onChange={v => setValue(v as number)}/>
    </div>
  );
};

// Properties validation
MapSize.propTypes = {
  enabled: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default MapSize;
