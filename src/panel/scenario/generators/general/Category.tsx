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
import {toCategoryTemplate} from '~/utils/parser/templates-general';

/** Category `props` type */
interface Props {
  enabled?: boolean,
  value?: string,

  onChange?(template: string, value: string): void,
}

/** Category functional component */
const Category = (props: Props) => {
  props = merge({
    value: 'Freeplay',
    enabled: false,
    onChange: () => {
    },
  }, props);

  const [value, setValue] = React.useState<string>(props.value as string);
  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

  const categoryAttribute = useAppSelector(({scenario}) => scenario?.values?.category);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = categoryAttribute ?? null;

    if (!extValue) {
      setEnabled(!!extValue);
    } else {
      setValue(extValue as string);
    }
  }, [categoryAttribute]);

  // Reflect attributes changes
  React.useEffect(() => {
    setEnabled(props.enabled as boolean);
  }, [props.enabled]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toCategoryTemplate(value, enabled), value,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <PanelToolbar
        checked={enabled}
        heading="Category"
        checkboxPosition="right"
        description="Defines the category for the scenario."
        onCheckboxChange={state => setEnabled(state)}
        value=""
        disabled={!enabled}/>
      <div className="w-75">
        <TextInput
          caseType="CAPITAL_CASE"
          disabled={!enabled}
          value={value}
          maxLength={80}
          placeholder="e.g., Freeplay"
          onChange={theValue => setValue(theValue as string)}/>
      </div>
    </div>
  );
};

// Properties validation
Category.propTypes = {
  value: PropTypes.string,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Category;
