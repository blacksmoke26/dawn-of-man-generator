/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
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

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {invokeHandler} from '~/utils/callback';
import {randomSeasonFall} from '~/utils/random';
import {cloneObject, isObject} from '~/helpers/object';
import {SeasonsDefault} from '~/utils/randomizer/seasons';
import {temperatureNumberInputProps} from './utils/params';

// parsers
import {toSeasonFallTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {environment} from '~/data/environments/parser/types';

/** Fall `props` type */
interface Props {
  disabled?: boolean,

  onValuesChange?(values: environment.season.Fall): void,

  onTemplate?(template: string): void,
}

const DEFAULT_VALUES = cloneObject(SeasonsDefault.Fall);

/** Fall functional component */
const Fall = (props: Props) => {
  const [disabled, setDisabled] = React.useState<boolean>(props?.disabled ?? false);
  const valuer = useValues<environment.season.Fall>({...SeasonsDefault.Fall});

  const reduxState = useAppSelector(({environment}) => environment?.values?.seasons) as environment.season.Seasons;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setDisabled(true);
      valuer.setAll(DEFAULT_VALUES);
    } else if (isObject(reduxState?.Fall)) {
      setDisabled(false)
      valuer.setAll(cloneObject(reduxState?.Fall));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect attributes changes
  React.useEffect(() => {
    setDisabled(props.disabled as boolean);
  }, [props?.disabled]);

  // Reflect state changes
  React.useEffect(() => {
    invokeHandler(props, 'onValuesChange', valuer.data);
    invokeHandler(props, 'onTemplate', toSeasonFallTemplate(valuer.data, disabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuer.data, disabled]);

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
        value={valuer.data.veryWindyChance}
        onChange={val => valuer.set('veryWindyChance', val)}
        allowNumberInput
        caption="Very Windy Chance"
        title="How likely it is for it to be very windy in this season."
        allowRestore allowShuffle allowMin allowMax
        onShuffle={() => valuer.set('veryWindyChance', random.randomSeasonVeryWindyChance())}
        onRestore={() => valuer.set('veryWindyChance', DEFAULT_VALUES.veryWindyChance)}>
        <Slider
          disabled={disabled}
          min={Defaults.SEASON_VERY_WINDY_CHANCE_MIN} max={Defaults.SEASON_VERY_WINDY_CHANCE_MAX}
          step={0.01} value={valuer.data.veryWindyChance}
          onChange={v => valuer.set('veryWindyChance', v)}/>
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
            onClick={() => valuer.setAll(randomSeasonFall())}>
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
Fall.propTypes = {
  disabled: PropTypes.bool,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default Fall;
