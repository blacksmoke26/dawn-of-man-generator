// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Components
import PropOverride from './PropOverride';

/** ExportValues export values */
type ExportValues = {
	propOverride: string,
};

/**
 * PropPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: ExportValues ): void,
};

/** PropPanel functional component */
function PropPanel ( props: Props ) {
	const [propOverride, setPropOverride] = React.useState<string>('');
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function'
		&& props.onChange(toTemplateText(), {propOverride});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [propOverride]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return propOverride;
	}, [propOverride]);
	
	return (
		<>
			<PropOverride onChange={v => setPropOverride(v)}/>
		</>
	);
}

// Properties validation
PropPanel.propTypes = {
	onChange: PropTypes.func,
};

// Default properties
PropPanel.defaultProps = {
	onChange: () => {},
};

export default PropPanel;

