/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// components
import DetailOverride from './DetailOverride';

/**
 * DetailPanel `props` type
 * @type {Object}
 */
type Props = {
  onChange?(template: string): void,
};

/** DetailPanel functional component */
const DetailPanel = (props: Props) => {
  const [detailOverride, setDetailOverride] = React.useState<string>('');

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(detailOverride);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailOverride]);

  return (
    <DetailOverride onTemplate={template => setDetailOverride(template)}/>
  );
};

// Properties validation
DetailPanel.propTypes = {
  onChange: PropTypes.func,
};

export default DetailPanel;

