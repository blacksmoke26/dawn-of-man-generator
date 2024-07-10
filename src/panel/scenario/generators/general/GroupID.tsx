// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';

// elemental components
import TextInput from '~/components/ui/TextInput';
import PanelToolbar from '~/components/environment/PanelToolbar';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/scenario/reducers';

// parsers
import {toGroupIDTemplate} from '~/utils/parser/templates-general';

/** GroupID `props` type */
interface Props {
  disabled?: boolean,
  initialValues?: {
    value: string;
  };

  onChange?(template: string): void;
}

/** GroupID functional component */
const GroupID = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<string>(props?.initialValues?.value ?? 'bygone_tales');
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario.values?.groupId) as null | string | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue('bygone_tales');
      dispatch(clearProperty('groupId'));
    } else if ('string' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('groupId'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toGroupIDTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2', {'text-muted-deep': !checked})}>
      <PanelToolbar
        checked={checked}
        heading="Group ID"
        checkboxPosition="right"
        description="Defines the group for the scenario, you can
        group several related scenarios and they will appear
        next to each other in the game UI."
        onCheckboxChange={isChecked => setChecked(isChecked)}
        value=""
        disabled={!checked}/>

      <div className="w-75">
      <TextInput
        caseType="SNAKE_CASE"
        disabled={!checked}
        value={value}
        maxLength={80}
        placeholder="e.g., by_gone_tales"
        onChange={changedValue => setValue(changedValue as string)}/>
      </div>
    </div>
  );
};

// Properties validation
GroupID.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default GroupID;
