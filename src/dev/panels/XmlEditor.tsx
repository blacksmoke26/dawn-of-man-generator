/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import React from 'react';

// elemental components
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import PopoverDropdown from '~/components/ui/PopoverDropdown';

// icons
import {IconChevronSimpleDown, IconCodeXml, IconEnvironment, IconScenario} from '~/components/icons/app';

// hooks
import {useAppSelector} from '~redux/hooks';

// types
import {Json} from '~/types/json.types';

const iconsMap: Json = {
  environment: IconEnvironment,
  scenario: IconScenario,
};

/** XmlToEnvironmentJson functional component */
const XmlToEnvironmentJson = () => {
  const [xmlText, setXmlText] = React.useState<string>('');

  const scenarioTemplate = useAppSelector(({scenario}) => scenario.template);
  const scenarioStrings = useAppSelector(({scenario}) => scenario.strings);
  const environmentStrings = useAppSelector(({environment}) => environment.template);

  return (
    <XmlEditorInput
      value={xmlText}
      placeholder="Write or paste XML here"
      onChange={setXmlText}
      buttons={(
        <span className="d-inline-block mt-1" style={{marginLeft: '.9rem'}}>
          <PopoverDropdown
            heading="Choose..."
            hideArrow
            formatText={() => (
              <><IconCodeXml
                style={{top: -1, marginRight: 3}}
                className="d-inline-block position-relative"/>
                Templates <IconChevronSimpleDown/></>
            )}
            formatLabel={(option) => {
              const Icon = iconsMap?.[option.value as string] || IconCodeXml;
              return (
                <><Icon className="mr-1"/> {option.label}</>
              );
            }}
            options={[{
              label: 'Environment',
              value: 'environment',

            }, {
              label: 'Scenario',
              value: 'scenario',

            }, {
              label: 'Scenario (Strings)',
              value: 'scenario_strings',
            }]}
            onSelect={({value}) => {
              switch (value) {
                case 'environment':
                  setXmlText(environmentStrings);
                  break;
                case 'scenario':
                  setXmlText(scenarioTemplate);
                  break;
                case 'scenario_strings':
                  setXmlText(scenarioStrings);
                  break;
              }
            }}/>
        </span>
      )}
    />
  );
};

export default XmlToEnvironmentJson;
