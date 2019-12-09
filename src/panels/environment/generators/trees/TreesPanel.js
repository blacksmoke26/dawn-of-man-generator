// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-12-09
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Types
import type { Node } from 'react';

// Components
import Trees from './Trees';
import TreesEverywhere from './TreesEverywhere';
import TreesOverride from './TreesOverride';

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
	trees: string,
	treesEverywhere: string,
	treesOverride: string,
};

/**
 * TreesPanel functional component
 */
class TreesPanel extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		treesEverywhere: '',
		trees: '',
		treesOverride: '',
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
			trees, treesEverywhere,
			treesOverride,
		} = this.state;
		
		return [
			trees, treesEverywhere,
			treesOverride,
		].join('');
	}
	
	getValues (): {[string]: number} {
		const { trees, treesEverywhere, treesOverride } = this.state;
		return {trees, treesEverywhere, treesOverride};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<Trees onChange={( v: string ) => this.setState({trees: v})} />
				<TreesEverywhere onChange={( v: string ) => this.setState({treesEverywhere: v})} />
				<TreesOverride onChange={( v: string ) => this.setState({treesOverride: v})} />
			</>
		);
	}
}

// Default properties
TreesPanel.defaultProps = {
	onChange: () => {},
};


// Properties validation
TreesPanel.propTypes = {
	onChange: PropTypes.func,
};

export default TreesPanel;
 
