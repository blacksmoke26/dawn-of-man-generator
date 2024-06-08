/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';

// components
import GlobalTreeDensity from './GlobalTreeDensity';
import TreesEverywhere from './TreesEverywhere';
import Trees from './Trees';
import TreesOverride from './TreesOverride';

export interface ExportValues {
  globalTreeDensity: string,
  treesEverywhere: string,
  trees: string,
  treesOverride: string
}

/**
 * TreesPanel `props` type
 * @type {Object}
 */
export interface Props {
  onChange?(template: string, values: ExportValues): void,
}

/** TreesPanel functional component */
const TreesPanel = (props: Props) => {
  props = merge({
    onChange: () => {
    },
  }, props);
  const [globalTreeDensity, setGlobalTreeDensity] = React.useState<string>('');
  const [treesEverywhere, setTreesEverywhere] = React.useState<string>('');
  const [trees, setTrees] = React.useState<string>('');
  const [treesOverride, setTreesOverride] = React.useState<string>('');

  const toTemplateText = (): string => {
    return [
      globalTreeDensity, treesEverywhere, trees, treesOverride,
    ].join('');
  };

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
      <hr/>
      <TreesEverywhere onChange={v => setTreesEverywhere(v)}/>
      <hr/>
      <Trees onChange={v => setTrees(v)}/>
      <hr/>
      <TreesOverride onChange={v => setTreesOverride(v)}/>
    </>
  );
};

// Properties validation
TreesPanel.propTypes = {
  onChange: PropTypes.func,
};

export default TreesPanel;
 
