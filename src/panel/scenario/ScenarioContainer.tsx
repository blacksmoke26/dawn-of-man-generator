/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

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
import EventContainer from './generators/events/EventContainer';

// icons
import {IconBlock, IconEvent, IconGoal, IconMapPin, IconMilestone, IconStorm} from '~/components/icons/app';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {updateByPath} from '~redux/slices/config/reducers';
import {updateTemplate, updateString} from '~redux/slices/scenario/reducers';

// types
import type {KVDocument} from '~/types/json.types';
import {toStringsTemplate, toScenarioTemplate} from '~/utils/parser/templates-scenario';

/** ScenarioContainer functional component */
const ScenarioContainer = () => {
  const dispatch = useAppDispatch();

  const initiated = useAppSelector(({config}) => config.initiated);
  const {template: templateText, strings: stringsText} = useAppSelector(({scenario}) => scenario);

  const {
    general: panelGeneral = true,
    disasters: panelDisasters = false,
    milestones: panelMilestones = false,
    goals: panelGoals = false,
    events: panelEvents = false,
    locations: panelLocations = false,
  } = useAppSelector(({config}) => config?.session.scenario.panelsShown ?? false);

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
    goals: '',
    events: '',
  });

  const [langStrings, setLangStrings] = React.useState<KVDocument<string>>({
    locations: '',
    milestones: '',
    goals: '',
    events: '',
  });
  React.useEffect(() => {
    if (!initiated) return;

    const text = toScenarioTemplate(Object.values(templateTexts));
    if (text !== templateText) {
      dispatch(updateTemplate(text));
      setTimeout(() => dispatch(updateByPath({path: 'session.scenario.template', value: text})), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTexts, templateText]);

  React.useEffect(() => {
    if (!initiated) return;

    const text = toStringsTemplate(langStrings);
    if (text !== stringsText) {
      dispatch(updateString(text));
      setTimeout(() => dispatch(updateByPath({path: 'session.scenario.strings', value: text})), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langStrings, stringsText]);

  /** Update templates raw texts */
  const updateText = (name: string, value: string): void => {
    setTemplateTexts(current => ({...current, [name]: value}));
  };

  /** Update language strings data */
  const updateLangString = (name: string, strings: string): void => {
    setLangStrings(current => ({...current, [name]: strings}));
  };

  return (
    <>
      <Accordion
        header={<span className="text-size-sm"><IconBlock width="17" height="17"/> General</span>}
        eventKey="scenario_general"
        activeKey={panelGeneral ? 'scenario_general' : ''}
        onHeaderClick={() => dispatch(updateByPath({
          path: 'session.scenario.panelsShown.general',
          value: !panelGeneral,
        }))}>
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
        eventKey="scenario_disasters"
        activeKey={panelDisasters ? 'scenario_disasters' : ''}
        onHeaderClick={() => dispatch(updateByPath({
          path: 'session.scenario.panelsShown.disasters',
          value: !panelDisasters,
        }))}>
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
        eventKey="scenario_milestones"
        activeKey={panelMilestones ? 'scenario_milestones' : ''}
        onHeaderClick={() => dispatch(updateByPath({
          path: 'session.scenario.panelsShown.milestones',
          value: !panelMilestones,
        }))}>
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
        eventKey="scenario_goals"
        activeKey={panelGoals ? 'scenario_goals' : ''}
        onHeaderClick={() => dispatch(updateByPath({path: 'session.scenario.panelsShown.goals', value: !panelGoals}))}>
        <GoalContainer
          onTemplate={template => updateText('goals', template)}
          onStrings={text => updateLangString('goals', text)}/>
      </Accordion>
      <Accordion
        header={(
          <span className="text-size-sm">
            <IconEvent
              className="d-inline-block" width="17"
              height="17"/> Events
          </span>
        )}
        eventKey="scenario_events"
        noBodyPad={true}
        activeKey={panelEvents ? 'scenario_events' : ''}
        onHeaderClick={() => dispatch(updateByPath({
          path: 'session.scenario.panelsShown.events',
          value: !panelEvents,
        }))}>
        <EventContainer
          onTemplate={template => updateText('events', template)}
        />
      </Accordion>
      <Accordion
        header={<span className="text-size-sm">
          <IconMapPin className="d-inline-block" width="17" height="17"/>
          {' '} Locations
        </span>}
        noBodyPad={true}
        eventKey="scenario_locations"
        activeKey={panelLocations ? 'scenario_locations' : ''}
        onHeaderClick={() => dispatch(updateByPath({
          path: 'session.scenario.panelsShown.locations',
          value: !panelLocations,
        }))}>
        <LocationContainer
          onStrings={strings => updateLangString('locations', strings)}
          onTemplate={template => updateText('locations', template)}/>
      </Accordion>
    </>
  );
};

export default ScenarioContainer;
