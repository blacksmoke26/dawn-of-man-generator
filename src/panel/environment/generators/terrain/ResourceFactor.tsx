/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';

// elemental components
import Slider from '~/components/ui/Slider';
import PanelToolbar from '~/components/environment/PanelToolbar';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';
import {RESOURCE_FACTOR_DEFAULT} from '~/utils/defaults';

// parsers
import {toResourceFactorTemplate} from '~/utils/parser/environment/templates';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

/**
 * ResourceFactor `props` type
 */
export interface ResourceFactorProps {
  checked?: boolean;
  resource?: number;

  onChange?(template: string, value: number): void;
}

/** ResourceFactor functional component */
const ResourceFactor = (props: ResourceFactorProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.checked ?? false);
  const [resource, setResource] = React.useState<number>(props?.resource ?? random.randomResource());

  const reduxState = useAppSelector(({environment}) => environment.values?.resourceFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setResource(RESOURCE_FACTOR_DEFAULT);
      dispatch(clearProperty('resourceFactor'));
    } else if (typeof reduxState === 'number') {
      setChecked(true);
      setResource(reduxState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function'
    && props.onChange(toResourceFactorTemplate(resource, !checked), resource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        value={resource}
        checked={checked}
        checkboxPosition="right"
        heading="Resource Factor"
        description="The amount of resources in the map."
        allowNumberInput
        numberInputProps={{
          min: Defaults.RESOURCE_FACTOR_MIN,
          max: Defaults.RESOURCE_FACTOR_MAX,
          decimals: 2,
        }}
        onCheckboxChange={setChecked}
        onChange={(val: number) => setResource(+val)}
        allowShuffle
        onShuffle={() => setResource(random.randomResource(true))}
        allowMin
        onMin={() => setResource(Defaults.RESOURCE_FACTOR_MIN)}
        allowMax
        onMax={() => setResource(Defaults.RESOURCE_FACTOR_MAX)}
        allowRestore
        onRestore={() => setResource(Defaults.RESOURCE_FACTOR_DEFAULT)}
        disabled={!checked}/>
      <Slider
        step={0.01}
        min={Defaults.RESOURCE_FACTOR_MIN}
        max={Defaults.RESOURCE_FACTOR_MAX}
        disabled={!checked} value={Number(resource)}
        onChange={v => setResource(v as number)}/>
    </div>
  );
};

// Properties validation
ResourceFactor.propTypes = {
  checked: PropTypes.bool,
  resource: PropTypes.number,
  onChange: PropTypes.func,
};

export default ResourceFactor;
