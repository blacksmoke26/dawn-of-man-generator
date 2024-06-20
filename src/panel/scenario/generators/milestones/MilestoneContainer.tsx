/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-13
 */

import React from 'react';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// components
import Milestone from './Milestone';

// types
import type {Required} from 'utility-types';
import {toLanguageString} from '~/utils/strings';
import useAttributes from '~/hooks/use-attributes';
import cn from 'classname';
import type {Json, KVDocument} from '~/types/json.types';
import {capitalCase} from 'change-case';

export interface MilestonesState {
  [key: string]: {
    template: string;
    strings: string;
    name: string;
    disabled: boolean;
  };
}

interface Props {
  checked?: boolean;

  onTemplate?(template: string): void;

  onStrings?(text: string): void;
}

/** Maximum limit of tabs */
const MAX_COUNT: number = 20;

const toTemplateText = (milestones: MilestonesState): string => {
  const template = Object
    .values(milestones)
    .filter(attr => !attr.disabled)
    .map((attr => attr.template)).join('').trim();

  return !template ? '' : (
    `<milestones>`
    + Object.values(milestones).map((attr => attr.template)).join('')
    + '</milestones>'
  );
};

const toStringsText = (milestones: MilestonesState): string => {
  return Object.values(milestones)
    .filter(attr => !attr.disabled)
    .map((attr => attr.strings)).join('').trim();
};

const TabContentWrapper = (props: Json) => {
  return (
    <div>
      {props.children}
    </div>
  );
};

/** MilestoneContainer functional component */
const MilestoneContainer = (props: Props) => {
  const newProps = merge<Required<Props>>({
    checked: false,
  }, props);

  const [checked, setChecked] = React.useState<boolean>(newProps.checked);
  const [milestones, setMile, , remMile, clearMile] = useAttributes<MilestonesState>({});
  const [activeKey, setActiveKey] = React.useState<string>('');

  // Reflect state changes
  React.useEffect(() => {
    //setMile((milestones: MilestonesState) => merge(milestones, newProps.milestones));
    newProps.onTemplate(!checked ? '' : toTemplateText(milestones));
    newProps.onStrings(!checked ? '' : toStringsText(milestones));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, milestones]);

  /** Total tabs count */
  const total: number = Object.keys(milestones).length;

  const removeTab = (tabId: string): void => {
    let nextActiveKey: string = activeKey;
    const tabsId: string[] = Object.keys(milestones).map(id => id);
    const currentIndex: number = tabsId.findIndex(id => id === nextActiveKey);

    if (nextActiveKey === tabId) {
      nextActiveKey = currentIndex !== 0
        ? tabsId[currentIndex + 1]
        : tabsId[currentIndex - 1];
      setActiveKey(nextActiveKey);
    }

    remMile(tabId);
  };

  return (
    <>
      <div className="mb-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`milestones_override-switch-${nanoid(5)}`}
          label="Allow milestones throughout the whole scenario"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
      </div>
      <div className="mb-3">
        <ButtonToolbar
          className="justify-content-between"
          aria-label="Toolbar with Button groups">
          <ButtonGroup>
            <Button
              variant="secondary" size="sm"
              disabled={!checked || total >= MAX_COUNT}
              className={cn({'cursor-disabled': !checked || total >= MAX_COUNT})}
              onClick={() => {
                const milestoneId = nanoid(10).toLowerCase();
                setMile(milestoneId, {
                  template: '', strings: '', name: 'Untitled', disabled: false,
                });
                setActiveKey(milestoneId);
              }}><IconNew/> New Milestone</Button>
            <Button
              variant="danger"
              size="sm"
              className={cn({'cursor-disabled': !checked || total < 1})}
              disabled={!checked || total < 1}
              onClick={() => clearMile()}>
              <IconClear/> Remove All
            </Button>
          </ButtonGroup>
          <InputGroup>
            <InputGroup.Text
              className={cn('border-0 pl-2 pr-2', {
                'text-muted text-line-through': !checked || total < 1,
              })}>Total: {total}</InputGroup.Text>
          </InputGroup>
        </ButtonToolbar>
      </div>
      <Tabs
        id="milestones-tab"
        activeKey={activeKey}
        className={cn('nav-tabs-bottom mb-0', {'border-0': !total})}
        onSelect={k => setActiveKey(k as string)}>
        {Object.entries(milestones).map(([id, milestone]) => {
          // noinspection HtmlUnknownAnchorTarget
          return (
            <Tab
              disabled={!checked}
              eventKey={id}
              key={id}
              as="div"
              title={
                <>
                  <span
                    className={cn('text-size-sm font', {
                      'text-muted text-line-through': !checked || milestone.disabled,
                      'pr-2': !milestone.disabled,
                    })}>
                    {milestone?.name ?? 'untitled'}
                  </span>
                  <a aria-disabled={!checked} href="#tab-close" hidden={milestone.disabled}
                     className="text-muted text-size-sm text-decoration-none p-0"
                     style={{
                       lineHeight: '10px',
                       position: 'relative',
                       top: 0,
                     }}
                     onClick={e => {
                       e.preventDefault();
                       e.stopPropagation();
                       removeTab(id);
                     }}
                  >&times;</a>
                </>
              }>
              <TabContentWrapper>
                <div className="pl-2" style={{borderLeft: '2px solid rgb(133 107 99)'}}>
                  <Milestone
                    disabledCheckbox={!checked}
                    onTemplate={(template: string) => {
                      setMile(id, (value: KVDocument) => ({...value, template}));
                    }}
                    onStringsChange={strings => {
                      setMile(id, (value: KVDocument) => ({...value, strings: toLanguageString(strings)}));
                    }}
                    onValuesChange={changedValues => {
                      setMile(id, (value: KVDocument) => {
                        const _name = capitalCase(changedValues?.id?.trim() || '').substring(0, 15);
                        return {
                          ...value,
                          disabled: !Boolean(_name),
                          name: _name || value.name,
                        };
                      });
                    }}
                    onRemoveClick={() => remMile(id)}/>
                </div>
                <div className="clearfix"></div>
              </TabContentWrapper>
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default MilestoneContainer;
