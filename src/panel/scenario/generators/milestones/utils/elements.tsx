/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import {nanoid} from 'nanoid';
import {Button, Form} from 'react-bootstrap';

// icons
import {COLOR_REDDISH, IconChevronDown, IconChevronUp, IconEraser} from '~/components/icons/app';

export const MilestoneToggle = (props: { disabled: boolean, expanded: boolean, onClick: () => void }) => (
  <div className="d-inline-block ml-2">
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

export const MilestoneCheck = (props: { disabled: boolean, checked: boolean, onChange: (state: boolean) => void }) => (
  <div className="d-inline-block" title="Allow milestone for a current scenerio">
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

export const MilestoneRemove = (props: { disabled: boolean, onClick: () => void }) => (
  <div className="d-inline-block ml-2">
    <Button
      variant="link" className="p-0"
      style={{top: 2, color: props.disabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH}}
      title="Remove all conditions"
      disabled={props.disabled}
      onClick={props.onClick}>
      <IconEraser width="16" height="16" style={{top: 0}}/>
    </Button>
  </div>
);
