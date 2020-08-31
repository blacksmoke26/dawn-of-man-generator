// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-31
 */

import React from 'react';
import { ButtonGroup } from 'react-bootstrap';

// Types
import type { Node } from 'react';

// Components
import XmlTextLoader from './loaders/XmlTextLoader';

/** XmlImporter functional component */
const XmlImporter = (): Node => {
	return (
		<>
			<div className="mt-2 text-right">
				<span className="text-muted mr-2 d-inline-block">Import environment xml by:</span>
				<ButtonGroup size="sm">
					<XmlTextLoader/>
					{/*<Button variant="light" hidden={true}>Fetch from URL</Button>*/}
					{/*<Button variant="light" hidden={true}>Upload file</Button>*/}
				</ButtonGroup>
			</div>
		</>
	);
};

export default XmlImporter;
 
