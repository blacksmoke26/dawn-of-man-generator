/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import React from 'react';
import FileSaver from 'file-saver';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import PopoverTextInput from '~/components/ui/PopoverTextInput';
import SelectPopout, {Option, Options} from '~/components/ui/SelectPopout';

// icons
import {
  COLOR_REDDISH,
  IconCodeXml,
  IconDownload,
  IconPencilLine,
  IconChevronSimpleDown,
} from '~/components/icons/app';

// hooks
import {useAppSelector, useAppDispatch} from '~redux/hooks';
import {updateByPath} from '~redux/slices/config/reducers';

// parsers
import {ScenarioName, presetOptions as scnPresetOptions, presets as scnPresets} from '~/data/scenario/builtin';
import {EnvironmentName, presetOptions as envPresetOptions, presets as envPresets} from '~/data/environments/builtin';
import {getIcon, userlandOptions} from '~/components/panel/XmlToJson';


/** XmlToEnvironmentJson functional component */
const XmlToEnvironmentJson = () => {
  const dispatch = useAppDispatch();

  const [xmlText, setXmlText] = React.useState<string>('');
  const [filename, setFilename] = React.useState<string>('file');

  const scenarioTemplate = useAppSelector(({scenario}) => scenario?.template ?? '');
  const scenarioStrings = useAppSelector(({scenario}) => scenario?.strings ?? '');
  const environmentStrings = useAppSelector(({environment}) => environment?.template ?? '');

  const xmlEditorTemplate = useAppSelector(({config}) => config?.session?.xmlEditor?.template ?? '');
  const xmlEditorFilename = useAppSelector(({config}) => config?.session?.xmlEditor?.filename ?? 'file');

  React.useEffect(() => {
    setXmlText(xmlEditorTemplate);
    setFilename(xmlEditorFilename);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateXmlText = (value: string) => {
    setXmlText(value);
    dispatch(updateByPath({path: 'session.xmlEditor.template', value}));
  }

  return (
    <XmlEditorInput
      value={xmlText}
      placeholder="Write or paste XML here"
      onChange={updateXmlText}
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
              switch (value) {
                case 'environment':
                  return updateXmlText(environmentStrings);
                case 'scenario':
                  return updateXmlText(scenarioTemplate);
                case 'scenario_strings':
                  return updateXmlText(scenarioStrings);
              }

              if (type === 'scenario')
                return updateXmlText(scnPresets?.[value as ScenarioName] as '');
              if (type === 'environment')
                return updateXmlText(envPresets?.[value as EnvironmentName] as '');
            }}/>
        </span>
        <LinkButton
          style={{marginLeft: '.6rem'}}
          disabled={!xmlText?.trim?.()}
          className="pt-0 pb-0"
          title={`Download xml file: '${filename}.xml'`}
          onClick={() => FileSaver.saveAs(
            new Blob([xmlText], {type: 'text/xml;charset=utf-8'}), `${filename}.xml`
          )}>
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
            onSave={value => {
              if (value.trim()) {
                setFilename(value);
                dispatch(updateByPath({path: 'session.xmlEditor.filename', value}));
              }
            }}
          />
        </div>
      )}
    />
  );
};

export default XmlToEnvironmentJson;
