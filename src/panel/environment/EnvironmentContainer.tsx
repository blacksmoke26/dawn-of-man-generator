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
import {updateByPath} from '~redux/slices/config/reducers';
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
  const panelNoiseAmplitudes = useAppSelector(({config}) => config?.session.environment.panelsShown?.noiseAmplitudes ?? true);
  const panelTerrain = useAppSelector(({config}) => config?.session.environment.panelsShown?.terrain ?? false);
  const panelDeposit = useAppSelector(({config}) => config?.session.environment.panelsShown?.deposit ?? false);
  const panelDetail = useAppSelector(({config}) => config?.session.environment.panelsShown?.detail ?? false);
  const panelProp = useAppSelector(({config}) => config?.session.environment.panelsShown?.prop ?? false);
  const panelTrees = useAppSelector(({config}) => config?.session.environment.panelsShown?.trees ?? false);
  const panelSeasons = useAppSelector(({config}) => config?.session.environment.panelsShown?.seasons ?? false);

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
      setTimeout(() => dispatch(updateByPath({path: 'session.environment.template', value: text})), 150);
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
        activeKey={panelNoiseAmplitudes ? 'environment_noise_amplitudes' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.noiseAmplitudes', value: !panelNoiseAmplitudes}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Noise Amplitudes</span>}>
        <NoiseAmplitudes onChange={tpl => updateTemplateText('noiseAmplitudes', tpl)}/>
      </Accordion>

      <Accordion
        activeKey={panelTerrain ? 'environment_terrain' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.terrain', value: !panelTerrain}))}
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
        activeKey={panelDeposit ? 'environment_deposit_terrain' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.deposit', value: !panelDeposit}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Deposit (terrain)</span>}
        eventKey="environment_deposit_terrain">
        <DepositPanel onChange={v => updateTemplateText('deposits', v)}/>
      </Accordion>

      <Accordion
        activeKey={panelDetail ? 'environment_detail_panel' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.detail', value: !panelDetail}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Detail (terrain)</span>}
        eventKey="environment_detail_panel">
        <DetailPanel onChange={v => updateTemplateText('detail', v)}/>
      </Accordion>

      <Accordion
        activeKey={panelProp ? 'environment_prop_panel' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.prop', value: !panelProp}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Prop (terrain)</span>}
        eventKey="environment_prop_panel">
        <PropPanel onChange={v => updateTemplateText('prop', v)}/>
      </Accordion>

      <Accordion
        activeKey={panelTrees ? 'environment_trees_panel' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.trees', value: !panelTrees}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Tree (terrain)</span>}
        eventKey="environment_trees_panel">
        <TreesPanel onChange={v => updateTemplateText('trees', v)}/>
      </Accordion>

      <Accordion
        activeKey={panelSeasons ? 'environment_seasons_panel' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.environment.panelsShown.seasons', value: !panelSeasons}))}
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> Season (atmosphere)</span>}
        eventKey="environment_seasons_panel">
        <SeasonsPanel onChange={v => updateTemplateText('seasons', v)}/>
      </Accordion>
    </>
  );
}

export default EnvironmentContainer;
