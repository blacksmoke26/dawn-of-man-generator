// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toRequiredMilestoneTemplate} from '~/utils/parser/templates-general';
import NumberInput from '~/components/ui/NumberInput';
import {randomIntMinMax} from '~/utils/random';

/** RequiredMilestone `props` type */
interface Props {
	enabled?: boolean,
	value?: number,

	onChange?(template: string, value: number): void,
}

/** RequiredMilestone functional component */
const RequiredMilestone = ( props: Props ) => {
	props = merge({
		value: 3,
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<number>(props.value as number);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const requiredMilestonesAttribute = useAppSelector(({scenario}) => scenario.values?.requiredMilestones);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = requiredMilestonesAttribute ?? null;
		
		if ( !extValue || !parseInt(String(extValue)) ) {
			setEnabled(!!extValue);
		} else {
			setValue(extValue as number);
		}
	}, [requiredMilestonesAttribute]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toRequiredMilestoneTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<PanelToolbar
        checked={enabled}
        heading="Required Milestones"
				checkboxPosition="right"
        description="Milestones needed for the scenario to count as
        completed, so that depending scenarios can be started."
        onCheckboxChange={state => setEnabled(state)}
				value=""
        disabled={!enabled}/>

			<div className="w-50">
				<NumberInput
					disabled={!enabled}
					value={value}
					min={1}
					max={20}
					maxLength={2}
					placeholder="0"
					shuffle
					onShuffle={() => setValue(randomIntMinMax(1,20))}
					onChange={num => {
						num = +num;
						setValue(!num ? 0 : (num > 20 ? 20 : num))
					}}
				/>
			</div>
		</div>
	);
};

// Properties validation
RequiredMilestone.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default RequiredMilestone;
