// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';
import {ButtonGroup} from 'react-bootstrap';

// elemental components
import Range from '~/components/ui/Range';
import Slider from '~/components/ui/Slider';
import LinkButton from '~/components/ui/LinkButton';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';

// components
import SeasonAttributeSlider from './elements/SeasonAttributeSlider';

// icons
import {
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconRestore,
  IconShuffle,
} from '~/components/icons/app';

// utils
import {isObject} from '~/helpers/object';
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {temperatureNumberInputProps} from './utils/params';
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
      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.duration}
        onChange={val => updateValue('duration', val)}
        allowNumberInput
        caption="Duration"
        title="How long this season is, in terms of a fraction of a
						year, all season durations have to add up to 1."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('duration', random.randomFloat())}
        onRestore={() => updateValue('duration', SpringConfig.duration)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.duration}
          onChange={v => updateValue('duration', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.precipitationChance}
        onChange={val => updateValue('precipitationChance', val)}
        allowNumberInput
        caption="Precipitation Chance"
        title="How likely it is to rain/snow in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('precipitationChance', random.randomFloat())}
        onRestore={() => updateValue('precipitationChance', SpringConfig.precipitation_chance)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.precipitationChance}
          onChange={v => updateValue('precipitationChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.windyChance}
        onChange={val => updateValue('windyChance', val)}
        allowNumberInput
        caption="Windy Chance"
        title="How likely it is for it to be windy in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('windyChance', random.randomFloat())}
        onRestore={() => updateValue('windyChance', SpringConfig.windy_chance)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.windyChance}
          onChange={v => updateValue('windyChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.veryWindyChance}
        onChange={val => updateValue('veryWindyChance', val)}
        allowNumberInput
        caption="Very Windy Chance"
        title="How likely it is for it to be very windy in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('veryWindyChance', random.randomFloat())}
        onRestore={() => updateValue('veryWindyChance', SpringConfig.very_windy_chance)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.veryWindyChance}
          onChange={v => updateValue('veryWindyChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.fishBoost}
        onChange={val => updateValue('fishBoost', val)}
        allowNumberInput
        caption="Fish Boost"
        title="Fish in banks will replenish by this amount at the beginning of this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('fishBoost', random.randomFloat())}
        onRestore={() => updateValue('fishBoost', SpringConfig.fish_boost)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.fishBoost}
          onChange={v => updateValue('fishBoost', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        value={season.fishBoost}
        onChange={val => updateValue('fishBoost', val)}
        allowNumberInput
        caption="Fish Boost"
        title="Fish in banks will replenish by this amount at the beginning of this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => updateValue('fishBoost', random.randomFloat())}
        onRestore={() => updateValue('fishBoost', SpringConfig.fish_boost)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.fishBoost}
          onChange={v => updateValue('fishBoost', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        displayValue={() => (
          <>
            <PopoverNumberInput
              {...temperatureNumberInputProps(enabled)}
              min={Defaults.SEASON_TEMPERATURE_MIN}
              max={0}
              formatValue={value => <>{value}°</>}
              value={season.minTemperatureValue as number}
              onSave={value => updateValue('minTemperatureValue', value)}/>
            <strong style={{marginRight: 5, marginLeft: 3, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...temperatureNumberInputProps(enabled)}
              min={1}
              max={Defaults.SEASON_TEMPERATURE_MAX}
              formatValue={value => <>{value}°</>}
              value={season.maxTemperatureValue as number}
              onSave={value => updateValue('maxTemperatureValue', value)}/>
          </>
        )}
        caption="Temperature"
        title="Temperature will randomly oscillate between these 2 values (in Celsius)"
        allowRestore allowShuffle
        onShuffle={() => {
          const [min, max] = random.randomSeasonTemperature();
          updateValue('minTemperatureValue', min);
          updateValue('maxTemperatureValue', max);
        }}
        onRestore={() => {
          updateValue('minTemperatureValue', SpringConfig.min_temperature.value);
          updateValue('maxTemperatureValue', SpringConfig.max_temperature.value);
        }}>
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
      </SeasonAttributeSlider>

      <div className="mt-3 text-right">
        <ButtonGroup>
          <LinkButton
            title="Randomize season parameters"
            disabled={!enabled}
            style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH, fontSize: '.716rem'}}
            className="p-0 ml-0 mr-2"
            onClick={() => setSeason(randomizeSpring())}>
            <IconShuffle width="14" height="14"/> Randomize
          </LinkButton>
          <LinkButton
            title="Restore season parameters to their default"
            disabled={!enabled}
            style={{color: !enabled ? COLOR_DISABLED : COLOR_REDDISH, fontSize: '.718rem'}}
            className="p-0 ml-0"
            onClick={() => setSeason(seasonsPropsDefault().spring as SpringSeasonProps)}>
            <IconRestore width="14" height="14" color={!props?.enabled ? COLOR_DISABLED : COLOR_ORANGE}/> Restore
          </LinkButton>
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
