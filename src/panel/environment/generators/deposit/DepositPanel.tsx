/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';

// Components
import Deposits from './Deposits';
import DepositOverride from './DepositOverride';

/**
 * DepositPanel `props` type
 */
export type Props = {
  onChange(template: string): void,
};

/** DepositPanel functional component */
const DepositPanel = (props: Props) => {
  const [templates, setTemplates] = React.useState<Record<string, string>>({
    deposits: '',
    depositOverride: '',
  });

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(Object.values(templates).join(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  const setTemplate = (name: string, template: string) => {
    setTemplates(current => ({...current, [name]: template}));
  };

  return (
    <>
      <Deposits onChange={templates => setTemplate('deposits', templates)}/>
      <hr className="mt-1"/>
      <DepositOverride onTemplate={templates => setTemplate('depositOverride', templates)}/>
    </>
  );
};

// Properties validation
DepositPanel.propTypes = {
  onChange: PropTypes.func,
};

export default DepositPanel;

