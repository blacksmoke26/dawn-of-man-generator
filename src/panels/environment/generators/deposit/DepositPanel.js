/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Types
import type { Node } from 'react';

// Components
import Deposits from './Deposits';
import DepositOverride from './DepositOverride';

/**
 * TreesPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * TreesPanel `state` type
 * @type {Object}
 */
type State = {
	deposits: string,
	depositOverride: string,
};

/**
 * DepositPanel functional component
 */
class DepositPanel extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		deposits: '',
		depositOverride: '',
	};
	
	/**
	 * @inheritDoc
	 */
	componentDidMount (): void {
		const {onChange} = this.props;
		setTimeout(() => {
			typeof onChange === 'function'
			&& onChange(this.toTemplateText(), this.getValues());
		}, 300);
	}
	
	/**
	 * @inheritDoc
	 */
	componentDidUpdate ( prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS ): void {
		if ( JSON.stringify(this.state) !== JSON.stringify(prevState) ) {
			const {onChange} = this.props;
			
			setTimeout(() => {
				typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValues());
			}, 300);
		}
	}
	
	toTemplateText (): string {
		const {
			deposits, depositOverride,
		} = this.state;
		
		return [deposits, depositOverride].join('');
	}
	
	getValues (): {[string]: string} {
		const {deposits, depositOverride} = this.state;
		return {deposits, depositOverride};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<Deposits onChange={( v: string ) => this.setState({deposits: v})}/>
				<DepositOverride onChange={( v: string ) => this.setState({depositOverride: v})}/>
			</>
		);
	}
}

// Default properties
DepositPanel.defaultProps = {
	onChange: () => {},
};


// Properties validation
DepositPanel.propTypes = {
	onChange: PropTypes.func,
};

export default DepositPanel;

