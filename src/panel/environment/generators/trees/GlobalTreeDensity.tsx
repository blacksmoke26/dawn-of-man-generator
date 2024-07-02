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
import * as Defaults from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

export interface GlobalTreeDensityProps {
	checked?: boolean,

	onChange(template: string, value: number): void,
}

/** GlobalTreeDensity functional component */
const GlobalTreeDensity = ( props: GlobalTreeDensityProps ) => {
	props = merge({
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<number>(random.randomDensity());
	const [checked, setChecked] = React.useState<boolean>(props.checked || false);

	const globalTreeDensityAttribute = useAppSelector(({environment}) => environment.values?.globalTreeDensity);

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = globalTreeDensityAttribute ?? null;

		if ( typeof extValue === 'boolean' ) {
			setChecked(extValue);
		} else if ( typeof extValue === 'number' ) {
			setChecked(true);
			setValue(extValue);
		}
	}, [globalTreeDensityAttribute]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, checked]);

	/** Generate xml code */
	const toTemplateText = (): string => {
		return checked
			? `<global_tree_density value="${value}"/>`
			: '';
	}

	return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
			<PanelToolbar
        value={+value}
        checked={checked}
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
