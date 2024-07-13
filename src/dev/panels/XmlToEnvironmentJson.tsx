/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import React from 'react';

// parsers
import {jsonToRedux} from '~/data/environments/parser';

// components
import XmlToJson from '~/components/panel/XmlToJson';

/** XmlToEnvironmentJson functional component */
const XmlToEnvironmentJson = () => (
  <XmlToJson
    type="environment"
    presets="environment"
    placeholder="Write or paste environment XML here..."
    onTransformJson={json => jsonToRedux(json)}
  />
);

export default XmlToEnvironmentJson;
