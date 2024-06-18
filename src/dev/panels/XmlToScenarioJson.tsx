/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import copyClipboard from 'clipboard-copy';
import {Button, ButtonGroup, Col, Form, Row} from 'react-bootstrap';

// code highlighter
import SyntaxHighlighter from 'react-syntax-highlighter';
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// icons
import {IconCopy} from '~/components/icons/app';

// parsers
import {jsonToRedux} from '~/data/scenario/parser';

// helpers
import {parse} from '~/helpers/xml';

// types
import {Json} from '~/types/json.types';

/** XmlToPlainJson functional component */
const XmlToPlainJson = () => {
  const [value, setValue] = React.useState<string>('');
  const [xmlText, setXmlText] = React.useState<string>('');

  /** Generate xml code */
  const toTemplateText = (): string => {
    let json: Json = {};

    if (!xmlText) {
      return '{}';
    }

    try {
      json = parse(xmlText, {
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: true,
        parseTagValue: true,
        allowBooleanAttributes: true,
      });
    } catch (e: any) {
      return e.message;
    }

    return JSON.stringify(jsonToRedux(json), null, '  ');
  };

  const template = toTemplateText().trim();

  return (
    <Row className="mb-1">
      <Col sm="6" className="pr-1">
        <Form.Control
          value={value} onChange={(e) => {
          const val: string = String(e.currentTarget.value).trim();
          setValue(val);
          setTimeout(() => {
            setXmlText(val);
          }, 50);
        }} as="textarea"
          placeholder="Write or paste scenario XML here..."
          className="font-family-code"
          style={{
            height: '74.7vh',
            fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
            fontSize: 14,
        }}/>
      </Col>
      <Col sm="6">
        <div className="syntax-highlighter">
          <SyntaxHighlighter
            style={anOldHope}
            language="json"
            customStyle={{height: '69.9vh', fontSize: 15, overflowY: 'auto'}}>
            {template}
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
            </ButtonGroup>
          </div>
          <div className="clearfix"></div>
        </div>
      </Col>
    </Row>
  );
};

export default XmlToPlainJson;
