/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import { ButtonGroup } from 'react-bootstrap';

// components
import XmlTextLoader from './loaders/XmlTextLoader';

/** XmlImporter functional component */
const XmlImporter = () => {
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
 
