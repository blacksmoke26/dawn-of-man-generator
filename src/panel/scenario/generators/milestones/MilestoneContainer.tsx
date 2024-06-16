/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-13
 */

import React from 'react';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import xmlFormatter from 'xml-formatter';
import {Button, ButtonGroup, Form} from 'react-bootstrap';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// components
import Milestone from './Milestone';

// types
import type {Required} from 'utility-types';

export interface MilestonesState {
  [key: string]: {
    template: string;
    strings: string;
  };
}

interface Props {
  disabled?: boolean,

  onChange(template: string, strings: string): void,
}

const toTemplateText = (milestones: MilestonesState): string => {
  const template = Object.values(milestones).map((attr => attr.template)).join('').trim();

  return !template ? '' : xmlFormatter(
    `<milestones>`
    + Object.values(milestones).map((attr => attr.template)).join('')
    + '</milestones>',
  );
};

/** MilestoneContainer functional component */
const MilestoneContainer = (props: Props) => {
  const newProps = merge<Required<Props>>({
    disabled: false,
    onChange() {
    },
  }, props);

  const [disabled, setDisabled] = React.useState<boolean>(newProps.disabled);
  const [milestones, setMilestones] = React.useState<MilestonesState>({});

  const total: number = Object.keys(milestones).length;

  // Reflect state changes
  React.useEffect(() => {
    const template = !disabled ? '' : toTemplateText(milestones);
    typeof newProps.onChange === 'function' && newProps.onChange(
      template,
      Object.values(milestones).map((attr => attr.strings)).join('\n')
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, milestones]);

  const renderNodes = (): React.ReactElement[] => {
    const nodes = [];
    let index = 0;

    for (const [id] of Object.entries(milestones)) {
      nodes.push(
        <React.Fragment key={id}>
          <div className="pl-2" style={{borderLeft: '2px solid rgb(133 107 99)'}}>
            <Milestone
              disabledCheckbox={!disabled}
              onChange={(template: string, values, strings) => {
                setMilestones(current => ({
                  ...current, [id]: {template, strings},
                }));
              }}
              onRemoveClick={() => {
                setMilestones(current => {
                  const newList = {...current};
                  delete newList[id];
                  return newList;
                });
              }}/>
          </div>
          <div className="clearfix"></div>
          {index < total - 1 && <hr className="mt-2 mb-3"/>}
        </React.Fragment>,
      );
      index++;
    }

    return nodes;
  };

  return (
    <div>
      <div className="mb-2 checkbox-align">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`milestones_override-switch-${nanoid(5)}`}
          label="Allow milestones throughout the whole scenario"
          checked={disabled}
          onChange={e => setDisabled(e.target.checked)}
        />
      </div>
      <div className="mb-3">
        <ButtonGroup>
          <Button variant="secondary" size="sm" disabled={!disabled} onClick={() => {
            const milestoneId = nanoid(10).toLowerCase();
            setMilestones(current => ({
              ...current,
              [milestoneId]: {
                template: '', strings: '',
              },
            }));
          }}><IconNew/> New Milestone</Button>
          <Button variant="danger" size="sm" disabled={!disabled || total < 1} onClick={() => {
            setMilestones({});
          }}><IconClear/> Remove All</Button>
        </ButtonGroup>
      </div>

      {renderNodes()}
    </div>
  );
};

export default MilestoneContainer;
