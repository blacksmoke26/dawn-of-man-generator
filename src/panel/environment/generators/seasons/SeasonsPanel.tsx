/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, ButtonGroup, ButtonToolbar, Form, InputGroup, Tab, Tabs} from 'react-bootstrap';

// components
import Spring from './Spring';
import Summer from './Summer';
import Fall from './Fall';
import Winter from './Winter';

// icons
import {
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_WHITISH,
  IconFall,
  IconRestore,
  IconShuffle,
  IconSpring,
  IconSummer,
  IconWinter,
} from '~/components/icons/app';

// utils
import {isObject} from '~/helpers/object';
import {randomSeasons} from '~/utils/random';
import {SeasonsDefault} from '~/utils/randomizer/seasons';

// parsers
import {toSeasonsTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty, updateByPath} from '~redux/slices/environment/reducers';

export interface Props {
  enabled?: boolean;

  onChange?(template: string): void;
}

/** SeasonsPanel functional component */
const SeasonsPanel = (props: Props) => {
  const dispatch = useAppDispatch();

  props = merge({
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [spring, setSpring] = React.useState<string>('');
  const [summer, setSummer] = React.useState<string>('');
  const [fall, setFall] = React.useState<string>('');
  const [winter, setWinter] = React.useState<string>('');

  const reduxState = useAppSelector(({environment}) => environment.values?.seasons);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setEnabled(false);
      dispatch(clearProperty('seasons'));
    } else if (isObject(reduxState)) {
      setEnabled(true);
      setTimeout(() => dispatch(clearProperty('seasons')), 150)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toSeasonsTemplate(spring + summer + fall + winter, !enabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, spring, summer, fall, winter]);

  return (
    <div className="checkbox-align">
      <div className="mb-3">
        <ButtonToolbar
          className="justify-content-between"
          aria-label="Toolbar with Button groups">
          <InputGroup>
            <Form.Check
              type="switch"
              id={`seasons_override-switch-${nanoid(5)}`}
              label="Override seasons"
              className="positive-relative"
              style={{top: 6}}
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
          </InputGroup>
          <ButtonGroup>
            <Button
              title="Shuffle all seasons values"
              className="button-reset-sm mr-2"
              disabled={!enabled} variant="link" size="sm"
              style={{color: enabled ? COLOR_WHITISH : COLOR_DISABLED}}
              onClick={() => {
                dispatch(updateByPath({path: 'seasons', value: randomSeasons(), overwrite: true}));
              }}>
              <IconShuffle/> Randomize All
            </Button>
            <Button
              title="Reset all seasons to their default"
              className="button-reset-sm"
              style={{color: enabled ? COLOR_WHITISH : COLOR_DISABLED}}
              disabled={!enabled} variant="link" size="sm"
              onClick={() => {
                dispatch(updateByPath({path: 'seasons', value: SeasonsDefault, overwrite: true}));
              }}>
              <IconRestore color={enabled ? COLOR_ORANGE : COLOR_DISABLED}/> Restore All
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <Tabs
        id="seasons-tab"
        defaultActiveKey="spring"
        className="nav-tabs-bottom text-pos-left mb-0">
        <Tab
          disabled={!enabled}
          eventKey="spring"
          key="spring"
          title={<span className="text-size-sm"><IconSpring width="17" height="17"/> Spring</span>}
          as="div">
          <Spring onTemplate={xml => setSpring(xml)} disabled={!enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="summer"
          key="summer"
          title={<span className="text-size-sm"><IconSummer width="17" height="17"/> Summer</span>}
          as="div">
          <Summer onTemplate={xml => setSummer(xml)} disabled={!enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="fall"
          key="fall"
          title={<span className="text-size-sm"><IconFall width="17" height="17"/> Fall</span>}
          as="div">
          <Fall onTemplate={xml => setFall(xml)} disabled={!enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="winter"
          key="winter"
          title={<span className="text-size-sm"><IconWinter width="17" height="17"/> Winter</span>}
          as="div">
          <Winter onTemplate={xml => setWinter(xml)} disabled={!enabled}/>
        </Tab>
      </Tabs>
    </div>
  );
};

// Properties validation
SeasonsPanel.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SeasonsPanel;
