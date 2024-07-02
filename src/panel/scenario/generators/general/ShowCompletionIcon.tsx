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

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toShowCompletionIconTemplate} from '~/utils/parser/templates-general';

/** ShowCompletionIcon `props` type */
interface Props {
	enabled?: boolean,
	value?: boolean,

	onChange(template: string, value: boolean): void,
}

/** ShowCompletionIcon functional component */
const ShowCompletionIcon = ( props: Props ) => {
	props = merge({
		value: true,
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<boolean>(props.value as boolean);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const showCompletionIconAttribute = useAppSelector(({scenario}) => scenario.values?.showCompletionIcon)

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = showCompletionIconAttribute ?? null;

		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
			setValue(extValue);
		}
	}, [showCompletionIconAttribute]);

	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toShowCompletionIconTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);

	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<PanelToolbar
        checked={enabled}
        heading="Show Completion Icon"
				checkboxPosition="right"
        description="Defines whether a small icon will appear next to the scenario indicating it's completion status."
        onCheckboxChange={state => setEnabled(state)}
				value={<span className={cn({'text-line-through': !enabled})}>{value ? 'Yes' : 'No'}</span>}
        disabled={!enabled}/>

			<Form.Check
				type="switch"
				className="pull-right"
				disabled={!enabled}
				id={`show_completion_icon-${nanoid(5)}`}
				label="Display icon?"
				checked={value}
				onChange={e => setValue(e.target.checked)}
			/>
		</div>
	);
};

// Properties validation
ShowCompletionIcon.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default ShowCompletionIcon;
