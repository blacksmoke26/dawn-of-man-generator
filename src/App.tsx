/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Col, Container, Row, Tabs, Tab} from 'react-bootstrap';

// components
import Header from '~/elements/Header';
import Footer from '~/elements/Footer';

// environment components
import EnvironmentPresets from '~/panel/environment/Presets';
import TemplateXMLViewer from '~/panel/environment/TemplateXMLViewer';
import EnvironmentContainer from '~/panel/environment/EnvironmentContainer';

// scenario components
import ScenarioContainer from '~/panel/scenario/ScenarioContainer';
import ScenarioTemplateXMLViewer from '~/panel/scenario/TemplateXMLViewer';
import XmlToPlainJson from '~/dev/panels/XmlToPlainJson';

// icons
import {IconCodeXml, IconEnvironment, IconScenario} from '~/components/icons/app';

// redux
import {updateInit} from '~redux/reducers';
import {useAppDispatch} from '~redux/hooks';
import XmlToScenarioJson from '~/dev/panels/XmlToScenarioJson';

const ENV_PROD: boolean = process.env.NODE_ENV === 'production';

const App = () => {
  const dispatch = useAppDispatch();

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
              <Col sm="6" className="pr-1" style={{height: '75vh', overflowY: 'scroll'}}>
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
              <Col sm="6" className="pr-1" style={{height: '75vh', overflowY: 'scroll'}}>
                <ScenarioContainer/>
              </Col>
              <Col sm="6">
                <ScenarioTemplateXMLViewer/>
              </Col>
            </Row>
          </Tab>
          {!ENV_PROD && (
            <Tab as="div" eventKey="xml_to_json" title={
              <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
                <IconCodeXml width="16" height="16"/> Xml_Json
              </div>
            }>
              <Row>
                <Col sm="12">
                  <XmlToPlainJson/>
                </Col>
              </Row>
            </Tab>
          )}
          {!ENV_PROD && (
            <Tab as="div" eventKey="xml_to_scenario_json" title={
              <div className="pl-4 pr-4" style={{fontSize: '0.95rem'}}>
                <IconCodeXml width="16" height="16"/> Xml_Scenario
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
        <Footer/>
      </Container>
    </div>
  );
};

export default App;
