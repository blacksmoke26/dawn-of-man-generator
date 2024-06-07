/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import copyClipboard from 'clipboard-copy';
import {Card, Button, Form} from 'react-bootstrap';

// code highlighter
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// helpers
import {parse} from '~/helpers/xml';

// types
import {Json} from '~/types/json.types';

/** ConvertorContainer functional component */
const XmlToJsonConvertorContainer = () => {
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

    return JSON.stringify(json, null, '  ');
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Form.Control value={value} onChange={(e) => {
            const val: string = String(e.currentTarget.value).trim();
            setValue(val);
            setTimeout(() => {
              setXmlText(val);
            }, 50);
          }} as="textarea" className="font-family-code" style={{height: 300}}/>
        </Card.Body>
      </Card>
      <hr/>
      <div className="syntax-highlighter">
        <SyntaxHighlighter style={anOldHope} language="json">
          {toTemplateText()}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2">
        <Button size="sm" variant="secondary"
                onClick={() => copyClipboard(toTemplateText())}>
          Copy to Clipboard
        </Button>
      </div>
    </>
  );
};

export default XmlToJsonConvertorContainer;
