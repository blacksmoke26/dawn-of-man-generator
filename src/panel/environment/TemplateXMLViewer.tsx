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

// components
import XmlTextLoader from './loaders/XmlTextLoader';

// icons
import {IconCopy, IconDownload, IconPencilLine} from '~/components/icons/app';

// redux
import {updateFilename} from '~redux/reducers';
import {useAppDispatch, useAppSelector} from '~redux/hooks';

const TemplateXMLViewer = () => {
  const dispatch = useAppDispatch();

  const template = useAppSelector(({templates}) => templates.environment);
  const fileName = useAppSelector(({fileName}) => fileName);

  return (
    <>
      <div className="syntax-highlighter">
        <SyntaxHighlighter
          style={anOldHope}
          language="xml"
          customStyle={{height: '63.6vh', fontSize: 15, overflowY: 'scroll'}}>
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
              title="Download XML file"
              variant="secondary"
              onClick={() => {
                const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                FileSaver.saveAs(blob, `${fileName || 'custom'}.xml`);
              }}>
              <IconDownload/> Download
            </Button>
            <XmlTextLoader/>
          </ButtonGroup>
        </div>
        <div className="float-right">
          <InputGroup style={{marginBottom: 1}}>
            <InputGroup.Text
              title="The environment name (e.g., my_environment)"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}>
              <IconPencilLine className="mr-1"/> Environment
            </InputGroup.Text>
            <Form.Control
              style={{width: 200}}
              type="text"
              id={`file_name`}
              placeholder="e.g., my_environment"
              title="The environment name (e.g., my_environment)"
              value={fileName}
              onChange={e => {
                const value = e.target.value.replace(/(['" \t]|[^a-z_\d])+/ig, `_`).toLowerCase();
                dispatch(updateFilename(value));
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
    </>
  );
};

export default TemplateXMLViewer;
