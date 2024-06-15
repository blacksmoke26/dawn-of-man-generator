/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-15
 * @version 2.1.1
 */

import React from 'react';
import FileSaver from 'file-saver';
import copyClipboard from 'clipboard-copy';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {Button, ButtonGroup, Form, InputGroup} from 'react-bootstrap';
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// icons
import {IconCopy, IconDownload, IconPencilLine} from '~/components/icons/app';

// redux
import {updateScenarioName} from '~redux/reducers';
import {useAppDispatch, useAppSelector} from '~redux/hooks';

const TemplateXMLViewer = () => {
  const dispatch = useAppDispatch();

  const {template, strings, scenarioName} = useAppSelector(({templates, strings, scenarioName}) => {
    return {
      template: templates.scenario,
      strings: strings.scenario,
      scenarioName,
    };
  });

  const SCENARIO_FILENAME: string = `${scenarioName.trim() || 'scenario'}.xml`;
  const STRINGS_FILENAME: string = `${scenarioName.trim() || 'scenario'}.lng.xml`;

  return (
    <>
      <div>
        <div className="syntax-highlighter">
          <SyntaxHighlighter
            style={anOldHope}
            language="xml"
            customStyle={{height: '44vh', fontSize: 16, overflowY: 'scroll'}}>
            {template.trim()}
          </SyntaxHighlighter>
        </div>
        <div className="mt-2 mb-2" style={{marginLeft: 2}}>
          <div className="float-left">
            <ButtonGroup size="sm">
              <Button
                title="Copy to Clipboard"
                variant="secondary"
                onClick={() => copyClipboard(template)}>
                <IconCopy/> Copy
              </Button>
              <Button
                title={`Download XML file: '${SCENARIO_FILENAME}'`}
                variant="secondary"
                onClick={() => {
                  const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                  FileSaver.saveAs(blob, SCENARIO_FILENAME);
                }}>
                <IconDownload/> Download
              </Button>
            </ButtonGroup>
          </div>
          <div className="float-right">
            <InputGroup>
              <InputGroup.Text
                title="The scenario name (e.g., my_scenario)"
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}>
                <IconPencilLine className="mr-1"/> Scenario
              </InputGroup.Text>
              <Form.Control
                style={{width: 200}}
                type="text"
                id="scenario_name"
                placeholder="e.g., my_scenario"
                title="The scenario name (e.g., my_scenario)"
                value={scenarioName}
                onChange={e => {
                  const value = e.target.value.replace(/(['" \t]|[^a-z_\d])+/ig, `_`).toLowerCase();
                  dispatch(updateScenarioName(value));
                }}
                onKeyUp={e => {
                  // @ts-ignore
                  e.target.value = e.target.value.replace(/(['" \t]|[^a-z_\d])+/ig, `_`).toLowerCase();
                }}
              />
            </InputGroup>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
      <div className="syntax-highlighter">
        <SyntaxHighlighter
          style={anOldHope}
          language="xml"
          customStyle={{height: '20.3vh', fontSize: 16, overflowY: 'scroll'}}>
          {strings.trim()}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2 mb-2" style={{marginLeft: 2}}>
        <div className="float-left">
          <ButtonGroup size="sm">
            <Button
              title="Copy to Clipboard"
              variant="secondary"
              onClick={() => copyClipboard(template)}>
              <IconCopy/> Copy
            </Button>
            <Button
              title={`Download XML File: '${STRINGS_FILENAME}'`}
              variant="secondary"
              onClick={() => {
                const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                FileSaver.saveAs(blob, STRINGS_FILENAME);
              }}>
              <IconDownload/> Download File
            </Button>
          </ButtonGroup>
        </div>

        <div className="clearfix"></div>
      </div>
    </>
  );
};

export default TemplateXMLViewer;
