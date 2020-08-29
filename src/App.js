// @flow

import React from 'react';
import { Container, Card, Accordion, Button } from 'react-bootstrap';

// Types
import { Node } from 'react';

// Components
import EnvironmentContainer from './panels/environment/EnvironmentContainer';
import LocationContainer from './panels/location/LocationContainer';
import XmlToJsonConvertorContainer from './dev/panels/XmlToJsonConvertorContainer';

const ENV_PROD: boolean = process.env.NODE_ENV === 'production';

/** App functional component */
function App (): Node {
	return (
		<Container className="mt-4 mb-4">
			<h2 className="font-weight-light mb-4 text-center">
				<a href="https://store.steampowered.com/app/858810"
				target="_blank" rel="noopener noreferrer">
					Dawn of Man
				</a>
				{' - '} <a href="https://steamcommunity.com/app/858810/discussions/1/"
				rel="noopener noreferrer" target="_blank">
				Mod Data Generator
			</a>
			</h2>
			
			<Accordion defaultActiveKey="accordion_0">
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="accordion_0">
							Environment
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="accordion_0">
						<Card.Body>
							<EnvironmentContainer/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="accordion_1">
							Locations
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="accordion_1">
						<Card.Body>
							<LocationContainer/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				{!ENV_PROD && (
					<Card>
						<Card.Header>
							<Accordion.Toggle as={Button} variant="link" eventKey="accordion_2">
								XML to JSON
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="accordion_2">
							<Card.Body>
								<XmlToJsonConvertorContainer/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				)}
			</Accordion>
			<footer className="mt-3 mb-3 text-size-xs text-center">
				Copyright &copy; 2019-{(new Date()).getFullYear()} {' '}
				<a href="https://github.com/blacksmoke26"
					rel="noopener noreferrer" target="_blank">Junaid Atari</a>
				<br/>
				<a href="https://www.nexusmods.com/dawnofman/mods/11"
					rel="noopener noreferrer" target="_blank">View on Nexus</a>
				{' - '}
				<a href="https://github.com/blacksmoke26/dawn-of-man-generator"
					rel="noopener noreferrer" target="_blank">Source on GitHub</a>
			</footer>
		</Container>
	);
}

export default App;
