/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import React, {useEffect} from 'react';
import merge from 'deepmerge';
import copyClipboard from 'clipboard-copy';
import {ButtonGroup} from 'react-bootstrap';
import {PanelGroup, Panel, PanelResizeHandle} from 'react-resizable-panels';
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
import type {GroupOption} from '~/components/ui/Select';
import {ConfigurationState} from '~redux/slices/config/reducers.types';

const editorTheme = merge<Theme>(themes.githubDark, {
  styles: {
    container: {
      backgroundColor: '#1e2430',
    },
  },
});

const DEFAULT_LAYOUT_SIZE: [number, number] = [60, 40];

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


  const session = useAppSelector(({config}) => config.session);

  const layoutSize = getLayoutByType(props?.type, session);
  const xmlJsonTemplate = session?.xmlJson?.template ?? '';
  const xmlEnvironmentTemplate = session?.xmlEnvironment?.template ?? '';
  const xmlScenarioTemplate = session?.xmlScenario?.template ?? '';

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

  const {key = 'root', json = {}} = parseJSON(xmlText, value, props);

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
    <PanelGroup
      direction="horizontal"
      onLayout={size => updateLayoutByType(props?.type, size as [number, number], dispatch)}>
      <Panel defaultSize={layoutSize[0]} minSize={30} order={2}>
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
                options={getPresetsBy(props?.presets) as Options}
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
      </Panel>
      <PanelResizeHandle style={{width: 5, height: '96%'}}/>
      <Panel defaultSize={layoutSize[1]} minSize={20} order={2}>
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
      </Panel>
    </PanelGroup>
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

const parseJSON = (xmlText: string, value: string, props: XmlToJsonProps): Json => {
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

export const getPresetsBy = (presets?: XmlToJsonProps['presets']): unknown[] => {
  let selectOptions: unknown[] = [];

  if (presets) {
    selectOptions = ([] as unknown[]).concat(filterUserlandOptions(presets));
    if (['all', 'environment'].includes(presets)) {
      selectOptions = selectOptions.concat(envPresetOptions);
    }
    if (['all', 'scenario'].includes(presets)) {
      selectOptions = selectOptions.concat(scnPresetOptions);
    }
  }

  return selectOptions;
};
export const filterUserlandOptions = (type: 'all' | 'environment' | 'scenario'): Options => {
  if (type === 'all') return userlandOptions;

  const index = userlandOptions.findIndex((opt: Record<string, any>) => opt.type === 'userland');

  let node = userlandOptions[index] as GroupOption;

  const newOptions = [...userlandOptions];
  newOptions[index] = {
    ...node,
    options: node.options.filter((option: Option) => option.type === type),
  };

  return newOptions;
};

export const getIcon = (option: Option): typeof IconCodeXml => {
  if (option?.type === 'environment' || option.value === 'environment') {
    return IconEnvironment;
  }

  if (option?.type === 'scenario' || option.value === 'scenario') {
    return IconScenario;
  }

  return IconCodeXml;
};

const getLayoutByType = (type?: XmlToJsonProps['type'], state?: ConfigurationState['session']): [number, number] => {
  switch (type) {
    case 'plain':
      return state?.xmlJson?.resizeLayout ?? DEFAULT_LAYOUT_SIZE;
    case 'environment':
      return state?.xmlEnvironment?.resizeLayout ?? DEFAULT_LAYOUT_SIZE;
    case 'scenario':
      return state?.xmlScenario?.resizeLayout ?? DEFAULT_LAYOUT_SIZE;
    default:
      return DEFAULT_LAYOUT_SIZE;
  }
};

export const updateLayoutByType = (type: XmlToJsonProps['type'], size: [number, number], dispatch: ((func: unknown) => void)): void => {
  let name = '';

  switch (type) {
    case 'plain':
      name = 'xmlJson';
      break;
    case 'environment':
      name = 'xmlEnvironment';
      break;
    case 'scenario':
      name = 'xmlScenario';
      break;
  }

  dispatch(updateByPath({
    path: `session.${name}.resizeLayout`,
    value: [...size],
  }));
};

export default XmlToJson;
