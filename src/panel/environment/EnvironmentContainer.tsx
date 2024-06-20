/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import xmlFormatter from 'xml-formatter';

// elemental components
import Accordion from '~/components/ui/Accordion';

// icons
import {IconBlock} from '~/components/icons/app';

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

// redux
import {updateTemplate} from '~redux/slices/environment/reducers';
import {useAppDispatch, useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';

/** Generate xml code */
const toTemplateText = (templates: Json): string => {
  const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<environment>
			${Object.values(templates).join('')}
		</environment>`;

  return xmlFormatter(xml, {indentation: '  '});
};

/** EnvironmentContainer functional component */
function EnvironmentContainer() {
  const dispatch = useAppDispatch();

  const environmentTemplate = useAppSelector(({environment}) => environment.template);

  const [templates, setTemplates] = React.useState<Json>({
    noiseAmplitudes: '',
    resourceFactor: '',
    distanceHeightOffset: '',
    fordDistanceFactor: '',
    sunAngleFactor: '',
    backdropScale: '',
    deposits: '',
    trees: '',
    detail: '',
    prop: '',
    seasons: '',
  });

  React.useEffect(() => {
    const text = toTemplateText(templates);
    if (text !== environmentTemplate) {
      dispatch(updateTemplate(text));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, environmentTemplate]);

  /** Update templates raw texts */
  const updateTemplateText = (name: string, value: string): void => {
    setTemplates(current => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <>
      <Accordion
        eventKey="environment_noise_amplitudes"
        defaultActiveKey="environment_noise_amplitudes"
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Noise Amplitudes</span>}>
        <NoiseAmplitudes onChange={tpl => updateTemplateText('noiseAmplitudes', tpl)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Terrain Features</span>}
        eventKey="environment_terrain">
        <ResourceFactor onChange={v => updateTemplateText('resourceFactor', v)}/>
        <hr className="mt-1"/>
        <DistanceHeightOffset onChange={v => updateTemplateText('distanceHeightOffset', v)}/>
        <hr className="mt-1"/>
        <FordDistanceFactor onChange={v => updateTemplateText('fordDistanceFactor', v)}/>
        <hr className="mt-1"/>
        <SunAngleFactor onChange={v => updateTemplateText('sunAngleFactor', v)}/>
        <hr className="mt-1"/>
        <BackdropScale onChange={v => updateTemplateText('backdropScale', v)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Deposit (terrain)</span>}
        eventKey="deposit_terrain">
        <DepositPanel onChange={v => updateTemplateText('deposits', v)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Detail (terrain)</span>}
        eventKey="deposit_terrain">
        <DetailPanel onChange={v => updateTemplateText('detail', v)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Prop (terrain)</span>}
        eventKey="deposit_terrain">
        <PropPanel onChange={v => updateTemplateText('prop', v)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Tree (terrain)</span>}
        eventKey="deposit_terrain">
        <TreesPanel onChange={v => updateTemplateText('trees', v)}/>
      </Accordion>

      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Season (atmosphere)</span>}
        eventKey="deposit_terrain">
        <SeasonsPanel onChange={v => updateTemplateText('seasons', v)}/>
      </Accordion>
    </>
  );
}

export default EnvironmentContainer;
