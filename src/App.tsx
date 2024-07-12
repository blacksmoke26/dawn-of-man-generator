/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Col, Container, Row, Tabs, Tab} from 'react-bootstrap';

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

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {updateInit} from '~redux/slices/config/reducers';

const App = () => {
  const dispatch = useAppDispatch();

  const panelsAttribute = useAppSelector(({config}) => config?.panels);

  React.useEffect(() => {
    dispatch(updateInit(true));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mt-3">
      <Header/>
      <Container fluid={true}>
        <Tabs defaultActiveKey="environment" className="nav-tabs-bottom">
          <Tab as="div" eventKey="environment" title={
            <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
              <IconEnvironment width="16" height="16"/> Environment
            </div>
          }>
            <Row>
              <Col sm="6" className="pr-1" style={{height: '85vh', overflowY: 'scroll'}}>
                <EnvironmentContainer/>
              </Col>
              <Col sm="6">
                <EnvironmentPresets/>
                <TemplateXMLViewer/>
              </Col>
            </Row>
          </Tab>
          <Tab as="div" eventKey="scenario" title={
            <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
              <IconScenario width="16" height="16"/> Scenario
            </div>
          }>
            <Row>
              <Col sm="6" className="pr-1" style={{height: '85vh', overflowY: 'scroll'}}>
                <ScenarioContainer/>
              </Col>
              <Col sm="6">
                <ScenarioPresets/>
                <ScenarioTemplateXMLViewer/>
              </Col>
            </Row>
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

export default App;
