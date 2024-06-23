/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import xmlFormatter from 'xml-formatter';

// elemental components
import Accordion from '~/components/ui/Accordion';

// components
import Category from './generators/general/Category';
import MapSize from './generators/general/MapSize';
import Visible from './generators/general/Visible';
import LoadingScreen from './generators/general/LoadingScreen';
import GroupID from './generators/general/GroupID';
import RequiredScenario from './generators/general/RequiredScenario';
import NomadModeAllowed from './generators/general/NomadModeAllowed';
import StartingCondition from './generators/general/StartingCondition';
import DisasterContainer from './generators/disaster/DisasterContainer';
import LocationContainer from './generators/location/LocationContainer';
import ShowCompletionIcon from './generators/general/ShowCompletionIcon';
import HardcoreModeAllowed from './generators/general/HardcoreModeAllowed';
import RequiredMilestone from './generators/general/RequiredMilestone';
import CustomSettlementNameAllowed from './generators/general/CustomSettlementNameAllowed';

import MilestoneContainer from './generators/milestones/MilestoneContainer';
import GoalContainer from './generators/goals/GoalContainer';

// icons
import {IconBlock, IconGoal, IconMapPin, IconMilestone, IconStorm} from '~/components/icons/app';

// utils
import {nodesToLanguageStrings} from '~/utils/location';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {updateTemplate, updateString} from '~redux/slices/scenario/reducers';

// types
import type {Json, KVDocument} from '~/types/json.types';

/** Generate xml code */
const toTemplateText = (templates: KVDocument<string>): string => {
  const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<scenario>
			${Object.values(templates).join('')}
		</scenario>`;

  return xmlFormatter(xml, {indentation: '  '});
};

/** Generate language string xml code */
const toLanguageText = (strings: KVDocument<string | Json>): string => {
  const data: Array<string> = [];

  for (const nodes of Object.values(strings)) {
    if ('string' === typeof nodes) {
      data.push(nodes);
      continue;
    }

    for (const [key, label] of Object.entries(nodes)) {
      data.push(`<string name="${key}">${label}</string>`);
    }
  }

  return xmlFormatter(`
			<?xml version="1.0" encoding="utf-8"?>
			<strings>${data.join('')}</strings>
		`, {indentation: '  ', collapseContent: true});
};

/** ScenarioContainer functional component */
const ScenarioContainer = () => {
  const dispatch = useAppDispatch();

  const templateText = useAppSelector(({scenario}) => scenario.template);
  const stringsText = useAppSelector(({scenario}) => scenario.strings);

  const [templateTexts, setTemplateTexts] = React.useState<KVDocument<string>>({
    hardcoreModeAllowed: '',
    nomadModeAllowed: '',
    category: '',
    groupId: '',
    mapSize: '',
    showCompletionIcon: '',
    requiredScenario: '',
    requiredMilestone: '',
    customSettlementNameAllowed: '',
    loadingScreens: '',
    startingConditions: '',
    visible: '',
    locations: '',
    disasters: '',
    milestones: '',
  });
  const [langStrings, setLangStrings] = React.useState<KVDocument<string>>({
    milestones: '',
    locations: '',
  });

  /** Update templates raw texts */
  const updateText = (name: string, value: string): void => {
    setTemplateTexts(current => ({
      ...current,
      [name]: value,
    }));
  };
  React.useEffect(() => {
    const text = toTemplateText(templateTexts);
    if (text !== templateText) {
      dispatch(updateTemplate(text));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTexts, templateText]);

  React.useEffect(() => {
    const text = toLanguageText(langStrings);
    if (text !== stringsText) {
      dispatch(updateString(text));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langStrings, stringsText]);

  /** Update language strings data */
  const updateLangString = (name: string, strings: string): void => {
    setLangStrings(current => ({
      ...current, [name]: strings,
    }));
  };

  return (
    <>
      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> General</span>}
        eventKey="general" defaultActiveKey="general">
        <HardcoreModeAllowed onChange={v => updateText('hardcoreModeAllowed', v)}/>
        <hr className="mt-1"/>
        <NomadModeAllowed onChange={v => updateText('nomadModeAllowed', v)}/>
        <hr className="mt-1"/>
        <Category onChange={v => updateText('category', v)}/>
        <hr className="mt-1"/>
        <GroupID onChange={v => updateText('groupId', v)}/>
        <hr className="mt-1"/>
        <MapSize onChange={v => updateText('mapSize', v)}/>
        <hr className="mt-1"/>
        <ShowCompletionIcon onChange={v => updateText('showCompletionIcon', v)}/>
        <hr className="mt-1"/>
        <RequiredScenario onChange={v => updateText('requiredScenario', v)}/>
        <hr className="mt-1"/>
        <RequiredMilestone onChange={v => updateText('requiredMilestone', v)}/>
        <hr className="mt-1"/>
        <CustomSettlementNameAllowed onChange={v => updateText('customSettlementNameAllowed', v)}/>
        <hr className="mt-1"/>
        <LoadingScreen onChange={v => updateText('loadingScreens', v)}/>
        <hr className="mt-1"/>
        <StartingCondition onChange={v => updateText('startingConditions', v)}/>
        <hr className="mt-1"/>
        <Visible onChange={v => updateText('visible', v)}/>
      </Accordion>
      <Accordion
        header={(
          <span className="text-size-sm">
            <IconStorm className="d-inline-block" width="17" height="17"/> Disasters
          </span>
        )}
        eventKey="disasters">
        <DisasterContainer onChange={(template: string) => updateText('disasters', template)}/>
      </Accordion>
      <Accordion
        header={(
          <span className="text-size-sm">
            <IconMilestone
              className="d-inline-block" width="17"
              height="17"/> Milestones
          </span>
        )}
        eventKey="milestones">
        <MilestoneContainer
          onTemplate={template => updateText('milestones', template)}
          onStrings={text => updateLangString('milestones', text)}/>
      </Accordion>
      <Accordion
        header={(
          <span className="text-size-sm">
            <IconGoal
              className="d-inline-block" width="17"
              height="17"/> Goals
          </span>
        )}
        eventKey="goals">
        <GoalContainer
          onTemplate={template => updateText('goals', template)}
          onStrings={text => updateLangString('goals', text)}/>
      </Accordion>
      <Accordion
        header={<span className="text-size-sm"><IconMapPin className="d-inline-block" width="17" height="17"/> Locations</span>}
        eventKey="locations" noBodyPad={true}>
        <LocationContainer onChange={(template: string, list) => {
          updateText('locations', template);
          updateLangString('locations', template.trim() ? nodesToLanguageStrings(list) as any : '');
        }}/>
      </Accordion>
    </>
  );
};

export default ScenarioContainer;
