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
import DetailOverride from './DetailOverride';

/**
 * DetailPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * DetailPanel `state` type
 * @type {Object}
 */
type State = {
	detailOverride: string,
};

/**
 * DetailPanel functional component
 */
class DetailPanel extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		detailOverride: '',
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
		const {detailOverride} = this.state;
		return [detailOverride].join('');
	}
	
	getValues (): {[string]: string} {
		const {detailOverride} = this.state;
		return {detailOverride};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<DetailOverride onChange={( v: string ) => this.setState({detailOverride: v})}/>
			</>
		);
	}
}

// Default properties
DetailPanel.defaultProps = {
	onChange: () => {},
};


// Properties validation
DetailPanel.propTypes = {
	onChange: PropTypes.func,
};

export default DetailPanel;

