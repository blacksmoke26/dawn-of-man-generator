/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React, {useEffect} from 'react';
import merge from 'deepmerge';
import copyClipboard from 'clipboard-copy';
import {ButtonGroup, Col, Row} from 'react-bootstrap';
import {JsonEditor, JsonEditorProps, Theme, themes} from 'json-edit-react';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import XmlEditorInput from '~/components/ui/XmlEditorInput';

// icons
import {IconChevronDown, IconChevronUp, IconCopy, IconRaiseDown, IconRaiseUp} from '~/components/icons/app';

// helpers
import {validate, ValidationError, xmlToJson} from '~/helpers/xml';

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

  const xmlValidated: boolean | ValidationError = validate(value.trim());
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

  return (
    <Row className="mb-1">
      <Col sm="7" className="pr-1">
        <XmlEditorInput
          value={value}
          placeholder={newProps.placeholder}
          onChange={setValue}
          editorProps={{
            height: '85vh', fontSize: 14,
            showPrintMargin: false,
          }}
        />
      </Col>
      <Col sm="5">
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
            icons={{copy: <IconCopy/>}}
            enableClipboard={true}
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
              title="Collapse All"
              onClick={() => setEditorConfig(current => ({
                ...current,
                collapse: 1,
              }))}>
              <IconChevronUp/> Collapse
            </LinkButton>

            <LinkButton
              disabled={!Object.keys(json).length}
              title="Expand all"
              onClick={() => setEditorConfig(current => ({
                ...current,
                collapse: 6,
              }))}>
              <IconChevronDown/> Expand
            </LinkButton>

            <LinkButton
              disabled={!Object.keys(json).length}
              title="Sort keys by name"
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
