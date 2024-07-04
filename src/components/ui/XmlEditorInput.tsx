/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import React from 'react';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';

import AceEditor, {IAceEditorProps} from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools'; // always first or you're fired
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github_dark';

// utils
import {formatXml, validate, ValidationError} from '~/helpers/xml';
import {invokeHandler} from '~/utils/callback';
import {ButtonGroup, ButtonToolbar, InputGroup} from 'react-bootstrap';
import LinkButton from '~/components/ui/LinkButton';
import {IconClear, IconCopy, IconWandSparkles} from '~/components/icons/app';
import copyClipboard from 'clipboard-copy';

interface Props {
  placeholder?: string;
  editorProps?: Omit<IAceEditorProps, 'onChange' | 'onPaste' | 'value' | 'placeholder'>;
  value?: string;
  buttons?: React.ReactNode;

  onChange?(value: string): void;
}

const editorDefaultProps: IAceEditorProps = {
  highlightActiveLine: true,
  lineHeight: 19,
  height: '69.9vh',
  fontSize: 16,
  showGutter: true,
  showPrintMargin: true,
  editorProps: {$blockScrolling: true},
  setOptions: {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: false,
    showLineNumbers: true,
    tabSize: 2,
    useWorker: false,
  },
};

const formatXmlString = (xml: any): string => {
  try {
    return formatXml(String(xml).trim());
  } catch (e) {
    return String(xml);
  }
};

/** XmlEditorInput functional component */
const XmlEditorInput = (props: Props) => {
  const [editorProps, setEditorProps] = React.useState<IAceEditorProps>(
    merge(editorDefaultProps, props?.editorProps || {}),
  );

  const value = props?.value?.trim() ?? '';

  const xmlValidated: boolean | ValidationError = validate(value);
  const xmlError: string = typeof xmlValidated !== 'boolean' ? xmlValidated.err.msg : '';
  const isXmlValid: boolean = xmlValidated === true;

  React.useEffect(() => {
    props?.editorProps !== undefined
    && setEditorProps(current => merge(current, props.editorProps || {}));
  }, [props?.editorProps, props?.value]);

  return (
    <>
      <AceEditor
        {...editorProps}
        placeholder={props?.placeholder}
        mode="xml"
        theme="github_dark"
        onChange={str => {
          invokeHandler(props, 'onChange', String(str || '').trim());
        }}
        name={nanoid(10)}
        className="font-family-code w-100"
        value={value}/>
      <div className="mt-2 mb-2" style={{marginLeft: 0}}>
        <ButtonToolbar
          className="d-flex justify-content-between text-orange"
          aria-label="Toolbar with Button groups">
          <ButtonGroup size="sm">
            <LinkButton
              disabled={!props?.value?.trim() || !isXmlValid}
              title="Prettify xml"
              color="WHITISH"
              className="ml-0 pl-0"
              onClick={() => {
                invokeHandler(props, 'onChange', formatXmlString(value));
              }}>
              <IconWandSparkles/> Prettify
            </LinkButton>
            <LinkButton
              disabled={!value}
              title="Copy to Clipboard"
              onClick={() => copyClipboard(value)}>
              <IconCopy/> Copy
            </LinkButton>
            <LinkButton
              disabled={!value?.trim()}
              title="Clear"
              color="REDDISH"
              onClick={() => {
                invokeHandler(props, 'onChange', '');
              }}>
              <IconClear/> Clear
            </LinkButton>
            {props?.buttons}
          </ButtonGroup>
          {Boolean(value) && !isXmlValid && (
            <InputGroup>
              <InputGroup.Text
                className="bg-transparent font-family-code border-0 p-0 text-orange">
                {xmlError}
              </InputGroup.Text>
            </InputGroup>
          )}
        </ButtonToolbar>
      </div>
    </>
  );
};

export default XmlEditorInput;
