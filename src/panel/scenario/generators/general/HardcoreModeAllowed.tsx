/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toHardcoreModeAllowedTemplate} from '~/utils/parser/templates-general';

/** HardcoreModeAllowed `props` type */
interface Props {
  enabled?: boolean,
  value?: boolean,

  onChange(template: string, value: boolean): void,
}

/** HardcoreModeAllowed functional component */
const HardcoreModeAllowed = (props: Props) => {
  props = merge({
    value: true,
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<boolean>(props.value as boolean);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const hardcoreModeAllowedAttribute = useAppSelector(({scenario}) => scenario?.values?.hardcoreModeAllowed);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = hardcoreModeAllowedAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
      setValue(extValue);
    }
  }, [hardcoreModeAllowedAttribute]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toHardcoreModeAllowedTemplate(value, enabled), value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
      <PanelToolbar
        checked={enabled}
        heading="Hardcore Mode"
				checkboxPosition="right"
        description="Player whether this scenario can be played in hardcore mode or not."
        onCheckboxChange={state => setEnabled(state)}
				value={<span className={cn({'text-line-through': !enabled})}>{value ? 'Yes' : 'No'}</span>}
        disabled={!enabled}/>
      <Form.Check
        type="switch"
        className="pull-right"
        disabled={!enabled}
        id={`hardcore_mode_allowed-${nanoid(5)}`}
        label="Allowed?"
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </div>
  );
};

// Properties validation
HardcoreModeAllowed.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default HardcoreModeAllowed;
