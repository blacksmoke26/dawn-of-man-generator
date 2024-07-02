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
import TextInput from '~/components/ui/TextInput';
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toRequiredScenarioTemplate} from '~/utils/parser/templates-general';

/** RequiredScenario `props` type */
interface Props {
	enabled?: boolean,
	value?: string,

	onChange?(template: string, value: string): void,
}

/** RequiredScenario functional component */
const RequiredScenario = ( props: Props ) => {
	props = merge({
		value: 'the_long_march',
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<string>(props.value as string);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const requiredScenarioAttribute = useAppSelector(({scenario}) => scenario?.values?.requiredScenario);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = requiredScenarioAttribute ?? null;
		
		if ( !extValue ) {
			setEnabled(!!extValue);
		} else {
			setValue(extValue as string);
		}
	}, [requiredScenarioAttribute]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toRequiredScenarioTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);

	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<PanelToolbar
        checked={enabled}
        heading="Required Scenario"
				checkboxPosition="right"
        description="Specifies another scenario the user has to complete before playing this one."
        onCheckboxChange={state => setEnabled(state)}
				value=""
        disabled={!enabled}/>
			<div className="w-75">
        <TextInput
          caseType="SNAKE_CASE"
          disabled={!enabled}
          value={value}
          maxLength={80}
          placeholder="e.g., the_long_march"
          onChange={theValue => setValue(theValue as string)}/>
      </div>
		</div>
	);
};

// Properties validation
RequiredScenario.propTypes = {
	value: PropTypes.string,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default RequiredScenario;
