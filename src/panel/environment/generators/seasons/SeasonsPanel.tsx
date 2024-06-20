/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, Form, ButtonGroup} from 'react-bootstrap';

// elemental components
import Accordion from '~/components/ui/Accordion';

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
import {IconFall, IconRestore, IconShuffle, IconSpring, IconSummer, IconWinter} from '~/components/icons/app';

// types
import type {SeasonsProp} from '~/utils/seasons.types';
import type {Json} from '~/types/json.types';

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
					${spring} ${summer} ${fall} ${winter}
				</seasons>`
      ) : '';
  };

  return (
    <div className="checkbox-align">
      <div className="mb-2">
        <Form.Check
          className="pull-right"
          type="switch"
          id={`seasons_override-switch-${nanoid(5)}`}
          label="Override seasons"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />
      </div>
      <Accordion
        noCard={true}
        eventKey="seasons_spring"
        header={<span className="text-size-sm"><IconSpring width="17" height="17"/> Spring</span>}>
        <Spring season={springConfig} onChange={v => setSpring(v)} enabled={enabled}/>
      </Accordion>
      <hr className="mt-2 mb-2"/>
      <Accordion
        noCard={true}
        eventKey="seasons_summer"
        header={<span className="text-size-sm"><IconSummer width="17" height="17"/> Summer</span>}>
        <Summer season={summerConfig} onChange={v => setSummer(v)} enabled={enabled}/>
      </Accordion>
      <hr className="mt-2 mb-2"/>
      <Accordion
        noCard={true}
        eventKey="seasons_fall"
        header={<span className="text-size-sm"><IconFall width="17" height="17"/> Fall</span>}>
        <Fall season={fallConfig} onChange={v => setFall(v)} enabled={enabled}/>
      </Accordion>
      <hr className="mt-2 mb-2"/>
      <Accordion
        noCard={true}
        eventKey="seasons_winter"
        header={<span className="text-size-sm"><IconWinter width="17" height="17"/> Winter</span>}>
        <Winter season={winterConfig} onChange={v => setWinter(v)} enabled={enabled}/>
      </Accordion>
      <hr className="mt-2 mb-2"/>
      <div>
        <ButtonGroup>
          <Button
            disabled={!enabled} variant="secondary" size="sm"
            onClick={() => {
              dispatch(updateValuesRaw({seasons: seasonsPropsRandomize()}));
            }}>
            <IconShuffle/> Randomize All
          </Button>
          <Button
            disabled={!enabled} variant="secondary" size="sm"
            onClick={() => {
              dispatch(updateValuesRaw({seasons: seasonsPropsDefault()}));
            }}>
            <IconRestore/> Restore All
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

// Properties validation
SeasonsPanel.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SeasonsPanel;
