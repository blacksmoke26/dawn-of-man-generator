// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, Accordion, Button } from 'react-bootstrap';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';

// Types
import type { Node } from 'react';

// Components
import NoiseAmplitudes from './generators/amplitudes/NoiseAmplitudes';
import DistanceHeightOffset from './generators/terrain/DistanceHeightOffset';
import FordDistanceFactor from './generators/terrain/FordDistanceFactor';
import SunAngleFactor from './generators/terrain/SunAngleFactor';
import ResourceFactor from './generators/terrain/ResourceFactor';
import Deposits from './generators/terrain/Deposits';
import TreesPanel from './generators/trees/TreesPanel';
import Seasons from './generators/seasons/Seasons';

/**
 * EnvironmentContainer `props` type
 * @type {Object}
 */
type Props = {
}

/**
 * EnvironmentContainer `state` type
 * @type {Object}
 */
type State = {
	noiseAmplitudes: string,
	distanceHeightOffset: string,
	fordDistanceFactor: string,
	sunAngleFactor: string,
	resourceFactor: string,
	deposits: string,
	trees: string,
	seasons: string,
};

/**
 * EnvironmentContainer component
 */
class EnvironmentContainer extends React.Component<Props, State> {
	state: State = {
		noiseAmplitudes: '',
		distanceHeightOffset: '',
		fordDistanceFactor: '',
		sunAngleFactor: '',
		resourceFactor: '',
		deposits: '',
		trees: '',
		seasons: '',
	};
	
	toTemplate (): string {
		const {
			noiseAmplitudes, distanceHeightOffset,
			fordDistanceFactor, sunAngleFactor,
			resourceFactor, deposits, trees,
			seasons,
		} = this.state;
		
		const xml: string = [
			'<?xml version="1.0" encoding="utf-8"?>',
			'<environment>',
			noiseAmplitudes,
			resourceFactor,
			distanceHeightOffset,
			fordDistanceFactor,
			sunAngleFactor,
			deposits,
			trees,
			seasons,
			'</environment>',
		].join('');
		
		return xmlFormatter(xml, {indentation: '  '});
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		return (
			<>
				<Accordion defaultActiveKey="environment_noise_amplitudes">
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="environment_noise_amplitudes">
								Noise Amplitudes
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="environment_noise_amplitudes">
							<Card.Body>
								<NoiseAmplitudes onChange={( v: string ) => this.setState({noiseAmplitudes: v})}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain">
								Terrain Features
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="environment_terrain">
							<Card.Body>
								<ResourceFactor onChange={( v: string ) => this.setState({resourceFactor: v})}/>
								<DistanceHeightOffset onChange={( v: string ) => this.setState({distanceHeightOffset: v})}/>
								<FordDistanceFactor onChange={( v: string ) => this.setState({fordDistanceFactor: v})}/>
								<SunAngleFactor onChange={( v: string ) => this.setState({sunAngleFactor: v})}/>
								<Deposits onChange={( v: string ) => this.setState({deposits: v})}/>
								
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain_trees">
								Trees (Terrain)
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="environment_terrain_trees">
							<Card.Body>
								<TreesPanel onChange={( v: string ) => this.setState({trees: v})}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="environment_seasons">
								Seasons
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="environment_seasons">
							<Card.Body>
								<Seasons onChange={( v: string ) => this.setState({seasons: v})}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
				<hr/>
				<SyntaxHighlighter style={githubGist} language="xml">
					{this.toTemplate()}
				</SyntaxHighlighter>
				<div className="mt-2">
					<Button size="sm" variant="secondary"
						onClick={() => copyClipboard(this.toTemplate())}>
						Copy to Clipboard
					</Button>
				</div>
			</>
		);
	}
}

export default EnvironmentContainer;
