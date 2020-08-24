// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Components
import DetailOverride from './DetailOverride';

/** ExportValues export values */
type ExportValues = {
	detailOverride: string,
};

/**
 * DetailPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: ExportValues ): void,
};

/** DetailPanel functional component */
function DetailPanel ( props: Props ) {
	const [detailOverride, setDetailOverride] = React.useState<string>('');
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function'
			&& props.onChange(toTemplateText(), {detailOverride});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailOverride]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return detailOverride;
	}, [detailOverride]);
	
	return (
		<>
			<DetailOverride onChange={v => setDetailOverride(v)}/>
		</>
	);
}

// Properties validation
DetailPanel.propTypes = {
	onChange: PropTypes.func,
};

// Default properties
DetailPanel.defaultProps = {
	onChange: () => {},
};

export default DetailPanel;

