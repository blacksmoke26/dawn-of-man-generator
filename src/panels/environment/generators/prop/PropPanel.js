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
import PropOverride from './PropOverride';

/**
 * PropPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * PropPanel `state` type
 * @type {Object}
 */
type State = {
	propOverride: string,
};

/**
 * PropPanel functional component
 */
class PropPanel extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		propOverride: '',
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
		const {propOverride} = this.state;
		return [propOverride].join('');
	}
	
	getValues (): {[string]: string} {
		const {propOverride} = this.state;
		return {propOverride};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<PropOverride onChange={( v: string ) => this.setState({propOverride: v})}/>
			</>
		);
	}
}

// Default properties
PropPanel.defaultProps = {
	onChange: () => {},
};


// Properties validation
PropPanel.propTypes = {
	onChange: PropTypes.func,
};

export default PropPanel;

