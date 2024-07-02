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
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toNomadModeAllowedTemplate} from '~/utils/parser/templates-general';

/** NomadModeAllowed `props` type */
interface Props {
	enabled?: boolean,
	value?: boolean,

	onChange?(template: string, value: boolean): void,
}

/** NomadModeAllowed functional component */
function NomadModeAllowed ( props: Props ) {
	props = merge({
		value: false,
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<boolean>(props.value as boolean);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const nomadModeAllowedAttribute = useAppSelector(({scenario}) => scenario.values?.nomadModeAllowed);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = nomadModeAllowedAttribute ?? null;
		
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
			setValue(extValue);
		}
	}, [nomadModeAllowedAttribute]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toNomadModeAllowedTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);

	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<PanelToolbar
        checked={enabled}
        heading="Nomad Mode"
				checkboxPosition="right"
        description="Player whether this scenario can be played in nomad mode or not."
        onCheckboxChange={state => setEnabled(state)}
				value={<span className={cn({'text-line-through': !enabled})}>{value ? 'Yes' : 'No'}</span>}
        disabled={!enabled}/>
			<Form.Check
				type="switch"
				className="pull-right"
				disabled={!enabled}
				id={`nomad_mode_allowed-${nanoid(5)}`}
				label="Allowed?"
				checked={value}
				onChange={e => setValue(e.target.checked)}
			/>
		</div>
	);
}

// Properties validation
NomadModeAllowed.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default NomadModeAllowed;
