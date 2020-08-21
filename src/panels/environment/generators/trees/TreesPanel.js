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
import GlobalTreeDensity from './GlobalTreeDensity';

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
		globalTreeDensity: '',
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
			treesOverride, trees,
			treesEverywhere, globalTreeDensity,
		} = this.state;
		
		return [
			treesOverride, trees,
			globalTreeDensity, treesEverywhere,
		].join('');
	}
	
	getValues (): {[string]: number} {
		const {trees, treesEverywhere, treesOverride, globalTreeDensity} = this.state;
		return {trees, treesEverywhere, treesOverride, globalTreeDensity};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<Trees onChange={( v: string ) => this.setState({trees: v})} />
				<GlobalTreeDensity onChange={( v: string ) => this.setState({globalTreeDensity: v})} />
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
 
