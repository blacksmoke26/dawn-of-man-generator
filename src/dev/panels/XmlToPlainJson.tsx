/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import React from 'react';

// components
import XmlToJson from '~/components/panel/XmlToJson';

/** XmlToEnvironmentJson functional component */
const XmlToEnvironmentJson = () => (
  <XmlToJson
    type="plain"
    presets="all"
    placeholder="Write or paste XML here..."
  />
);

export default XmlToEnvironmentJson;
