/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React, {useEffect} from 'react';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import copyClipboard from 'clipboard-copy';
import {JsonEditor, JsonEditorProps, Theme, themes} from 'json-edit-react';
import {ButtonGroup, ButtonToolbar, Col, InputGroup, Row} from 'react-bootstrap';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github_dark';

// elemental components
import LinkButton from '~/components/ui/LinkButton';

// icons
import {
  IconChevronDown,
  IconChevronUp,
  IconClear,
  IconCopy,
  IconRaiseDown,
  IconRaiseUp,
  IconWandSparkles,
} from '~/components/icons/app';

// helpers
import {formatXml, validate, ValidationError, xmlToJson} from '~/helpers/xml';

// types
import type {Required} from 'utility-types';
import type {Json} from '~/types/json.types';

const editorTheme = merge<Theme>(themes.githubDark, {
  styles: {
    container: {
      backgroundColor: '#1e2430',
    },
  },
});

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
  const [editorConfig, setEditorConfig] = React.useState<JsonEditorProps>({} as JsonEditorProps);
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
  const parseJSON = (): Json => {
    let json: Json = {};

    if (!xmlText) {
      return {};
    }

    try {
      json = xmlToJson(xmlText);
    } catch (e: any) {
      return e.message;
    }

    delete json['?xml'];
    const [key] = Object.keys(json);
    const parsed = newProps.onTransformJson(json);
    return {key, json: parsed?.[key] ?? parsed};
  };

  const {key = 'root', json = {}} = parseJSON();

  const formatXML = (xml: any): string => {
    try {
      return formatXml(String(xml).trim());
    } catch (e) {
      return String(xml);
    }
  };

  return (
    <Row className="mb-1">
      <Col sm="6" className="pr-1">
        <AceEditor
          placeholder={newProps.placeholder}
          mode="xml"
          theme="github_dark"
          onChange={str => {
            setValue(String(str || '').trim());
          }}
          fontSize={13}
          name={nanoid(10)}
          lineHeight={19}
          className="font-family-code w-100"
          showPrintMargin={true}
          editorProps={{$blockScrolling: true}}
          showGutter={true}
          style={{
            height: '69.9vh',
            fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
            fontSize: 14,
          }}
          highlightActiveLine={true}
          value={value}
          onPaste={(xmlStr) => {
            setTimeout(() => {
              setValue(formatXML(xmlStr))
            }, 30);
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false,
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
          <JsonEditor
            collapse={2}
            {...editorConfig}
            theme={editorTheme}
            minWidth="100%"
            restrictAdd
            restrictDelete
            restrictEdit
            restrictDrag
            restrictTypeSelection
            showCollectionCount="when-closed"
            enableClipboard={false}
            className="ui-json-editor"
            indent={2}
            rootName={key}
            data={json || {}}
          />
        </div>
        <div className="mt-2 mb-2" style={{marginLeft: 2}}>
          <ButtonGroup size="sm">
            <LinkButton
              disabled={!Object.keys(json).length}
              className="ml-0 pl-0"
              title="Copy to Clipboard"
              onClick={() => copyClipboard(JSON.stringify(json, null, ' '))}>
              <IconCopy/> Copy
            </LinkButton>

            <LinkButton
              disabled={!Object.keys(json).length}
              title="Copy to Clipboard"
              onClick={() => setEditorConfig(current => ({
                ...current,
                collapse: 1,
              }))}>
              <IconChevronUp/> Collapse
            </LinkButton>

            <LinkButton
              disabled={!Object.keys(json).length}
              title="Copy to Clipboard"
              onClick={() => setEditorConfig(current => ({
                ...current,
                collapse: 5,
              }))}>
              <IconChevronDown/> Expand
            </LinkButton>

            <LinkButton
              disabled={!Object.keys(json).length}
              title="Copy to Clipboard"
              onClick={() => setEditorConfig(current => ({
                ...current,
                keySort: !current?.keySort,
              }))}>
              {!editorConfig?.keySort ? <IconRaiseUp/> : <IconRaiseDown/>} Sort
            </LinkButton>
          </ButtonGroup>
        </div>
      </Col>
    </Row>
  );
};

export default XmlToJson;
