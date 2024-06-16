import React from 'react';
import {Container} from 'react-bootstrap';

// styles
import '~/styles/uikit/bootstrap.min.css';
import '~/styles/uikit/bootstrap_limitless.min.css';
import '~/styles/uikit/layout.min.css';
import '~/styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import '~/styles/custom.css';
import '~/styles/global.css';

// components
import ObjectOverrideComponent from '../components/environment/ObjectOverride';

// types
import type {Props} from '~/components/environment/utils/object-override';

/**
 * Primary UI component for user interaction
 */
export const ObjectOverride = ({
  type = 'tree',
  ...props
}: Props) => {
  return (
    <Container style={{width: 900}}>
      <ObjectOverrideComponent type={type} {...props}/>
    </Container>
  );
};
