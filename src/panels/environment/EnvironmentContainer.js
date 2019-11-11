// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, Accordion, Button } from 'react-bootstrap';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';

// Types
import type { Node } from 'react';

// Components
import NoiseAmplitudes from './generators/NoiseAmplitudes';
import DistanceHeightOffset from './generators/DistanceHeightOffset';
import FordDistanceFactor from './generators/FordDistanceFactor';
import SunAngleFactor from './generators/SunAngleFactor';
import ResourceFactor from './generators/ResourceFactor';
import Deposits from './generators/Deposits';
import Trees from './generators/Trees';
import TreesEverywhere from './generators/TreesEverywhere';

/**
 * EnvironmentContainer functional component
 */
const EnvironmentContainer = (): Node => {
	const [noiseAmplitudes, setNoiseAmplitudes] = useState('');
	const [distanceHeightOffset, setDistanceHeightOffset] = useState('');
	const [fordDistanceFactor, setFordDistanceFactor] = useState('');
	const [sunAngleFactor, setSunAngleFactor] = useState('');
	const [resourceFactor, setResourceFactor] = useState('');
	const [deposits, setDeposits] = useState('');
	const [trees, setTrees] = useState('');
	const [treesEverywhere, setTreesEverywhere] = useState('');
	
	const toTemplate: () => string = (): string => {
		const xml: string = [
			'<?xml version="1.0" encoding="utf-8"?>',
			'<environment>',
			noiseAmplitudes,
			resourceFactor,
			distanceHeightOffset,
			fordDistanceFactor,
			sunAngleFactor,
			deposits,
			treesEverywhere,
			trees,
			'</environment>',
		].join('');
		
		return xmlFormatter(xml, {indentation: '  '});
	};
	
	return (
		<>
			<Accordion defaultActiveKey="environment_noise_amplitudes">
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_noise_amplitudes">
							Noise Amplitudes
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_noise_amplitudes">
						<Card.Body>
							<NoiseAmplitudes onChange={(v: string) => setNoiseAmplitudes(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain_0">
							Terrain Features
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_terrain_0">
						<Card.Body>
							<ResourceFactor onChange={(v: string) => setResourceFactor(v)}/>
							<DistanceHeightOffset onChange={(v: string) => setDistanceHeightOffset(v)}/>
							<FordDistanceFactor onChange={(v: string) => setFordDistanceFactor(v)}/>
							<SunAngleFactor onChange={(v: string) => setSunAngleFactor(v)}/>
							<Deposits onChange={(v: string) => setDeposits(v)}/>
							<TreesEverywhere onChange={(v: string) => setTreesEverywhere(v)}/>
							<Trees onChange={(v: string) => setTrees(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<hr/>
			<SyntaxHighlighter style={githubGist} language="xml">
				{toTemplate()}
			</SyntaxHighlighter>
			<div className="mt-2">
				<Button size="sm" variant="secondary"
					onClick={() => copyClipboard(toTemplate())}>
					Copy to Clipboard
				</Button>
			</div>
		</>
	);
};

export default EnvironmentContainer;
