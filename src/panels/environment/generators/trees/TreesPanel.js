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

type ExportValues = {
	globalTreeDensity: string,
	treesEverywhere: string,
	trees: string,
	treesOverride: string
};

/**
 * TreesPanel `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values: ExportValues ): void,
};

/** TreesPanel functional component */
function TreesPanel ( props: Props ): Node {
	const [globalTreeDensity, setGlobalTreeDensity] = React.useState<string>('');
	const [treesEverywhere, setTreesEverywhere] = React.useState<string>('');
	const [trees, setTrees] = React.useState<string>('');
	const [treesOverride, setTreesOverride] = React.useState<string>('');
	
	const toTemplateText = (): string => {
		return [
			globalTreeDensity, treesEverywhere, trees, treesOverride,
		].join('');
	}
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), {
			globalTreeDensity, treesEverywhere, trees, treesOverride,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalTreeDensity, treesEverywhere, trees, treesOverride]);
	
	return (
		<>
			<GlobalTreeDensity onChange={v => setGlobalTreeDensity(v)}/>
			<TreesEverywhere onChange={v => setTreesEverywhere(v)}/>
			<Trees onChange={v => setTrees(v)}/>
			<TreesOverride onChange={v => setTreesOverride(v)}/>
		</>
	);
}

// Properties validation
TreesPanel.propTypes = {
	onChange: PropTypes.func,
};

// Default properties
TreesPanel.defaultProps = {
	onChange: () => {},
};

export default TreesPanel;
 
