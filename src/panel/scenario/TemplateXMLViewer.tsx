/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-15
 * @version 2.1.1
 */

import React from 'react';
import FileSaver from 'file-saver';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import PopoverTextInput from '~/components/ui/PopoverTextInput';

// components
import XmlImporter from '~/panel/scenario/XmlImporter';

// icons
import {COLOR_REDDISH, IconDownload, IconPencilLine} from '~/components/icons/app';

// redux
import {updateName} from '~redux/slices/scenario/reducers';
import {useAppDispatch, useAppSelector} from '~redux/hooks';

const TemplateXMLViewer = () => {
  const dispatch = useAppDispatch();

  const environmentName = useAppSelector(({environment}) => environment.name);
  const template = useAppSelector(({scenario}) => scenario.template).replace('{{environment}}', environmentName);
  const strings = useAppSelector(({scenario}) => scenario.strings);
  const scenarioName = useAppSelector(({scenario}) => scenario.name);

  const SCENARIO_FILENAME: string = `${scenarioName.trim() || 'scenario'}.xml`;
  const STRINGS_FILENAME: string = `${scenarioName.trim() || 'scenario'}.lng.xml`;

  return (
    <>
      <div className="mb-3">
        <XmlEditorInput
          editorProps={{
            readOnly: true,
            highlightActiveLine: false,
            height: '59vh', fontSize: 15,
            showPrintMargin: false,
            setOptions: {
              foldStyle: 'manual',
            },
          }}
          hideClearButton
          value={template.trim()}
          buttons={(
            <>
              <LinkButton
                disabled={!template.trim()}
                className="pt-0 pb-0"
                title={`Download scenario xml file: '${SCENARIO_FILENAME}'`}
                onClick={() => {
                  const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                  FileSaver.saveAs(blob, SCENARIO_FILENAME);
                }}>
                <IconDownload/> Download
              </LinkButton>
              <XmlImporter/>
            </>
          )}
          rightButtons={(
            <div className="d-flex align-items-start">
              <span className="mr-1"><IconPencilLine/> Scenario:</span>
              <PopoverTextInput
                hideArrow
                caseType="SNAKE_CASE"
                value={scenarioName}
                inputProps={{
                  placeholder: 'e.g., my_scenario',
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
                onSave={value => value.trim() && dispatch(updateName(value))}
              />
            </div>
          )}
        />
      </div>
      <XmlEditorInput
        editorProps={{
          readOnly: true,
          highlightActiveLine: false,
          height: '20.3vh', fontSize: 15,
        }}
        hideClearButton
        value={strings.trim()}
        buttons={(
          <>
            <LinkButton
              className="pt-0 pb-0"
              disabled={!strings.trim()}
              title={`Download strings xml File: '${STRINGS_FILENAME}'`}
              onClick={() => {
                const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                FileSaver.saveAs(blob, STRINGS_FILENAME);
              }}>
              <IconDownload/> Download
            </LinkButton>
          </>
        )}
      />
    </>
  );
};

export default TemplateXMLViewer;
