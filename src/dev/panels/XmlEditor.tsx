/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import React from 'react';

// elemental components
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import SelectPopout, {Option, Options} from '~/components/ui/SelectPopout';

// icons
import {IconChevronSimpleDown, IconCodeXml, IconEnvironment, IconScenario} from '~/components/icons/app';

// hooks
import {useAppSelector} from '~redux/hooks';

// parsers
import {EnvironmentName, presetOptions as envPresetOptions, presets as envPresets} from '~/data/environments/builtin';
import {presetOptions as scnPresetOptions, presets as scnPresets, ScenarioName} from '~/data/scenario/builtin';

const getIcon = (option: Option): typeof IconCodeXml => {
  if (option?.type === 'environment' || option.value === 'environment') {
    return IconEnvironment;
  }

  if (option?.type === 'scenario' || option.value === 'scenario') {
    return IconScenario;
  }

  return IconCodeXml;
};

const userlandOptions: Options = [{
  label: 'User-land',
  options: [{
    label: 'Environment',
    value: 'environment',

  }, {
    label: 'Scenario',
    value: 'scenario',

  }, {
    label: 'Scenario (Strings)',
    value: 'scenario_strings',
  }],
}];

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
          <SelectPopout
            dropdownWidth={250}
            selectProps={{menuPlacement: 'top'}}
            options={([] as Options).concat(userlandOptions, envPresetOptions, scnPresetOptions)}
            hideArrow
            readOnly
            placeholder={
              <><IconCodeXml
                style={{top: 0, marginRight: 3}}
                className="d-inline-block position-relative"/>
                Templates <IconChevronSimpleDown style={{top: 0}} className="position-relative d-inline"/></>
            }
            formatOptionLabel={(option: Option) => {
              const Icon = getIcon(option);
              return (
                <><Icon className="mr-1 d-inline"/> {option.label}</>
              );
            }}
            onSelect={({value, type = null}) => {
              if ( type === 'scenario') {
                setXmlText(scnPresets?.[value as ScenarioName] as '');
                return;
              }

              if ( type === 'environment') {
                setXmlText(envPresets?.[value as EnvironmentName] as '');
                return;
              }

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
