/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';

// Components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';

// Utils
import * as random from '~/utils/scenario/random';
import * as Defaults from '~/utils/scenario/defaults';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// parsers
import {toSizeTemplate} from '~/utils/parser/templates-general';

/** MapSize `props` type */
interface Props {
  disabled?: boolean,
  initialValues?: {
    value: number;
  };

  onChange?(template: string): void;
}

/** MapSize functional component */
const MapSize = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<number>(props?.initialValues?.value ?? Defaults.MAP_SIZE_DEFAULT);
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario.values?.size) as null | number | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue(Defaults.MAP_SIZE_DEFAULT);
      dispatch(clearProperty('size'));
    } else if ('number' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('size'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toSizeTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted-deep': !checked})}>
      <PanelToolbar
        value={value}
        checked={checked}
        checkboxPosition="right"
        heading="Map size"
        description="Defines the size of the map, beware that big maps can drain performance."
        allowNumberInput
        numberInputProps={{
          min: Defaults.MAP_SIZE_MIN,
          max: Defaults.MAP_SIZE_MAX,
          decimals: 0,
        }}
        onCheckboxChange={isChecked => setChecked(isChecked)}
        onChange={(val: number) => setValue(+val)}
        allowShuffle
        onShuffle={() => setValue(random.randomMapSize())}
        allowRestore
        onRestore={() => setValue(Defaults.MAP_SIZE_DEFAULT)}
        disabled={!checked}/>
      <Slider
        min={Defaults.MAP_SIZE_MIN}
        max={Defaults.MAP_SIZE_MAX}
        step={1} disabled={!checked}
        value={Number(value)} onChange={v => setValue(v as number)}/>
    </div>
  );
};

// Properties validation
MapSize.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default MapSize;
