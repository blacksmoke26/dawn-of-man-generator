// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';
import {ButtonGroup, Form} from 'react-bootstrap';

// elemental components
import Range from '~/components/ui/Range';
import Slider from '~/components/ui/Slider';
import LinkButton from '~/components/ui/LinkButton';
import PopoverNumberInput from '~/components/ui/PopoverNumberInput';

// components
import SeasonAttributeSlider from './elements/SeasonAttributeSlider';

// icons
import {
  IconRestore, IconShuffle,
  COLOR_DISABLED, COLOR_REDDISH, COLOR_WHITISH, COLOR_ORANGE,
} from '~/components/icons/app';

// utils
import * as random from '~/utils/random';
import {isObject} from '~/helpers/object';
import * as Defaults from '~/utils/defaults';
import {temperatureNumberInputProps} from './utils/params';
import {normalizeWinter, randomizeWinter, seasonsPropsDefault, WinterConfig} from '~/utils/seasons';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {Json} from '~/types/json.types';
import type {WinterSeasonProps} from '~/utils/seasons.types';

/** Transform extended value into a selection object */
const extValueToSeason = (data: Json | boolean): WinterSeasonProps | boolean => {
  if (typeof data === 'boolean') {
    return data;
  }

  const keyRaw: string = WinterConfig?.id;
  const key: string = keyRaw.toLowerCase();

  if (!isObject(data) || (!(key in data) && !(keyRaw in data))) {
    return false;
  }

  return normalizeWinter(data[keyRaw] || data[key]);
};

/** Winter `props` type */
export interface Props {
  enabled?: boolean,
  season?: WinterSeasonProps,

  onChange?(template: string, values: WinterSeasonProps): void,
}

/** Winter functional component */
function Winter(props: Props) {
  props = merge({
    enabled: true,
    season: seasonsPropsDefault().winter,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState <boolean>(props.enabled as boolean);
  const [season, setSeason] = React.useState <WinterSeasonProps>(props.season as WinterSeasonProps);

  const seasonsAttribute = useAppSelector(({environment}) => environment.values?.seasons);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = seasonsAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue as boolean);
    }

    if (isObject(extValue) && Object.keys(extValue as Json).length) {
      setEnabled(true);
      setSeason(extValueToSeason(extValue as Json) as WinterSeasonProps);
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
          `<season id="Winter" setup_id="Winter"
				snow_setup_id="WinterSnow"
				duration="${season.duration}"
				precipitation_chance="${season.precipitationChance}"
				windy_chance="${season.windyChance}"
				very_windy_chance="${season.veryWindyChance}"
				reduced_fauna="${season.reducedFauna ? 'true' : 'false'}">
					<min_temperature value="${season.minTemperatureValue}"/>
					<max_temperature value="${season.maxTemperatureValue}"/>
			</season>`
        ) : '';
      }, [season, enabled],
    )
  ;

  /** Update season */
  const updateValue = (name: string, value: any): void => {
    setSeason(current => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="ml-1 pt-3" style={{minHeight: 351}}>
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
        onRestore={() => updateValue('duration', WinterConfig.duration)}>
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
        onRestore={() => updateValue('precipitationChance', WinterConfig.precipitation_chance)}>
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
        onRestore={() => updateValue('windyChance', WinterConfig.windy_chance)}>
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
        onRestore={() => updateValue('veryWindyChance', WinterConfig.very_windy_chance)}>
        <Slider
          disabled={!enabled}
          min={0} max={1} step={0.01}
          value={season.veryWindyChance}
          onChange={v => updateValue('veryWindyChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={!enabled}
        title={(
          <span
            className="cursor-default" style={{textDecoration: 'underline dotted'}}
            title="In which case the number of animals will match the min value
            defined in scenario, or not, in which case the number of animals will
            be the max value defined in scenario.">
            Define whether this season has reduced fauna or not.
          </span>
        )}
        displayValue={() => season.reducedFauna ? 'Yes' : 'No'}
        caption="Reduced Fauna"
        allowRestore allowShuffle
        onShuffle={() => updateValue('reducedFauna', random.randomArray([true, false], 1)[0])}
        onRestore={() => updateValue('reducedFauna', WinterConfig.reduced_fauna)}>
        <div className="d-inline-block position-relative" style={{top: 6}}>
          <Form.Check
            type="switch"
            disabled={!enabled}
            id={`reduced_fauna-winter}`}
            label="Reduce fauna?"
            checked={season.reducedFauna}
            onChange={e => updateValue('reducedFauna', e.target.checked)}
          />
        </div>
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
          updateValue('minTemperatureValue', WinterConfig.min_temperature.value);
          updateValue('maxTemperatureValue', WinterConfig.max_temperature.value);
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
            onClick={() => setSeason(randomizeWinter())}>
            <IconShuffle width="14" height="14"/> Randomize
          </LinkButton>
          <LinkButton
            title="Restore season parameters to their default"
            disabled={!enabled}
            style={{color: !enabled ? COLOR_DISABLED : COLOR_REDDISH, fontSize: '.718rem'}}
            className="p-0 ml-0"
            onClick={() => setSeason(seasonsPropsDefault().winter as WinterSeasonProps)}>
            <IconRestore width="14" height="14" color={!props?.enabled ? COLOR_DISABLED : COLOR_ORANGE}/> Restore
          </LinkButton>
        </ButtonGroup>
      </div>
    </div>
  );
}

// Properties validation
Winter.propTypes = {
  enabled: PropTypes.bool,
  season: PropTypes.shape({
    duration: PropTypes.number,
    precipitationChance: PropTypes.number,
    windyChance: PropTypes.number,
    veryWindyChance: PropTypes.number,
    reducedFauna: PropTypes.bool,
    minTemperatureValue: PropTypes.number,
    maxTemperatureValue: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default Winter;
