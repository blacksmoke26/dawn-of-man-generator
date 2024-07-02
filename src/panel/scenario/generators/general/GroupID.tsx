// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toGroupIDTemplate} from '~/utils/parser/templates-general';

/** GroupID `props` type */
interface Props {
  enabled?: boolean,
  value?: string,

  onChange?(template: string, value: string): void,
}

/** GroupID functional component */
const GroupID = (props: Props) => {
  props = merge({
    value: 'bygone_tales',
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<string>(props.value as string);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const groupIdAttribute = useAppSelector(({scenario}) => scenario.values?.groupId);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = groupIdAttribute ?? null;

    if (!extValue) {
      setEnabled(!!extValue);
    } else {
      setValue(extValue as string);
    }
  }, [groupIdAttribute]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toGroupIDTemplate(value, enabled), value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <PanelToolbar
        checked={enabled}
        heading="Group ID"
        checkboxPosition="right"
        description="Defines the group for the scenario, you can
        group several related scenarios and they will appear
        next to each other in the game UI."
        onCheckboxChange={state => setEnabled(state)}
        value=""
        disabled={!enabled}/>

      <div className="w-75">
      <TextInput
        caseType="SNAKE_CASE"
        disabled={!enabled}
        value={value}
        maxLength={80}
        placeholder="e.g., by_gone_tales"
        onChange={theValue => setValue(theValue as string)}/>
      </div>
    </div>
  );
};

// Properties validation
GroupID.propTypes = {
  value: PropTypes.string,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default GroupID;
