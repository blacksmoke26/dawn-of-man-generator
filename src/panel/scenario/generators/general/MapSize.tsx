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
import {Button, Col, Form, Row} from 'react-bootstrap';

// Components
import Slider from '~/components/ui/Slider';

// Utils
import * as random from '~/utils/scenario/random';
import * as Defaults from '~/utils/scenario/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toSizeTemplate} from '~/utils/parser/templates-general';

/** MapSize `props` type */
interface Props {
  enabled?: boolean,
  value?: number,

  onChange?(template: string, value: number): void,
}

/** MapSize functional component */
const MapSize = (props: Props) => {
  props = merge({
    enabled: true,
    value: Defaults.MAP_SIZE_DEFAULT,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [value, setValue] = React.useState<number>(props.value as number);

  const sizeAttribute = useAppSelector(({scenario}) => scenario.values?.size);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = sizeAttribute ?? null;

    // noinspection SuspiciousTypeOfGuard
    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (typeof extValue === 'number') {
      setEnabled(true);
      setValue(extValue);
    }
  }, [sizeAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toSizeTemplate(value, enabled), value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <Row className="mb-1">
        <Col xs="10">
          Map size <code className={cn('text-size-xs', {'text-muted': !enabled})}>
          {value}
        </code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setValue(random.randomMapSize())}>
            Random
          </Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setValue(Defaults.MAP_SIZE_DEFAULT)}>Default</Button>
          <div className="text-size-xxs text-muted mt-1">
            Defines the size of the map, beware that big maps can drain performance.
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`size-switch-${nanoid(5)}`}
            label=""
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </Col>
      </Row>
      <Slider
        min={Defaults.MAP_SIZE_MIN}
        max={Defaults.MAP_SIZE_MAX}
        step={1} disabled={!enabled}
        value={Number(value)} onChange={v => setValue(v as number)}/>
    </div>
  );
};

// Properties validation
MapSize.propTypes = {
  enabled: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default MapSize;
