/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// components
import PropOverride from './PropOverride';

/**
 * PropPanel `props` type
 */
type Props = {
  onChange?(template: string): void,
};

/** PropPanel functional component */
const PropPanel = (props: Props) => {
  const [propOverride, setPropOverride] = React.useState<string>('');

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(propOverride);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propOverride]);

  return (
    <PropOverride onTemplate={template => setPropOverride(template)}/>
  );
};

// Properties validation
PropPanel.propTypes = {
  onChange: PropTypes.func,
};

export default PropPanel;

