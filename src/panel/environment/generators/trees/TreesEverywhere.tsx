/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';

export interface TreesEverywhereProps {
	checked?: boolean,
	onChange?(template: string, value: boolean): void,
}

/** TreesEverywhere functional component */
const TreesEverywhere = ( props: TreesEverywhereProps ) => {
	props = merge({
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<boolean>(random.randomTreesEverywhere());
	const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);

	const treesEverywhereAttribute = useAppSelector(({environment}) => environment.values?.treesEverywhere);

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = treesEverywhereAttribute ?? null;

		if ( typeof extValue === 'boolean' ) {
			setChecked(extValue);
			setValue(extValue);
		}
	}, [treesEverywhereAttribute]);

	// Reflect attributes changes
	React.useEffect(() => {
		setChecked(props.checked as boolean);
	}, [props.checked]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, checked]);

	const toTemplateText = (): string => {
		return !checked
			? ''
			: `<trees_everywhere value="${value ? 'true' : 'false'}"/>`;
	};

	return (
		<div className={cn('mb-2 checkbox-align', {'text-muted': !checked})}>
			<PanelToolbar
        checked={checked}
        heading="Trees Everywhere"
        description="Show trees on rivers, lakes, stones etc..."
        onCheckboxChange={state => setChecked(state)}
        value={value ? 'Yes' : 'No'}
        allowShuffle
        onShuffle={() => setValue(random.randomTreesEverywhere())}
        disabled={!checked}/>

			<Form.Check
				type="switch"
				className="pull-right"
				disabled={!checked}
				id={`trees_everywhere-${nanoid(5)}`}
				label="Yes, everywhere!"
				checked={value}
				onChange={e => setValue(e.target.checked)}
			/>
		</div>
	);
};

// Properties validation
TreesEverywhere.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
};

export default TreesEverywhere;
