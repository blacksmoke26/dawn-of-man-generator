/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Form} from 'react-bootstrap';

// elemental components
import PanelToolbar from '~/components/environment/PanelToolbar';

// utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';
import {COLOR_WHITISH} from '~/components/icons/app';

/** Deposits `props` type */
export interface Props {
  checked?: boolean,
  deposits?: Array<string>,

  onChange?(template: string, value?: Array<string>): void,
}

/** Deposits functional component */
const Deposits = (props: Props) => {
  props = merge({
    checked: false,
    deposits: random.randomDeposits(),
    onChange: () => {
    },
  }, props);

  const [checked, setChecked] = React.useState<boolean>(props.checked as boolean);
  const [deposits, setDeposits] = React.useState<string[]>(props.deposits as string[]);

  const depositsAttribute = useAppSelector(({environment}) => environment?.values?.deposits);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = depositsAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setChecked(extValue);
    } else if (Array.isArray(extValue)) {
      setChecked(true);
      setDeposits(extValue);
    }
  }, [depositsAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), deposits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposits, checked]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return checked && deposits.length
      ? `<deposits values="${deposits.join(' ')}"/>`
      : '';
  }, [deposits, checked]);

  return (
    <div className={cn('mb-2', {'text-muted': !checked})}>
      <PanelToolbar
        checked={checked}
        heading="Deposits"
        description="What types of deposit are present in the level."
        onCheckboxChange={state => setChecked(state)}
        value={(
          <>
            {!!deposits.length && <>{deposits.length}
              <strong style={{marginLeft: 3, marginRight: 3, color: COLOR_WHITISH}}>/</strong>
              <strong style={{color: COLOR_WHITISH}}>{random.deposits.length}</strong>
            </>}
          </>
        )}
        allowShuffle
        onShuffle={() => setDeposits(random.randomDeposits())}
        allowClear
        onClear={() => setDeposits([])}
        allowAll
        onAll={() => setDeposits([...random.deposits])}
        disabled={!checked}/>


      <ul className="list-unstyled list-inline mb-0 fixed-width">
        {random.deposits.map(v => (
          <li key={v} className="list-inline-item checkbox-align">
            <Form.Check
              type="switch"
              disabled={!checked}
              data-value={v}
              checked={deposits.findIndex(val => v === val) !== -1}
              id={`deposit_${v}`}
              label={v}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const list = deposits.filter(val => val !== e.target.getAttribute('data-value'));
                e.target.checked && list.push(v);
                setDeposits([...list]);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Properties validation
Deposits.propTypes = {
  checked: PropTypes.bool,
  deposits: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default Deposits;
