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
import SelectPopout, {Option, Options} from '~/components/ui/SelectPopout';

// icons
import {
  IconChevronDown, IconChevronSimpleDown,
  IconChevronUp,
  IconCodeXml,
  IconCopy, IconEnvironment,
  IconRaiseDown,
  IconRaiseUp, IconScenario,
} from '~/components/icons/app';

// helpers
import {validate, ValidationError, xmlToJson} from '~/helpers/xml';

// hooks
import {useAppSelector, useAppDispatch} from '~redux/hooks';
import {updateByPath} from '~redux/slices/config/reducers';

// parsers
import {ScenarioName, presetOptions as scnPresetOptions, presets as scnPresets} from '~/data/scenario/builtin';
import {EnvironmentName, presetOptions as envPresetOptions, presets as envPresets} from '~/data/environments/builtin';

// types
import type {Json} from '~/types/json.types';
import {GroupOption} from '~/components/ui/Select';

const editorTheme = merge<Theme>(themes.githubDark, {
  styles: {
    container: {
      backgroundColor: '#1e2430',
    },
  },
});

interface XmlToJsonProps {
  placeholder?: string;
  presets?: null | 'scenario' | 'environment' | 'all';
  type?: 'plain' | 'environment' | 'scenario';

  onTransformJson?(json: Json): Json;
}

/** XmlToJson functional component */
const XmlToJson = (props: XmlToJsonProps) => {
  const dispatch = useAppDispatch();

  const {template: environmentTemplate} = useAppSelector(({environment}) => environment);
  const {template: scenarioTemplate, strings: scenarioStrings} = useAppSelector(({scenario}) => scenario);

  const [value, setValue] = React.useState<string>('');
  const [editorConfig, setEditorConfig] = React.useState<JsonEditorProps>({} as JsonEditorProps);
  const [xmlText, setXmlText] = React.useState<string>('');

  const xmlValidated: boolean | ValidationError = validate(value || '');
  const isXmlValid: boolean = xmlValidated === true;

  const xmlJsonTemplate = useAppSelector(({config}) => config.session?.xmlJson?.template ?? '');
  const xmlEnvironmentTemplate = useAppSelector(({config}) => config.session?.xmlEnvironment?.template ?? '');
  const xmlScenarioTemplate = useAppSelector(({config}) => config.session?.xmlScenario?.template ?? '');

  useEffect(() => {
    props?.type === 'plain' && setValue(xmlJsonTemplate);
    props?.type === 'environment' && setValue(xmlEnvironmentTemplate);
    props?.type === 'scenario' && setValue(xmlScenarioTemplate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      (value?.trim() && isXmlValid) && setXmlText(value);
    }, 150);
  }, [value, isXmlValid]);

  /** Generate xml code */
  const parseJSON = (): Json => {
    let json: Json = {};

    if (!xmlText || !value) {
      return {};
    }

    try {
      json = xmlToJson(xmlText);
    } catch (e: any) {
      return e.message;
    }

    delete json['?xml'];
    const [key] = Object.keys(json);
    const parsed = props?.onTransformJson?.(json) ?? json;
    return {key, json: parsed?.[key] ?? parsed};
  };

  let selecOptions: unknown[] = [];

  if (props?.presets) {
    selecOptions = ([] as unknown[]).concat(filterUserlandOptions(props?.presets));
    if (['all', 'environment'].includes(props.presets)) {
      selecOptions = selecOptions.concat(envPresetOptions);
    }
    if (['all', 'scenario'].includes(props.presets)) {
      selecOptions = selecOptions.concat(scnPresetOptions);
    }
  }

  const {key = 'root', json = {}} = parseJSON();

  const updateValue = (newValue: string) => {
    setValue(newValue);
    props?.type === 'plain' && dispatch(updateByPath({path: 'session.xmlJson.template', value: String(newValue)}));
    props?.type === 'environment' && dispatch(updateByPath({
      path: 'session.xmlEnvironment.template',
      value: String(newValue),
    }));
    props?.type === 'scenario' && dispatch(updateByPath({
      path: 'session.xmlScenario.template',
      value: String(newValue),
    }));
  };

  return (
    <Row className="mb-1">
      <Col sm="7" className="pr-1">
        <XmlEditorInput
          value={value}
          placeholder={props?.placeholder ?? 'Write or paste XML here...'}
          onChange={updateValue}
          editorProps={{
            height: '85vh', fontSize: 14,
            showPrintMargin: false,
          }}
          buttons={Boolean(props?.presets) && (
            <div className="d-inline-block" style={{marginLeft: '.8rem'}}>
              <SelectPopout
                dropdownWidth={250}
                selectProps={{menuPlacement: 'top'}}
                options={selecOptions as Options}
                hideArrow={true}
                readOnly
                placeholder={
                  <><IconCodeXml
                    style={{top: 0, marginRight: 3}}
                    className="d-inline-block position-relative"/>
                    Templates <IconChevronSimpleDown style={{top: 0}} className="position-relative d-inline"/></>
                }
                formatOptionLabel={(option: Option) => {
                  const Icon = getIcon(option);
                  return (
                    <><Icon className="mr-1 d-inline"/> {option.label}</>
                  );
                }}
                onSelect={({value, type = null}) => {
                  switch (value) {
                    case 'environment':
                      return updateValue(environmentTemplate);
                    case 'scenario':
                      return updateValue(scenarioTemplate);
                    case 'scenario_strings':
                      return updateValue(scenarioStrings);
                  }

                  if (type === 'scenario') {
                    return updateValue(scnPresets?.[value as ScenarioName] as '');
                  } else if (type === 'environment') {
                    return updateValue(envPresets?.[value as EnvironmentName] as '');
                  }
                }}/>
            </div>
          )}
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

export const userlandOptions: Options = [{
  label: 'User-land',
  type: 'userland',
  options: [{
    label: 'Environment',
    value: 'environment',
    type: 'environment',

  }, {
    label: 'Scenario',
    value: 'scenario',
    type: 'scenario',

  }, {
    label: 'Scenario (Strings)',
    value: 'scenario_strings',
    type: 'scenario',
  }],
}];

export const filterUserlandOptions = (type: 'all' | 'environment' | 'scenario'): Options => {
  if ( type === 'all') return userlandOptions;

  const index = userlandOptions.findIndex((opt: Record<string, any>) => opt.type === 'userland');

  let node = userlandOptions[index] as GroupOption;

  const newOptions = [...userlandOptions];
  newOptions[index] ={
    ...node,
    options: node.options.filter((option: Option) => option.type === type)
  }

  return newOptions;
}

export const getIcon = (option: Option): typeof IconCodeXml => {
  if (option?.type === 'environment' || option.value === 'environment') {
    return IconEnvironment;
  }

  if (option?.type === 'scenario' || option.value === 'scenario') {
    return IconScenario;
  }

  return IconCodeXml;
};

export default XmlToJson;
