// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, Accordion, Button } from 'react-bootstrap';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';

// Types
import type { Node } from 'react';

// Components
import NoiseAmplitudes from './generators/amplitudes/NoiseAmplitudes';
import BackdropScale from './generators/terrain/BackdropScale';
import DistanceHeightOffset from './generators/terrain/DistanceHeightOffset';
import FordDistanceFactor from './generators/terrain/FordDistanceFactor';
import SunAngleFactor from './generators/terrain/SunAngleFactor';
import ResourceFactor from './generators/terrain/ResourceFactor';
import TreesPanel from './generators/trees/TreesPanel';
import DepositPanel from './generators/deposit/DepositPanel';
import DetailPanel from './generators/detail/DetailPanel';
import PropPanel from './generators/prop/PropPanel';
import SeasonsPanel from './generators/seasons/SeasonsPanel';

/** EnvironmentContainer functional component */
function EnvironmentContainer (): Node {
	const [noiseAmplitudes, setNoiseAmplitudes] = React.useState<string>('');
	const [distanceHeightOffset, setDistanceHeightOffset] = React.useState<string>('');
	const [fordDistanceFactor, setFordDistanceFactor] = React.useState<string>('');
	const [backdropScale, setBackdropScale] = React.useState<string>('');
	const [sunAngleFactor, setSunAngleFactor] = React.useState<string>('');
	const [resourceFactor, setResourceFactor] = React.useState<string>('');
	const [deposits, setDeposits] = React.useState<string>('');
	const [trees, setTrees] = React.useState<string>('');
	const [seasons, setSeasons] = React.useState<string>('');
	const [detail, setDetail] = React.useState<string>('');
	const [prop, setProp] = React.useState<string>('');
	
	/** Generate xml code */
	const toTemplateText = (): string => {
		const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<environment>
			${noiseAmplitudes} ${resourceFactor}
			${distanceHeightOffset} ${fordDistanceFactor}
			${sunAngleFactor} ${backdropScale} ${deposits}
			${detail} ${prop} ${trees} ${seasons}
		</environment>`;
		
		return xmlFormatter(xml, {indentation: '  '});
	}
	
	return (
		<>
			<Accordion defaultActiveKey="environment_noise_amplitudes">
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2 position-relative">
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_noise_amplitudes">
							Noise Amplitudes
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_noise_amplitudes">
						<Card.Body>
							<NoiseAmplitudes onChange={v => setNoiseAmplitudes(v)}/>
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
							<ResourceFactor onChange={v => setResourceFactor(v)}/>
							<DistanceHeightOffset onChange={v => setDistanceHeightOffset(v)}/>
							<FordDistanceFactor onChange={v => setFordDistanceFactor(v)}/>
							<SunAngleFactor onChange={v => setSunAngleFactor(v)}/>
							<BackdropScale onChange={v => setBackdropScale(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain_deposit">
							Deposit (Terrain)
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_terrain_deposit">
						<Card.Body>
							<DepositPanel onChange={v => setDeposits(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain_detail">
							Detail (Terrain)
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_terrain_detail">
						<Card.Body>
							<DetailPanel onChange={v => setDetail(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle as={Button} variant="link" eventKey="environment_terrain_props">
							Props (Terrain)
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="environment_terrain_props">
						<Card.Body>
							<PropPanel onChange={v => setProp(v)}/>
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
							<TreesPanel onChange={v => setTrees(v)}/>
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
							<SeasonsPanel onChange={v => setSeasons(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<hr/>
			<div className="syntax-highlighter">
				<SyntaxHighlighter style={a11yDark} language="xml">
					{toTemplateText()}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2">
				<Button size="sm" variant="secondary"
					onClick={() => copyClipboard(toTemplateText())}>
					Copy to Clipboard
				</Button>
			</div>
		</>
	);
}

export default EnvironmentContainer;
