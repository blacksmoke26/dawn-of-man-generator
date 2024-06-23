/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import {nanoid} from 'nanoid';
import {Button, Form} from 'react-bootstrap';

// icons
import {COLOR_REDDISH, IconChevronDown, IconChevronUp, IconClear} from '~/components/icons/app';

export const GoalToggle = (props: { disabled: boolean, expanded: boolean, onClick: () => void }) => (
  <div className="d-inline-block p-0">
    <Button
      disabled={props.disabled}
      title={props.expanded ? 'Collapse milestone panel' : 'Expand milestone panel'}
      variant="link" className="p-0" style={{top: '0.19rem'}}
      onClick={props.onClick}>
      {!props.expanded
        ? <IconChevronUp width="16" height="16"/>
        : <IconChevronDown width="16" height="16"/>}
    </Button>
  </div>
);

export const GoalCheck = (props: { disabled: boolean, checked: boolean, onChange: (state: boolean) => void }) => (
  <div className="d-inline-block mr-1" title="Allow milestone for a current scenerio">
    <Form.Check
      type="switch"
      style={{top: 7}}
      id={`allow_milestone-switch-${nanoid(5)}`}
      label=""
      disabled={props.disabled}
      checked={!props.checked}
      onChange={e => props.onChange(e.currentTarget.checked)}
    />
  </div>
);

export const GoalRemove = (props: { disabled: boolean, onClick: () => void }) => (
  <div className="d-inline-block">
    <Button
      variant="link" className="p-0"
      style={{top: 2, color: props.disabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH}}
      title="Remove milestone"
      disabled={props.disabled}
      onClick={props.onClick}>
      <IconClear width="20" height="20" style={{top: 0}}/>
    </Button>
  </div>
);
