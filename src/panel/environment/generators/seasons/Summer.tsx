// noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
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
  COLOR_DISABLED,
  COLOR_ORANGE,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconRestore,
  IconShuffle,
} from '~/components/icons/app';

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import {isObject} from '~/helpers/object';
import * as Defaults from '~/utils/defaults';
import {invokeHandler} from '~/utils/callback';
import {temperatureNumberInputProps} from './utils/params';

// parsers
import {toSeasonSummerTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {environment} from '~/data/environments/parser/types';

/** Summer `props` type */
export interface SummerProps {
  disabled?: boolean,

  onValuesChange?(values: environment.SummerSeason): void,

  onTemplate?(template: string): void,
}

const DEFAULT_VALUES = Defaults.SEASONS_DEFAULT.Summer;

/** Summer functional component */
const Summer = (props: SummerProps) => {
  const valuer = useValues<environment.SummerSeason>(DEFAULT_VALUES);

  const [disabled, setDisabled] = React.useState<boolean>(props?.disabled ?? false);
  const [windEnabled, setWindEnabled] = React.useState<boolean>(false);

  const reduxState = useAppSelector(({environment}) => environment?.values?.seasons) as environment.Seasons;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setDisabled(true);
      setWindEnabled(false);
      valuer.setAll(DEFAULT_VALUES);
    } else if (isObject(reduxState?.Summer)) {
      setDisabled(false);
      setWindEnabled(false);
      Array.isArray(reduxState?.Summer?.wind) && setWindEnabled(true);
      valuer.setAll({...reduxState?.Summer});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect attributes changes
  React.useEffect(() => {
    setDisabled(props.disabled as boolean);
  }, [props?.disabled]);

  // Reflect state changes
  React.useEffect(() => {
    const changedValues = {...valuer.data};

    !windEnabled && delete changedValues.wind;

    invokeHandler(props, 'onValuesChange', changedValues);
    invokeHandler(props, 'onTemplate', toSeasonSummerTemplate(changedValues, disabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuer.data, disabled, windEnabled]);

  return (
    <div className="ml-1 pt-3" style={{minHeight: 351}}>
      <SeasonAttributeSlider
        disabled={disabled}
        value={valuer.data.duration}
        onChange={val => valuer.set('duration', val)}
        allowNumberInput
        caption="Duration"
        title="How long this season is, in terms of a fraction of a
						year, all season durations have to add up to 1."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => valuer.set('duration', random.randomSeasonDuration())}
        onRestore={() => valuer.set('duration', DEFAULT_VALUES.duration)}>
        <Slider
          disabled={disabled}
          min={Defaults.SEASON_DURATION_MIN} max={Defaults.SEASON_DURATION_MAX}
          step={0.01} value={valuer.data.duration}
          onChange={v => valuer.set('duration', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={disabled}
        value={valuer.data.precipitationChance}
        onChange={val => valuer.set('precipitationChance', val)}
        allowNumberInput
        caption="Precipitation Chance"
        title="How likely it is to rain/snow in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => valuer.set('precipitationChance', random.randomSeasonPrecipitationChance())}
        onRestore={() => valuer.set('precipitationChance', DEFAULT_VALUES.precipitationChance)}>
        <Slider
          disabled={disabled}
          min={Defaults.SEASON_PRECIPITATION_CHANCE_MIN} max={Defaults.SEASON_PRECIPITATION_CHANCE_MAX}
          step={0.01} value={valuer.data.precipitationChance}
          onChange={v => valuer.set('precipitationChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={disabled || !windEnabled}
        displayValue={() => (
          <>
            <PopoverNumberInput
              {...temperatureNumberInputProps(!disabled)}
              min={Defaults.SEASON_WIND_MIN}
              max={25}
              value={valuer.get<number>('wind.0', DEFAULT_VALUES.wind?.[0] as number)}
              onSave={value => valuer.set('wind.0', value)}/>
            <strong style={{marginRight: 5, marginLeft: 3, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...temperatureNumberInputProps(!disabled)}
              min={26}
              max={Defaults.SEASON_WIND_MAX}
              value={valuer.get<number>('wind.1', DEFAULT_VALUES.wind?.[1] as number)}
              onSave={value => valuer.set('wind.1', value)}/>
          </>
        )}
        caption={(
          <Form.Check
            disabled={disabled}
            className="text-size-xs"
            type="switch"
            id={`switch-seasons-wind-enabled`}
            label="Wind Speed"
            checked={windEnabled}
            onChange={e => setWindEnabled(e.target.checked)}
          />
        )}
        title="The speed of wind between a range"
        allowRestore allowShuffle
        onShuffle={() => {
          valuer.overwrite('wind', random.randomSeasonWind());
        }}
        onRestore={() => {
          valuer.overwrite('wind', DEFAULT_VALUES.wind);
        }}>
        <Range
          min={Defaults.SEASON_WIND_MIN}
          max={Defaults.SEASON_WIND_MAX}
          step={0}
          disabled={!windEnabled}
          value={valuer.get('wind', DEFAULT_VALUES.wind)}
          onChange={value => {
            valuer.overwrite('wind', value as number[]);
          }}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={disabled}
        value={valuer.data.windyChance}
        onChange={val => valuer.set('windyChance', val)}
        allowNumberInput
        caption="Windy Chance"
        title="How likely it is for it to be windy in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => valuer.set('windyChance', random.randomSeasonWindyChance())}
        onRestore={() => valuer.set('windyChance', DEFAULT_VALUES.windyChance)}>
        <Slider
          disabled={disabled}
          min={Defaults.SEASON_WINDY_CHANCE_MIN} max={Defaults.SEASON_WINDY_CHANCE_MAX}
          step={0.01} value={valuer.data.windyChance}
          onChange={v => valuer.set('windyChance', v)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={disabled}
        displayValue={() => (
          <>
            <PopoverNumberInput
              {...temperatureNumberInputProps(!disabled)}
              min={Defaults.SEASON_TEMPERATURE_MIN}
              max={Defaults.SEASON_TEMPERATURE_MAX}
              formatValue={value => <>{value}°</>}
              value={valuer.data.temperature[0]}
              onSave={value => {
                const maxValue = valuer.data.temperature[1] as number;
                valuer.set('temperature.0', value > maxValue ? maxValue : value);
              }}/>
            <strong style={{marginRight: 5, marginLeft: 3, color: COLOR_WHITISH}}>,</strong>
            <PopoverNumberInput
              {...temperatureNumberInputProps(!disabled)}
              min={Defaults.SEASON_TEMPERATURE_MIN}
              max={Defaults.SEASON_TEMPERATURE_MAX}
              formatValue={value => <>{value}°</>}
              value={valuer.data.temperature[1]}
              onSave={value => {
                const minValue = valuer.data.temperature[0] as number;
                valuer.set('temperature.1', value < minValue ? minValue : value);
              }}/>
          </>
        )}
        caption="Temperature"
        title="Temperature will randomly oscillate between these 2 values (in Celsius)"
        allowRestore allowShuffle
        onShuffle={() => {
          valuer.overwrite('temperature', random.randomSeasonTemperature());
        }}
        onRestore={() => {
          valuer.overwrite('temperature', DEFAULT_VALUES.temperature);
        }}>
        <Range
          min={Defaults.SEASON_TEMPERATURE_MIN}
          max={Defaults.SEASON_TEMPERATURE_MAX}
          disabled={disabled}
          step={0}
          value={valuer.data.temperature}
          onChange={value => {
            valuer.overwrite('temperature', value as number[]);
          }}/>
      </SeasonAttributeSlider>

      <div className="mt-3 text-right">
        <ButtonGroup>
          <LinkButton
            title="Randomize season parameters"
            disabled={disabled}
            style={{color: disabled ? COLOR_DISABLED : COLOR_WHITISH, fontSize: '.716rem'}}
            className="p-0 ml-0 mr-2"
            onClick={() => {
              const values = random.randomSeasonSummer();
              !windEnabled && (values.wind = valuer.data.wind);

              valuer.setAll(values);
            }}>
            <IconShuffle width="14" height="14"/> Randomize
          </LinkButton>
          <LinkButton
            title="Restore season parameters to their default"
            disabled={disabled}
            style={{color: disabled ? COLOR_DISABLED : COLOR_REDDISH, fontSize: '.718rem'}}
            className="p-0 ml-0"
            onClick={() => valuer.setAll(DEFAULT_VALUES)}>
            <IconRestore width="14" height="14" color={props?.disabled ? COLOR_DISABLED : COLOR_ORANGE}/> Restore
          </LinkButton>
        </ButtonGroup>
      </div>
    </div>
  );
};

// Properties validation
Summer.propTypes = {
  disabled: PropTypes.bool,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default Summer;
