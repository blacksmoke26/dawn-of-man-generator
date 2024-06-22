/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React, {useEffect} from 'react';
import merge from 'deepmerge';
import copyClipboard from 'clipboard-copy';
import {ButtonGroup, ButtonToolbar, Col, Form, InputGroup, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';

// code highlighter
import SyntaxHighlighter from 'react-syntax-highlighter';
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// icons
import {IconClear, IconCopy, IconWandSparkles} from '~/components/icons/app';

// parsers

// helpers
import {formatXml, validate, ValidationError, xmlToJson} from '~/helpers/xml';

// types
import type {Required} from 'utility-types';
import type {Json} from '~/types/json.types';

interface XmlToJsonProps {
  placeholder?: string;

  onTransformJson?(json: Json): Json;
}

/** XmlToEnvironmentJson functional component */
const XmlToJson = (props: XmlToJsonProps) => {
  const newProps = merge<Required<XmlToJsonProps>>({
    placeholder: 'Write or paste XML here...',
    onTransformJson(json: Json) {
      return json;
    },
  }, props);

  const [value, setValue] = React.useState<string>('');
  const [xmlText, setXmlText] = React.useState<string>('');

  const inputRef = React.createRef<HTMLTextAreaElement>();

  const xmlValidated: boolean | ValidationError = validate(value.trim());
  const xmlError: string = typeof xmlValidated !== 'boolean' ? xmlValidated.err.msg : '';
  const isXmlValid: boolean = xmlValidated === true;

  useEffect(() => {
    setTimeout(() => {
      (value?.trim() && isXmlValid) && setXmlText(value);
    }, 150);
  }, [value, isXmlValid]);

  /** Generate xml code */
  const toTemplateText = (): string => {
    let json: Json = {};

    if (!xmlText) {
      return '{}';
    }

    try {
      json = xmlToJson(xmlText);
    } catch (e: any) {
      return e.message;
    }

    return JSON.stringify(newProps.onTransformJson(json), null, '  ');
  };

  const template = toTemplateText().trim();

  return (
    <Row className="mb-1">
      <Col sm="6" className="pr-1">
        <Form.Control
          ref={inputRef}
          value={value} onChange={e => setValue(String(e.currentTarget.value).trim())}
          as="textarea"
          placeholder={newProps.placeholder}
          className="font-family-code"
          style={{
            height: '69.9vh',
            fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
            fontSize: 14,
          }}/>
        <div className="mt-2 mb-2" style={{marginLeft: 0}}>
          <ButtonToolbar
            className="d-flex justify-content-between text-orange"
            aria-label="Toolbar with Button groups">
            <ButtonGroup size="sm">
              <LinkButton
                disabled={!value?.trim() || !isXmlValid}
                title="Prettify xml"
                color="WHITISH"
                className="ml-0 pl-0"
                onClick={() => {
                  setValue(value => formatXml(value));
                  inputRef?.current?.focus();
                }}>
                <IconWandSparkles/> Prettify
              </LinkButton>
              <LinkButton
                disabled={!value?.trim()}
                title="Copy to Clipboard"
                onClick={() => copyClipboard(value)}>
                <IconCopy/> Copy
              </LinkButton>
              <LinkButton
                disabled={!value?.trim()}
                title="Clear"
                color="REDDISH"
                onClick={() => {
                  setValue('');
                  inputRef?.current?.focus();
                }}>
                <IconClear/> Clear
              </LinkButton>
            </ButtonGroup>
            {Boolean(value.trim()) && Boolean(xmlError) && (
              <InputGroup>
                <InputGroup.Text className="border-0 pl-2 pr-2 pt-1 pb-1 mr-3 text-orange">
                  {xmlError}
                </InputGroup.Text>
              </InputGroup>
            )}
          </ButtonToolbar>
        </div>
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
          <ButtonGroup size="sm">
            <LinkButton
              disabled={!template?.trim()}
              className="ml-0 pl-0"
              title="Copy to Clipboard"
              onClick={() => copyClipboard(template)}>
              <IconCopy/> Copy
            </LinkButton>
          </ButtonGroup>
        </div>
      </Col>
    </Row>
  );
};

export default XmlToJson;
