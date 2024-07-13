/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Col, Container, Row, Tabs, Tab} from 'react-bootstrap';
import {PanelGroup, Panel, PanelResizeHandle} from 'react-resizable-panels';

// components
import Header from '~/elements/Header';

// environment components
import EnvironmentPresets from '~/panel/environment/Presets';
import ScenarioPresets from '~/panel/scenario/Presets';
import TemplateXMLViewer from '~/panel/environment/TemplateXMLViewer';
import EnvironmentContainer from '~/panel/environment/EnvironmentContainer';

// scenario components
import ScenarioContainer from '~/panel/scenario/ScenarioContainer';
import ScenarioTemplateXMLViewer from '~/panel/scenario/TemplateXMLViewer';

// dev panels
import XmlEditor from '~/dev/panels/XmlEditor';
import XmlToPlainJson from '~/dev/panels/XmlToPlainJson';
import XmlToScenarioJson from '~/dev/panels/XmlToScenarioJson';
import XmlToEnvironmentJson from '~/dev/panels/XmlToEnvironmentJson';

// icons
import {IconCodeXml, IconEnvironment, IconScenario} from '~/components/icons/app';

// parsers
import {xmlToReduxJson as scenarioXmlToJson} from '~/data/scenario/loader';
import {xmlToReduxJson as environmentXmlToJson} from '~/data/environments/loader';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {updateInit, updateByPath} from '~redux/slices/config/reducers';
import {updateName as scenarioSetName} from '~redux/slices/scenario/reducers';
import {updateName as environmentSetName} from '~redux/slices/environment/reducers';
import {
  overwriteValues as environmentOverwriteValues,
  resetValues as envResetValues,
} from '~redux/slices/environment/reducers';
import {overwriteValues as scenarioOverwriteValues, resetValues} from '~redux/slices/scenario/reducers';

const App = () => {
  const dispatch = useAppDispatch();

  const panelsAttribute = useAppSelector(({config}) => config?.panels);
  const activeTab = useAppSelector(({config}) => config?.session.activeTab);
  const scenarioTemplate = useAppSelector(({config}) => config?.session?.scenario?.template ?? '');
  const environmentTemplate = useAppSelector(({config}) => config?.session?.environment?.template ?? '');
  const environmentFilename = useAppSelector(({config}) => config?.session?.environment?.filename ?? 'custom');
  const scenarioFilename = useAppSelector(({config}) => config?.session?.scenario?.filename ?? 'scenario');

  const environmentLayout = useAppSelector(({config}) => config.session?.environment?.resizeLayout ?? [60, 40]);
  const scenarioLayout = useAppSelector(({config}) => config.session?.scenario?.resizeLayout ?? [60, 40]);

  React.useEffect(() => initializeApp({
    dispatch, environmentTemplate, scenarioTemplate,
    environmentFilename, scenarioFilename,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  return (
    <div className="mt-3">
      <Header/>
      <Container fluid={true}>
        <Tabs
          activeKey={activeTab}
          className="nav-tabs-bottom"
          onSelect={(eventKey: string | null) => {

            if (eventKey === 'scenario')
              dispatch(updateByPath({path: 'session.scenario.panelsShown.general', value: true}));

            if (eventKey === 'environment')
              dispatch(updateByPath({path: 'session.environment.panelsShown.noiseAmplitudes', value: true}));

            dispatch(updateByPath({path: 'session.activeTab', value: eventKey || 'environment'}));
          }}>
          <Tab as="div" eventKey="environment" title={
            <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
              <IconEnvironment width="16" height="16"/> Environment
            </div>
          }>
            <PanelGroup direction="horizontal" onLayout={sizes => {
              dispatch(updateByPath({path: 'session.environment.resizeLayout', value: [...sizes]}));
            }}>
              <Panel
                defaultSize={environmentLayout[0]} minSize={30} order={2}
                style={{height: '85vh', overflowY: 'scroll'}}>
                <EnvironmentContainer/>
              </Panel>
              <PanelResizeHandle style={{width: 5, height: '85vh'}}/>
              <Panel defaultSize={environmentLayout[1]} minSize={30} order={2}>
                <EnvironmentPresets/>
                <TemplateXMLViewer/>
              </Panel>
            </PanelGroup>
          </Tab>
          <Tab as="div" eventKey="scenario" title={
            <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
              <IconScenario width="16" height="16"/> Scenario
            </div>
          }>
            <PanelGroup direction="horizontal" onLayout={sizes => {
              dispatch(updateByPath({path: 'session.scenario.resizeLayout', value: [...sizes]}));
            }}>
              <Panel
                defaultSize={scenarioLayout[0]} minSize={30} order={2}
                style={{height: '85vh', overflowY: 'scroll'}}>
                <ScenarioContainer/>
              </Panel>
              <PanelResizeHandle style={{width: 5, height: '85vh'}}/>
              <Panel defaultSize={scenarioLayout[1]} minSize={30} order={2}>
                <ScenarioPresets/>
                <ScenarioTemplateXMLViewer/>
              </Panel>
            </PanelGroup>
          </Tab>
          <Tab as="div" eventKey="xml_editor" title={
            <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
              <IconCodeXml width="16" height="16"/> Xml Editor
            </div>
          }>
            <Row>
              <Col sm="12">
                <XmlEditor/>
              </Col>
            </Row>
          </Tab>
          {panelsAttribute?.showXmlToJson && (
            <Tab as="div" eventKey="xml_to_json" title={
              <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
                <IconCodeXml width="16" height="16"/> Xml:Json
              </div>
            }>
              <Row>
                <Col sm="12">
                  <XmlToPlainJson/>
                </Col>
              </Row>
            </Tab>
          )}
          {panelsAttribute?.showXmlToEnvironment && (
            <Tab as="div" eventKey="xml_to_environment_json" title={
              <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
                <IconCodeXml width="16" height="16"/> Xml:Environment
              </div>
            }>
              <Row>
                <Col sm="12">
                  <XmlToEnvironmentJson/>
                </Col>
              </Row>
            </Tab>
          )}
          {panelsAttribute?.showXmlToScenario && (
            <Tab as="div" eventKey="xml_to_scenario_json" title={
              <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
                <IconCodeXml width="16" height="16"/> Xml:Scenario
              </div>
            }>
              <Row>
                <Col sm="12">
                  <XmlToScenarioJson/>
                </Col>
              </Row>
            </Tab>
          )}
        </Tabs>
      </Container>
    </div>
  );
};

const initializeApp = (args: {
  dispatch: ((reducer: unknown) => {});
  scenarioTemplate: string;
  environmentTemplate: string;
  environmentFilename: string;
  scenarioFilename: string;
}) => {
  const {dispatch, environmentTemplate, scenarioTemplate} = args;
  dispatch(scenarioSetName(args.scenarioFilename));
  dispatch(environmentSetName(args.environmentFilename));

  try {
    if (environmentTemplate.trim()) {
      dispatch(envResetValues());
      const json = environmentXmlToJson(environmentTemplate)?.environment ?? {};
      dispatch(environmentOverwriteValues(json));
    }
  } catch (e) {
  }

  try {
    if (scenarioTemplate.trim()) {
      dispatch(resetValues());
      const json = scenarioXmlToJson(scenarioTemplate)?.scenario ?? {};
      dispatch(scenarioOverwriteValues(json));
    }
  } catch (e) {
  }


  dispatch(updateInit(true));
};

export default App;
