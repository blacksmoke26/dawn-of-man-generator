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
import {toLoadingScreenTemplate} from '~/utils/parser/templates-general';

/** LoadingScreen `props` type */
interface Props {
  disabled?: boolean,
  initialValues?: {
    value: string;
  };

  onChange?(template: string): void;
}

/** LoadingScreen functional component */
const LoadingScreen = (props: Props) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<string>(props?.initialValues?.value ?? 'map_the_northlands');
  const [checked, setChecked] = React.useState<boolean>(!(props?.disabled ?? true));

  const reduxState = useAppSelector(({scenario}) => scenario?.values?.loadingScreens) as null | string | undefined;

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setChecked(false);
      setValue('map_the_northlands');
      dispatch(clearProperty('loadingScreens'));
    } else if ('string' === typeof reduxState) {
      setChecked(true);
      setValue(reduxState);
      dispatch(clearProperty('loadingScreens'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    props?.onChange?.(toLoadingScreenTemplate(value, checked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, checked]);

  return (
    <div className={cn('mb-2 checkbox-align', {'text-muted-deep': !checked})}>
      <PanelToolbar
        checked={checked}
        heading="Loading Screens"
        checkboxPosition="right"
        description="Referees to the loading screen images"
        onCheckboxChange={isChecked => setChecked(isChecked)}
        value=""
        disabled={!checked}/>
      <div className="w-75">
        <TextInput
          caseType="SNAKE_CASE"
          disabled={!checked}
          value={value}
          maxLength={100}
          placeholder="e.g., map_the_northlands"
          onChange={changedValue => setValue(String(changedValue))}/>
      </div>
    </div>
  );
};

// Properties validation
LoadingScreen.propTypes = {
  disabled: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default LoadingScreen;
