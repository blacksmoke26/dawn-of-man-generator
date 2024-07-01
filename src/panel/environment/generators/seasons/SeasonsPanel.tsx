/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {
  Button, ButtonGroup, ButtonToolbar,
  Form, InputGroup, Tab, Tabs,
} from 'react-bootstrap';

// components
import Spring from './Spring';
import Summer from './Summer';
import Fall from './Fall';
import Winter from './Winter';

// utils
import {isObject} from '~/helpers/object';
import {seasonsPropsDefault, seasonsPropsRandomize} from '~/utils/seasons';

// redux
import {useAppSelector, useAppDispatch} from '~redux/hooks';
import {updateValuesRaw} from '~redux/slices/environment/reducers';

// icons
import {
  IconRestore, IconShuffle,
  IconFall, IconSpring, IconSummer, IconWinter,
  COLOR_DISABLED, COLOR_REDDISH, COLOR_WHITISH, COLOR_ORANGE,
} from '~/components/icons/app';

// types
import type {Json} from '~/types/json.types';
import type {SeasonsProp} from '~/utils/seasons.types';

export interface ExportValues {
  spring: Json;
  summer: Json;
  fall: Json;
  winter: Json;
}

export interface Props {
  enabled?: boolean;

  onChange?(template: string, values: ExportValues): void;
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
  const [seasonProps] = React.useState<SeasonsProp>(seasonsPropsDefault());

  const {spring: springConfig, summer: summerConfig, fall: fallConfig, winter: winterConfig} = seasonProps;

  const seasonsAttribute = useAppSelector(({environment}) => environment.values?.seasons);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = seasonsAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (isObject(extValue) && Object.keys(extValue as Json).length) {
      setEnabled(true);
    }
  }, [seasonsAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), seasonProps as ExportValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, spring, summer, fall, winter]);

  /** Generate xml code */
  const toTemplateText = (): string => {
    return enabled
      ? (
        `<seasons>
					${spring + summer + fall + winter}
				</seasons>`
      ) : '';
  };

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
                dispatch(updateValuesRaw({seasons: seasonsPropsRandomize()}));
              }}>
              <IconShuffle/> Randomize All
            </Button>
            <Button
              title="Reset all seasons to their default"
              className="button-reset-sm"
              style={{color: enabled ? COLOR_WHITISH : COLOR_DISABLED}}
              disabled={!enabled} variant="link" size="sm"
              onClick={() => {
                dispatch(updateValuesRaw({seasons: seasonsPropsDefault()}));
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
          <Spring season={springConfig} onChange={v => setSpring(v)} enabled={enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="summer"
          key="summer"
          title={<span className="text-size-sm"><IconSummer width="17" height="17"/> Summer</span>}
          as="div">
          <Summer season={summerConfig} onChange={v => setSummer(v)} enabled={enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="fall"
          key="fall"
          title={<span className="text-size-sm"><IconFall width="17" height="17"/> Fall</span>}
          as="div">
          <Fall season={fallConfig} onChange={v => setFall(v)} enabled={enabled}/>
        </Tab>
        <Tab
          disabled={!enabled}
          eventKey="winter"
          key="winter"
          title={<span className="text-size-sm"><IconWinter width="17" height="17"/> Winter</span>}
          as="div">
          <Winter season={winterConfig} onChange={v => setWinter(v)} enabled={enabled}/>
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
