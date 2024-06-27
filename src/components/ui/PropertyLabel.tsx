/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

import React from 'react';
import cn from 'classname';
import {Col, ColProps} from 'react-bootstrap';

export interface Props {
  caption: React.ReactNode;
  colProps?: ColProps;
  tooltip?: string;
  disabled?: boolean;
}

/** PropertyLabel functional component */
const PropertyLabel = (props: Props) => {
  return (
    <Col sm="2" {...(props?.colProps || {})}>
      <div className={cn('position-relative', {'text-muted': props?.disabled})} style={{top: 7}}>
        <span
          style={{textDecoration: cn({'underline dotted': !!props?.tooltip})}}
          title={props?.tooltip || ''}>
            {props?.caption}
        </span>
      </div>
    </Col>
  );
};

export default React.memo(PropertyLabel);
