/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import FileSaver from 'file-saver';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';
import {Button, ButtonGroup} from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// elemental components
import Accordion from '~/components/ui/Accordion';

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
import PropPanel from './generators/props/PropPanel';
import SeasonsPanel from './generators/seasons/SeasonsPanel';

/** EnvironmentContainer functional component */
function EnvironmentContainer() {
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
  };

  return (
    <>
      <Accordion header="Noise Amplitudes" eventKey="environment_noise_amplitudes">
        <NoiseAmplitudes onChange={v => setNoiseAmplitudes(v)}/>
      </Accordion>

      <Accordion header="Terrain Features" eventKey="environment_terrain">
        <ResourceFactor onChange={v => setResourceFactor(v)}/>
        <DistanceHeightOffset onChange={v => setDistanceHeightOffset(v)}/>
        <FordDistanceFactor onChange={v => setFordDistanceFactor(v)}/>
        <SunAngleFactor onChange={v => setSunAngleFactor(v)}/>
        <BackdropScale onChange={v => setBackdropScale(v)}/>
      </Accordion>

      <Accordion header="Deposit (terrain)" eventKey="deposit_terrain">
        <DepositPanel onChange={v => setDeposits(v)}/>
      </Accordion>

      <Accordion header="Detail (terrain)" eventKey="deposit_terrain">
        <DetailPanel onChange={v => setDetail(v)}/>
      </Accordion>

      <Accordion header="Prop (terrain)" eventKey="deposit_terrain">
        <PropPanel onChange={v => setProp(v)}/>
      </Accordion>

      <Accordion header="Tree (terrain)" eventKey="deposit_terrain">
        <TreesPanel onChange={v => setTrees(v)}/>
      </Accordion>

      <Accordion header="Season (atmosphere)" eventKey="deposit_terrain">
        <SeasonsPanel onChange={v => setSeasons(v)}/>
      </Accordion>

      <hr/>
      <div className="syntax-highlighter">
        <SyntaxHighlighter style={anOldHope} language="xml">
          {toTemplateText()}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2">
        <ButtonGroup size="sm">
          <Button variant="secondary"
                  onClick={() => copyClipboard(toTemplateText())}>
            Copy to Clipboard
          </Button>
          <Button variant="secondary"
            onClick={() => {
              const blob = new Blob([toTemplateText()], {type: 'text/xml;charset=utf-8'});
              FileSaver.saveAs(blob, 'my-environment.xml');
            }}>
            Download File
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default EnvironmentContainer;
