/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';

// components
import PropOverride from './PropOverride';

type ExportValues = {
	propOverride: string,
};

/**
 * DepositPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values: ExportValues ): void,
};

/** DepositPanel functional component */
const PropPanel = ( props: Props ) => {
	props = merge({
		onChange: () => {},
	}, props);

	const [propOverride, setPropOverride] = React.useState<string>('');

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function'
			&& props.onChange(toTemplateText(), {propOverride});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [propOverride]);

	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return `${propOverride}`;
	}, [propOverride]);

	return (
		<>
			<PropOverride onChange={v => setPropOverride(v)}/>
		</>
	);
};

// Properties validation
PropPanel.propTypes = {
	onChange: PropTypes.func,
};

export default PropPanel;

