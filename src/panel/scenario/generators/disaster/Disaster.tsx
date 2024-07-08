/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-08
 * @version 2.5.0
 */

import React from 'react';

// elemental components
import Slider from '~/components/ui/Slider';
import LinkButton from '~/components/ui/LinkButton';

// components
import SeasonAttributeSlider from '~/panel/environment/generators/seasons/elements/SeasonAttributeSlider';

// icons
import {IconShuffle} from '~/components/icons/app';

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';

// parsers
import {toDisasterTemplate} from '~/utils/parser/templates-general';

// types
import {scenario} from '~/data/scenario/parser/types';

export interface Props {
  disabled?: boolean;
  initialValues?: scenario.Disaster;

  onValuesChange?(values: scenario.Disaster): void;

  onTemplate?(template: string): void;
}

export const Disaster = (props: Props) => {
  const valuer = useValues<scenario.Disaster>((props?.initialValues ?? {}) as scenario.Disaster);

  React.useEffect(() => {
    const changeValues = {...valuer.data};
    props?.onTemplate?.(toDisasterTemplate(changeValues, !props?.disabled));
    props?.onValuesChange?.(changeValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props?.disabled, valuer.data,
  ]);

  return (
    <div className="mt-2">
      <SeasonAttributeSlider
        disabled={props?.disabled}
        value={valuer.get('period', 0.5)}
        onChange={value => valuer.set('period', +value)}
        allowNumberInput
        caption="Period"
        title="How long this disater lasts (year)"
        allowShuffle
        numberInputProps={{
          formatValue: value => `${value}y`,
          decimals: 1,
          min: Defaults.PERIOD_MIN,
          max: Defaults.PERIOD_MAX,
          inputProps: {labelAfter: 'y'},
        }}
        onShuffle={() => valuer.get('period', +random.randomPeriod())}>
        <Slider
          disabled={props?.disabled}
          step={0.1} min={Defaults.PERIOD_MIN} max={Defaults.PERIOD_MAX}
          value={valuer.get('period', 0.5)}
          onChange={(value: any) => valuer.set('period', value)}/>
      </SeasonAttributeSlider>

      <SeasonAttributeSlider
        disabled={props?.disabled}
        value={valuer.get('variance', 0.3)}
        onChange={value => valuer.set('variance', +value)}
        allowNumberInput
        caption="Variance"
        title="How long this variance lasts (year)"
        allowShuffle
        numberInputProps={{
          formatValue: value => `${value}y`,
          decimals: 1,
          min: Defaults.PERIOD_MIN,
          max: Defaults.PERIOD_MAX,
          inputProps: {labelAfter: 'y'},
        }}
        onShuffle={() => valuer.get('variance', +random.randomPeriod())}>
        <Slider
          disabled={props?.disabled}
          step={0.1} min={Defaults.PERIOD_MIN} max={Defaults.PERIOD_MAX}
          value={valuer.get('variance', 0.5)}
          onChange={(value: any) => valuer.set('variance', value)}/>
      </SeasonAttributeSlider>
      <hr className="mt-2 mb-2"/>
      <LinkButton
        className="ml-0"
        title="Randomize all values except for the disabled ones"
        disabled={props?.disabled}
        onClick={() => {
          valuer.setAll(random.randomDisaster(valuer.get('disasterType', 'Storm')));
        }}>
        <IconShuffle/> Randomize values
      </LinkButton>
    </div>
  );
};

export default Disaster;
