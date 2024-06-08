/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import {Container} from 'react-bootstrap';

// elemental components
import Header from '~/elements/Header';
import Accordion from '~/components/ui/Accordion';
import Footer from '~/elements/Footer';
import EnvironmentPresets from '~/panel/environment/Presets';
import EnvironmentContainer from '~/panel/environment/EnvironmentContainer';
import ScenarioContainer from '~/panel/scenario/ScenarioContainer';

// redux
import {useAppDispatch} from '~redux/hooks';
import {updateInit} from '~redux/reducers';


const KEY_ENVIRONMENT: string = 'environment';
const KEY_SCENARIO: string = 'scenario';

const App = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(updateInit(true));
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="mt-4 mb-4">
      <Header/>
      <Accordion header="Environment" eventKey={KEY_ENVIRONMENT} defaultActiveKey={KEY_ENVIRONMENT}>
        <EnvironmentPresets/>
        <EnvironmentContainer/>
      </Accordion>
      <Accordion header="Scenario" eventKey={KEY_SCENARIO}>
        <ScenarioContainer/>
      </Accordion>
      <Footer/>
    </Container>
  );
};

export default App;
