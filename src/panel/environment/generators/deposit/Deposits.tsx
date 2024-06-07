/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';
import {Card, Button, Form, Row, Col} from 'react-bootstrap';

// Utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';

/** Deposits `props` type */
export interface Props {
  enabled?: boolean,
  deposits?: Array<string>,

  onChange?(template: string, value?: Array<string>): void,
}

/** Deposits functional component */
const Deposits = (props: Props) => {
  props = merge({
    enabled: false,
    deposits: random.randomDeposits(),
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [deposits, setDeposits] = React.useState<string[]>(props.deposits as string[]);

  const environment = useAppSelector(({environment}) => (environment));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = environment?.deposits ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (Array.isArray(extValue)) {
      setEnabled(true);
      setDeposits(extValue);
    }
  }, [environment]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), deposits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposits, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return enabled && deposits.length
      ? `<deposits values="${deposits.join(' ')}"/>`
      : '';
  }, [deposits, enabled]);

  return (
    <Card className={cn('mb-2', {'text-muted': !enabled})}>
      <Card.Body>
        <Row className="mb-1">
          <Col xs="10">
            Deposits <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
            {!deposits.length ? '<None>' : deposits.join(', ')}
          </code>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => setDeposits(random.randomDeposits())}>
              Random
            </Button>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => setDeposits([...random.deposits])}>All</Button>
            <Button disabled={!enabled} className="button-reset-sm" variant="link"
                    onClick={() => setDeposits([])}>None</Button>
            <div className="text-size-xxs text-muted mt-1">
              What types of deposit are present in the level.
            </div>
          </Col>
          <Col xs="2" className="text-right">
            <Form.Check
              className="pull-right"
              type="switch"
              id={`deposit-switch-${nanoid(5)}`}
              label=""
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
          </Col>
        </Row>
        <ul className="list-unstyled list-inline mb-0 fixed-width">
          {random.deposits.map(v => (
            <li key={v} className="list-inline-item checkbox-align">
              <Form.Check
                type="switch"
                disabled={!enabled}
                data-value={v}
                checked={deposits.findIndex(val => v === val) !== -1}
                id={`deposit_${v}`}
                label={v}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const list = deposits.filter(val => val !== e.target.getAttribute('data-value'));
                  console.log({list});
                  e.target.checked && list.push(v);
                  setDeposits([...list]);
                }}
              />
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

// Properties validation
Deposits.propTypes = {
  enabled: PropTypes.bool,
  deposits: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default Deposits;
