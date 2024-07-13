/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-15
 * @version 2.1.1
 */

import React from 'react';
import FileSaver from 'file-saver';
import {PanelGroup, Panel, PanelResizeHandle} from 'react-resizable-panels';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import PopoverTextInput from '~/components/ui/PopoverTextInput';

// components
import XmlImporter from '~/panel/scenario/XmlImporter';

// icons
import {COLOR_REDDISH, IconDownload, IconPencilLine} from '~/components/icons/app';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {updateName} from '~redux/slices/scenario/reducers';
import {updateByPath} from '~redux/slices/config/reducers';

const TemplateXMLViewer = () => {
  const dispatch = useAppDispatch();

  const environmentName = useAppSelector(({environment}) => environment.name);
  const template = useAppSelector(({scenario}) => scenario.template).replace('{{environment}}', environmentName);
  const strings = useAppSelector(({scenario}) => scenario.strings);
  const scenarioName = useAppSelector(({scenario}) => scenario.name);

  const resizeViewer = useAppSelector(({config}) => config.session?.scenario?.resizeViewer ?? [60, 40]);

  const SCENARIO_FILENAME: string = `${scenarioName.trim() || 'scenario'}.xml`;
  const STRINGS_FILENAME: string = `${scenarioName.trim() || 'scenario'}.lng.xml`;

  return (
    <PanelGroup direction="vertical" onLayout={sizes => {
      dispatch(updateByPath({path: 'session.scenario.resizeViewer', value: [...sizes]}));
    }}>
      <Panel
        defaultSize={resizeViewer[0]} minSize={30} maxSize={90}>
        <XmlEditorInput
          editorProps={{
            readOnly: true,
            highlightActiveLine: false,
            fontSize: 15,
            height: '96%',
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
                onSave={value => {
                  if (value.trim()) {
                    dispatch(updateName(value));
                    dispatch(updateByPath({path: 'session.scenario.filename', value}));
                  }
                }}
              />
            </div>
          )}
        />
      </Panel>
      <PanelResizeHandle style={{height: 5}}/>
      <Panel defaultSize={resizeViewer[1]} minSize={1} maxSize={34}>
        <XmlEditorInput
          editorProps={{
            readOnly: true,
            highlightActiveLine: false,
            showPrintMargin: false,
            fontSize: 15,
            height: '82.5%',
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
      </Panel>
    </PanelGroup>
  );
};

export default TemplateXMLViewer;
