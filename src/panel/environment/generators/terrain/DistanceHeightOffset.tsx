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
import {Button, Card, Col, Form, Row} from 'react-bootstrap';

// components
import Slider from '~/components/ui/Slider';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils//defaults';

// redux
import {useAppSelector} from '~redux/hooks';

/**
 * DistanceHeightOffset `props` type
 */
export interface Props {
  enabled?: boolean;
  distance?: number;

  onChange?(template: string, value: number): void;
}

/** DistanceHeightOffset functional component */
const DistanceHeightOffset = (props: Props) => {
  props = merge({
    enabled: false,
    distance: random.randomFloat(),
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [distance, setDistance] = React.useState<number>(props.distance as number);

  const environment = useAppSelector(({environment}) => (environment));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = environment?.distanceHeightOffset ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (typeof extValue === 'number') {
      setEnabled(true);
      setDistance(extValue);
    }
  }, [environment]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return enabled
      ? `<distance_height_offset value="${distance}"/>`
      : '';
  }, [distance, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <Row className="mb-1">
        <Col xs="10">
          Distance Height Offset <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
          {distance}
        </code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setDistance(random.randomFloat())}>
            Random
          </Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_MIN)}>Min</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_MAX)}>Max</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setDistance(Defaults.DISTANCE_HEIGHT_OFFSET_DEFAULT)}>Reset</Button>
          <div className="text-size-xxs text-muted mt-1">
            How much bigger are mountains at the edge of map.
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`river-switch-${nanoid(5)}`}
            label=""
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </Col>
      </Row>
      <Slider
        min={Defaults.DISTANCE_HEIGHT_OFFSET_MIN}
        max={Defaults.DISTANCE_HEIGHT_OFFSET_MAX}
        step={0.01} disabled={!enabled}
        value={Number(distance)} onChange={v => setDistance(v as number)}/>
    </div>
  );
};

// Default properties
DistanceHeightOffset.propTypes = {
  enabled: PropTypes.bool,
  distance: PropTypes.number,
  onChange: PropTypes.func,
};

export default DistanceHeightOffset;