import React from 'react';

// styles
import '~/styles/uikit/bootstrap.min.css';
import '~/styles/uikit/bootstrap_limitless.min.css';
import '~/styles/uikit/layout.min.css';
import '~/styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import '~/styles/custom.css';
import '~/styles/global.css';

import ObjectOverridePrototypeComp, {Props} from '../components/environment/ObjectOverridePrototype';
import {Container} from 'react-bootstrap';

/**
 * Primary UI component for user interaction
 */
export const ObjectOverridePrototype = ({
  type = 'tree',
  name = 'Flint',
  ...props
}: Props) => {
  return (
    <Container style={{width: 900}}>
      <ObjectOverridePrototypeComp name={name} type={type} {...props}/>
    </Container>
  );
};
