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
import {
  COLOR_REDDISH,
  IconChevronSimpleDown,
  IconCodeXml,
  IconDownload,
  IconEnvironment,
  IconPencilLine,
  IconScenario,
} from '~/components/icons/app';

// hooks
import {useAppSelector} from '~redux/hooks';

// parsers
import {EnvironmentName, presetOptions as envPresetOptions, presets as envPresets} from '~/data/environments/builtin';
import {presetOptions as scnPresetOptions, presets as scnPresets, ScenarioName} from '~/data/scenario/builtin';
import FileSaver from 'file-saver';
import LinkButton from '~/components/ui/LinkButton';
import PopoverTextInput from '~/components/ui/PopoverTextInput';
import {updateName} from '~redux/slices/scenario/reducers';

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
  const [filename, setFilename] = React.useState<string>('file');

  const scenarioTemplate = useAppSelector(({scenario}) => scenario.template);
  const scenarioStrings = useAppSelector(({scenario}) => scenario.strings);
  const environmentStrings = useAppSelector(({environment}) => environment.template);

  return (
    <XmlEditorInput
      value={xmlText}
      placeholder="Write or paste XML here"
      onChange={setXmlText}
      editorProps={{
        height: '85vh', fontSize: 15,
        showPrintMargin: false,
      }}
      buttons={(<>
        <span className="d-inline-block" style={{marginLeft: '.8rem'}}>
          <SelectPopout
            dropdownWidth={250}
            selectProps={{menuPlacement: 'top'}}
            options={([] as Options).concat(userlandOptions, envPresetOptions, scnPresetOptions)}
            hideArrow={true}
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
              if (type === 'scenario') {
                setXmlText(scnPresets?.[value as ScenarioName] as '');
                return;
              }

              if (type === 'environment') {
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
        <LinkButton style={{marginLeft: '.6rem'}}
          disabled={!xmlText.trim()}
          className="pt-0 pb-0"
          title={`Download xml file: '${filename}.xml'`}
          onClick={() => {
            const blob = new Blob([xmlText], {type: 'text/xml;charset=utf-8'});
            FileSaver.saveAs(blob, `${filename}.xml`);
          }}>
          <IconDownload/> Download
        </LinkButton>
      </>)}
      rightButtons={(
        <div className="d-flex align-items-start">
          <span className="mr-1"><IconPencilLine/> Filename:</span>
          <PopoverTextInput
            hideArrow
            placement="top"
            caseType="SNAKE_CASE"
            value={filename}
            inputProps={{
              placeholder: 'e.g., filename',
              maxLength: 30,
            }}
            style={{top: -2}}
            formatValue={value => (
              <>
                <span
                  className="text-underline-dotted"
                  style={{color: COLOR_REDDISH}}>
                  {value}
                </span>
              </>
            )}
            onSave={value => value.trim() && setFilename(value)}
          />
        </div>
      )}
    />
  );
};

export default XmlToEnvironmentJson;
