/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';

// components
import DetailOverride from './DetailOverride';

type ExportValues = {
	detailOverride: string,
};

/**
 * DepositPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values: ExportValues ): void,
};

/** DepositPanel functional component */
const DetailPanel = ( props: Props ) => {
	props = merge({
		onChange: () => {},
	}, props);

	const [detailOverride, setDetailOverride] = React.useState<string>('');

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function'
			&& props.onChange(toTemplateText(), {detailOverride});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailOverride]);

	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return `${detailOverride}`;
	}, [detailOverride]);

	return (
		<>
			<DetailOverride onChange={v => setDetailOverride(v)}/>
		</>
	);
};

// Properties validation
DetailPanel.propTypes = {
	onChange: PropTypes.func,
};

export default DetailPanel;

