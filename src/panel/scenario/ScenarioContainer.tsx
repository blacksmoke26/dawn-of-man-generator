// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React from 'react';
import FileSaver from 'file-saver';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';
import {Button, ButtonGroup} from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {anOldHope} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// elemental components
import Accordion from '~/components/ui/Accordion';

// components
import HardcoreModeAllowed from './generators/general/HardcoreModeAllowed';
import Category from './generators/general/Category';
import MapSize from './generators/general/MapSize';
import NomadModeAllowed from './generators/general/NomadModeAllowed';
import Visible from './generators/general/Visible';
import GroupID from '~/panel/scenario/generators/general/GroupID';
import ShowCompletionIcon from './generators/general/ShowCompletionIcon';
import RequiredScenario from './generators/general/RequiredScenario';
import LocationContainer from './generators/location/LocationContainer';

// utils
import {nodesToLanguageStrings} from '~/utils/location';

// types
import type {Json} from '~/types/json.types';

const SCENARIO_NAME: string = 'scenario';

/** ScenarioContainer functional component */
const ScenarioContainer = () => {
  const [templateTexts, setTemplateTexts] = React.useState<Json>({
    hardcoreModeAllowed: '',
    nomadModeAllowed: '',
    category: '',
    groupId: '',
    mapSize: '',
    showCompletionIcon: '',
    requiredScenario: '',
    visible: '',
    locations: '',
  });

  const [langStrings, setLangStrings] = React.useState<Json>({});

  /** Update templates raw texts */
  const updateText = React.useCallback((name: string, value: string): void => {
    setTemplateTexts(current => ({
      ...current,
      [name]: value,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<scenario>
			${Object.values(templateTexts).join('')}
		</scenario>`;

    return xmlFormatter(xml, {indentation: '  '});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTexts]);

  /** Generate language string xml code */
  const toLanguageTemplateText = React.useCallback((): string => {
    const data: Array<string> = [];

    for (const nodes of Object.values(langStrings)) {
      for (const [key, label] of Object.entries(nodes)) {
        data.push(`<string name="${key}">${label}</string>`);
      }
    }

    return xmlFormatter(`
			<?xml version="1.0" encoding="utf-8"?>
			<strings>${data.join('')}</strings>
		`, {indentation: '  ', collapseContent: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langStrings, templateTexts]);

  /** Update language strings data */
  const updateLangString = React.useCallback((name: string, data: string): void => {
    setLangStrings(current => ({
      ...current,
      [name]: data,
    }));
  }, []);

  /** Download file button click handler */
  const downloadFileClick = React.useCallback((): void => {
    var blob = new Blob([toTemplateText()], {type: 'text/xml;charset=utf-8'});
    FileSaver.saveAs(blob, `${SCENARIO_NAME}.xml`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTexts]);

  /** Download language file button click handler */
  const downloadLanguageFileClick = React.useCallback((): void => {
    const blob = new Blob([toLanguageTemplateText()], {type: 'text/xml;charset=utf-8'});
    FileSaver.saveAs(blob, `en_${SCENARIO_NAME}.lng.xml`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langStrings]);

  return (
    <>
      <Accordion header="General" eventKey="general">
        <HardcoreModeAllowed onChange={v => updateText('hardcoreModeAllowed', v)}/>
        <NomadModeAllowed onChange={v => updateText('nomadModeAllowed', v)}/>
        <Category onChange={v => updateText('category', v)}/>
        <GroupID onChange={v => updateText('groupId', v)}/>
        <MapSize onChange={v => updateText('mapSize', v)}/>
        <ShowCompletionIcon onChange={v => updateText('showCompletionIcon', v)}/>
        <RequiredScenario onChange={v => updateText('requiredScenario', v)}/>
        <Visible onChange={v => updateText('visible', v)}/>
      </Accordion>
      <Accordion header="Locations" eventKey="locations">
        <LocationContainer onChange={(template: string, list) => {
          updateText('locations', template);
          updateLangString('locations', template.trim() ? nodesToLanguageStrings(list) as any : '');
        }}/>
      </Accordion>
      <hr/>
      <div className="syntax-highlighter">
        <SyntaxHighlighter style={anOldHope} language="xml">
          {toTemplateText()}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2">
        <ButtonGroup size="sm">
          <Button variant="secondary"
                  onClick={() => copyClipboard(toTemplateText())}>
            Copy to Clipboard
          </Button>
          <Button variant="secondary"
                  onClick={() => downloadFileClick()}>
            Download File
          </Button>
        </ButtonGroup>
      </div>
      <hr/>
      <div className="syntax-highlighter">
        <SyntaxHighlighter style={anOldHope} language="xml">
          {toLanguageTemplateText()}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2">
        <ButtonGroup size="sm">
          <Button variant="secondary"
                  onClick={() => copyClipboard(toLanguageTemplateText())}>
            Copy to Clipboard
          </Button>
          <Button variant="secondary"
                  onClick={() => downloadLanguageFileClick()}>
            Download File
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default ScenarioContainer;
