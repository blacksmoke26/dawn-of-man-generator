// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Components
import Deposits from './Deposits';
import DepositOverride from './DepositOverride';

type ExportValues = {
	deposits: string,
	depositOverride: string,
};

/**
 * DepositPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values: ExportValues ): void,
};

/** DepositPanel functional component */
function DepositPanel ( props: Props ) {
	const [deposits, setDeposits] = React.useState<string>('');
	const [depositOverride, setDepositOverride] = React.useState<string>('');
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function'
			&& props.onChange(toTemplateText(), {deposits, depositOverride});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deposits, depositOverride]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return `${deposits}${depositOverride}`;
	}, [deposits, depositOverride]);
	
	return (
		<>
			<Deposits onChange={v => setDeposits(v)}/>
			<DepositOverride onChange={v => setDepositOverride(v)}/>
		</>
	);
}

// Properties validation
DepositPanel.propTypes = {
	onChange: PropTypes.func,
};

// Default properties
DepositPanel.defaultProps = {
	onChange: () => {},
};

export default DepositPanel;

