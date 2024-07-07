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

// parsers
import {toGlobalTreeDensityTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

export interface GlobalTreeDensityProps {
  checked?: boolean,

  onChange(template: string, value: number): void,
}

/** GlobalTreeDensity functional component */
const GlobalTreeDensity = (props: GlobalTreeDensityProps) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<number>(random.randomDensity());
  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);

  const reduxState = useAppSelector(({environment}) => environment.values?.globalTreeDensity);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue(Defaults.DENSITY_DEFAULT);
      dispatch(clearProperty('globalTreeDensity'));
    } else if (typeof reduxState === 'number') {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('globalTreeDensity'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toGlobalTreeDensityTemplate(value, !checked), value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={+value}
        checked={checked}
        checkboxPosition="right"
        heading="Global Tree Density"
        description="The global tree density in the environment."
        allowNumberInput
        numberInputProps={{
          min: Defaults.DENSITY_MIN,
          max: Defaults.DENSITY_MAX,
          decimals: 2,
        }}
        onCheckboxChange={state => setChecked(state)}
        onChange={(val: number) => setValue(+val)}
        allowShuffle
        onShuffle={() => setValue(random.randomDensity(true))}
        allowMin
        onMin={() => setValue(Defaults.DENSITY_MIN)}
        allowMax
        onMax={() => setValue(Defaults.DENSITY_MAX)}
        allowRestore
        onRestore={() => setValue(Defaults.DENSITY_DEFAULT)}
        disabled={!checked}/>

      <Slider
        step={0.01} disabled={!checked} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
        value={Number(value)} onChange={v => setValue(v as number)}/>
    </div>
  );
};

// Properties validation
GlobalTreeDensity.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default GlobalTreeDensity;
