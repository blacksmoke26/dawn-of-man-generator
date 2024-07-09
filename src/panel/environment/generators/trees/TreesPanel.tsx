/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// components
import GlobalTreeDensity from './GlobalTreeDensity';
import TreesEverywhere from './TreesEverywhere';
import Trees from './Trees';
import TreesOverride from './TreesOverride';

/**
 * TreesPanel `props` type
 */
export interface Props {
  onChange?(template: string): void,
}

/** TreesPanel functional component */
const TreesPanel = (props: Props) => {
  const [templates, setTemplates] = React.useState<Record<string, string>>({
    globalTreeDensity: '',
    treesEverywhere: '',
    trees: '',
    treesOverride: '',
  });

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(Object.values(templates).join('').trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  const setTemplate = (name: string, template: string) => {
    setTemplates(current => ({...current, [name]: template}));
  };

  return (
    <>
      <GlobalTreeDensity
        onChange={template => setTemplate('globalTreeDensity', template)}/>
      <hr/>
      <TreesEverywhere
        onChange={template => setTemplate('treesEverywhere', template)}/>
      <hr/>
      <Trees
        onChange={template => setTemplate('trees', template)}/>
      <hr/>
      <TreesOverride
        onTemplate={template => setTemplate('treesOverride', template)}/>
    </>
  );
};

// Properties validation
TreesPanel.propTypes = {
  onChange: PropTypes.func,
};

export default TreesPanel;
 
