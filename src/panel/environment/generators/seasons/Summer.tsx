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

// types
import type {Json} from '~/types/json.types';
import type {SummerSeasonProps} from '~/utils/seasons.types';

// components
import Slider from '~/components/ui/Slider';
import Range from '~/components/ui/Range';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {isObject} from '~/helpers/object';
import {normalizeSummer, randomizeSummer, seasonsPropsDefault, SummerConfig} from '~/utils/seasons';

// redux
import {useAppSelector} from '~redux/hooks';

/** Transform extended value into a selection object */
const extValueToSeason = (data: Json | boolean): SummerSeasonProps | boolean => {
  if (typeof data === 'boolean') {
    return data;
  }

  const keyRaw: string = SummerConfig?.id;
  const key: string = keyRaw.toLowerCase();

  if (!isObject(data) || (!(key in data) && !(keyRaw in data))) {
    return false;
  }

  return normalizeSummer(data[keyRaw] || data[key]);
};

/** Summer `props` type */
export interface Props {
  enabled?: boolean,
  season?: SummerSeasonProps,

  onChange?(template: string, values: SummerSeasonProps): void,
}

/** Summer functional component */
const Summer = (props: Props) => {
  props = merge({
    enabled: true,
    season: seasonsPropsDefault().summer,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [windEnabled, setWindEnabled] = React.useState<boolean>(false);
  const [season, setSeason] = React.useState<SummerSeasonProps>(props.season as SummerSeasonProps);

  const isWindEnabled = enabled && windEnabled;

  const environment = useAppSelector(({environment}) => (environment));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = environment?.seasons ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (isObject(extValue) && Object.keys(extValue as Json).length) {
      setEnabled(true);
      setSeason(extValueToSeason(extValue as Json) as SummerSeasonProps);
    }
  }, [environment]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled, props.season]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), season);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, enabled, isWindEnabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    const windTpl: string = isWindEnabled ? `<min_wind value="${season.minWind}" /><max_wind value="${season.maxWind}"/>` : '';
    return enabled ? (
      `<season id="Summer" setup_id="Summer"
				duration="${season.duration}"
				precipitation_chance="${season.precipitationChance}"
				windy_chance="${season.windyChance}">
				  ${windTpl}
					<min_temperature value="${season.minTemperatureValue}"/>
					<max_temperature value="${season.maxTemperatureValue}"/>
			</season>`
    ) : '';
  }, [season, enabled, isWindEnabled]);

  /** Update season */
  const updateValue = (name: string, value: any): void => {
    setSeason(current => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
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
                  onClick={() => updateValue('duration', SummerConfig.duration)}>Default</Button>
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
        <Form.Label className="text-size-sm" column={true} sm="2">
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
                  onClick={() => updateValue('precipitationChance', SummerConfig.precipitation_chance)}>Default</Button>
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
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !isWindEnabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-seasons-wind-enabled`}
            label={<span style={{textDecoration: 'underline dotted'}}
                 title="The speed of wind between a range">
              Wind:
            </span>}
            checked={windEnabled}
            onChange={e => setWindEnabled(e.target.checked)}
          />
        </Form.Label>
        <Col sm="10">
					<span className="text-size-xs font-family-code">
						Min: <code className={cn({'text-muted': !isWindEnabled})}>{season.minWind}</code>
            {' / '}
            Max: <code className={cn({'text-muted': !isWindEnabled})}>{season.maxWind}</code>
					</span>
          <Button disabled={!isWindEnabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    const [min, max] = random.randomSeasonWind();
                    updateValue('minWind', min);
                    updateValue('maxWind', max);
                  }}>Random</Button>
          <Button disabled={!isWindEnabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    updateValue('minWind', SummerConfig.min_wind);
                    updateValue('maxWind', SummerConfig.max_wind);
                  }}>Default</Button>
          <Range
            min={Defaults.SEASON_WIND_MIN}
            max={Defaults.SEASON_WIND_MAX}
            step={0}
            disabled={!isWindEnabled}
            value={[season.minWind as number, season.maxWind as number]}
            onChange={value => {
              const [min, max] = value as number[];
              updateValue('minWind', min);
              updateValue('maxWind', max);
            }}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
        <Form.Label className="text-size-sm" column={true} sm="2">
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
                  onClick={() => updateValue('windyChance', SummerConfig.windy_chance)}>Default</Button>
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
        <Form.Label className="text-size-sm" column={true} sm="2">
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
                    updateValue('minTemperatureValue', SummerConfig.min_temperature.value);
                    updateValue('maxTemperatureValue', SummerConfig.max_temperature.value);
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
          <Button disabled={!enabled} variant="secondary" size="sm"
                  onClick={() => setSeason(randomizeSummer())}>Randomize</Button>
          <Button disabled={!enabled} variant="secondary" size="sm"
                  onClick={() => setSeason(seasonsPropsDefault().summer as SummerSeasonProps)}>
            Set Defaults
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

// Properties validation
Summer.propTypes = {
  enabled: PropTypes.bool,
  season: PropTypes.shape({
    duration: PropTypes.number,
    precipitationChance: PropTypes.number,
    windyChance: PropTypes.number,
    minTemperatureValue: PropTypes.number,
    maxTemperatureValue: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default Summer;
