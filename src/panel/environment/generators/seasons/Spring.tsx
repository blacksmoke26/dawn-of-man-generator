// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Button, ButtonGroup, Col, Form, Row} from 'react-bootstrap';

// elemental components
import Slider from '~/components/ui/Slider';
import Range from '~/components/ui/Range';

// icons
import {
  IconRestore, IconShuffle,
  COLOR_DISABLED, COLOR_REDDISH, COLOR_WHITISH,
} from '~/components/icons/app';

// utils
import {isObject} from '~/helpers/object';
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {normalizeSpring, randomizeSpring, seasonsPropsDefault, SpringConfig} from '~/utils/seasons';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';
import type {SpringSeasonProps} from '~/utils/seasons.types';

/** Transform extended value into a selection object */
const extValueToSeason = (data: Json | boolean): SpringSeasonProps | boolean => {
  if (typeof data === 'boolean') {
    return data;
  }

  const keyRaw: string = SpringConfig?.id;
  const key: string = keyRaw.toLowerCase();

  if (!isObject(data) || (!(key in data) && !(keyRaw in data))) {
    return false;
  }

  return normalizeSpring(data[keyRaw] || data[key]);
};

/** Spring `props` type */
export interface Props {
  enabled?: boolean,
  season?: SpringSeasonProps,

  onChange?(template: string, values: SpringSeasonProps): void,
}

/** Spring functional component */
const Spring = (props: Props) => {
  props = merge({
    enabled: true,
    season: seasonsPropsDefault().spring,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [season, setSeason] = React.useState<SpringSeasonProps>(props.season as SpringSeasonProps);

  const seasonsAttribute = useAppSelector(({environment}) => environment.values?.seasons);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = seasonsAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (isObject(extValue) && Object.keys(extValue as Json).length) {
      setEnabled(true);
      setSeason(extValueToSeason(extValue as Json) as SpringSeasonProps);
    }
  }, [seasonsAttribute]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled, props.season]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), season);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return enabled ? (
      `<season id="Spring" setup_id="Spring"
				duration="${season.duration}"
				precipitation_chance="${season.precipitationChance}"
				windy_chance="${season.windyChance}"
				very_windy_chance="${season.veryWindyChance}" fish_boost="${season.fishBoost}">
					<min_temperature value="${season.minTemperatureValue}"/>
					<max_temperature value="${season.maxTemperatureValue}"/>
			</season>`
    ) : '';
  }, [season, enabled]);

  /** Update season */
  const updateValue = (name: string, value: any): void => {
    setSeason(current => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="ml-1 pt-3" style={{minHeight: 350}}>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="How long this season is, in terms of a fraction of a
						year, all season durations have to add up to 1.">
						Duration
					</span>
        </Form.Label>
        <Col sm="10">
          <code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.duration}</code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', SpringConfig.duration)}>Default</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', 0)}>%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', 0.25)}>25%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', 0.50)}>50%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', 0.75)}>75%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('duration', 1)}>100%</Button>
          <Slider
            disabled={!enabled}
            min={0} max={1} step={0.01}
            value={season.duration}
            onChange={v => updateValue('duration', v)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="How likely it is to rain/snow in this season.">
						Precipitation Chance
					</span>
        </Form.Label>
        <Col sm="10">
          <code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.precipitationChance}</code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', SpringConfig.precipitation_chance)}>Default</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', 0)}>0%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', 0.25)}>25%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', 0.50)}>50%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', 0.75)}>75%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('precipitationChance', 1)}>100%</Button>
          <Slider
            disabled={!enabled}
            min={0} max={1} step={0.01}
            value={season.precipitationChance}
            onChange={v => updateValue('precipitationChance', v)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="How likely it is for it to be windy in this season.">
						Windy Chance
					</span>
        </Form.Label>
        <Col sm="10">
          <code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.windyChance}</code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', SpringConfig.windy_chance)}>Default</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', 0.0)}>0%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', 0.25)}>25%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', 0.50)}>50%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', 0.75)}>75%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('windyChance', 1.0)}>100%</Button>
          <Slider
            disabled={!enabled}
            min={0} max={1} step={0.01}
            value={season.windyChance}
            onChange={v => updateValue('windyChance', v)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="How likely it is for it to be very windy in this season.">
						Very Windy Chance
					</span>
        </Form.Label>
        <Col sm="10">
          <code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.veryWindyChance}</code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', SpringConfig.very_windy_chance)}>Default</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', 0)}>0%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', 0.25)}>25%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', 0.50)}>50%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', 0.75)}>75%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('veryWindyChance', 1)}>100%</Button>
          <Slider
            disabled={!enabled}
            min={0} max={1} step={0.01}
            value={season.veryWindyChance}
            onChange={n => updateValue('veryWindyChance', n)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="Fish in banks will replenish by this amount at the beginning of this season.">
						Fish Boost
					</span>
        </Form.Label>
        <Col sm="10">
          <code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.fishBoost}</code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', SpringConfig.fish_boost)}>Default</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', 0)}>0%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', 0.25)}>25%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', 0.50)}>50%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', 0.75)}>75%</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => updateValue('fishBoost', 1)}>100%</Button>
          <Slider
            disabled={!enabled}
            min={0} max={1} step={0.01}
            value={season.fishBoost}
            onChange={n => updateValue('fishBoost', n)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
                title="Temperature will randomly oscillate between these 2 values (in Celsius)">
						Temperature
					</span>
        </Form.Label>
        <Col sm="10">
					<span className="text-size-xs font-family-code">
						Min: <code className={cn({'text-muted': !enabled})}>{season.minTemperatureValue}°</code>
            {' / '}
            Max: <code className={cn({'text-muted': !enabled})}>{season.maxTemperatureValue}°</code>
					</span>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    const [min, max] = random.randomSeasonTemperature();
                    updateValue('minTemperatureValue', min);
                    updateValue('maxTemperatureValue', max);
                  }}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    updateValue('minTemperatureValue', SpringConfig.min_temperature.value);
                    updateValue('maxTemperatureValue', SpringConfig.max_temperature.value);
                  }}>Default</Button>
          <Range
            min={Defaults.SEASON_TEMPERATURE_MIN}
            max={Defaults.SEASON_TEMPERATURE_MAX}
            disabled={!enabled}
            step={0}
            value={[season.minTemperatureValue as number, season.maxTemperatureValue as number]}
            onChange={value => {
              const [min, max] = value as number[];
              updateValue('minTemperatureValue', min);
              updateValue('maxTemperatureValue', max);
            }}/>
        </Col>
      </Form.Group>
      <div className="mt-3">
        <ButtonGroup>
          <Button
           disabled={!enabled} variant="link"
           style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 ml-0 mr-3" size="sm"
            onClick={() => setSeason(randomizeSpring())}>
            <IconShuffle width="14" height="14"/> Randomize
          </Button>
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_REDDISH}}
            className="text-size-sm button-reset-sm p-0 ml-0 mr-3" size="sm"
            onClick={() => setSeason(seasonsPropsDefault().spring as SpringSeasonProps)}>
            <IconRestore width="14" height="14"/> Restore
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

// Properties validation
Spring.propTypes = {
  enabled: PropTypes.bool,
  season: PropTypes.shape({
    duration: PropTypes.number,
    precipitationChance: PropTypes.number,
    windyChance: PropTypes.number,
    veryWindyChance: PropTypes.number,
    fishBoost: PropTypes.number,
    minTemperatureValue: PropTypes.number,
    maxTemperatureValue: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default Spring;
