/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import React from 'react';

// parsers
import {jsonToRedux} from '~/data/scenario/parser';

// components
import XmlToJson from '~/components/panel/XmlToJson';

/** XmlToEnvironmentJson functional component */
const XmlToEnvironmentJson = () => {
  return <XmlToJson
    placeholder="Write or paste scenario XML here..."
    onTransformJson={json => jsonToRedux(json)}
  />;
};

export default XmlToEnvironmentJson;
