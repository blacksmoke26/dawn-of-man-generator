/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {nanoid} from 'nanoid';
import cn from 'classname';
import merge from 'deepmerge';

// Components
import Slider from '~/components/ui/Slider';

// Utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';

/**
 * SunAngleFactor `props` type
 */
export interface Props {
  enabled?: boolean;
  angle?: number;

  onChange?(template: string, value: number): void;
};

/** SunAngleFactor functional component */
const SunAngleFactor = (props: Props) => {
  props = merge({
    enabled: false,
    angle: random.randomFloat(),
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [angle, setAngle] = React.useState<number>(props.angle as number);

  const sunAngleFactorAttribute = useAppSelector(({environment}) => environment.values?.sunAngleFactor);

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = sunAngleFactorAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (typeof extValue === 'number') {
      setEnabled(true);
      setAngle(extValue);
    }
  }, [sunAngleFactorAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), angle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle, enabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return enabled
      ? `<sun_angle_factor value="${angle}"/>`
      : '';
  }, [angle, enabled]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <Row className="mb-1">
        <Col xs="10">
          Sun Angle Factor <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
          {angle}
        </code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setAngle(random.randomFloat())}>Random</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setAngle(Defaults.SUN_ANGLE_FACTOR_MIN)}>Min</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setAngle(Defaults.SUN_ANGLE_FACTOR_MAX)}>Max</Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => setAngle(Defaults.SUN_ANGLE_FACTOR_DEFAULT)}>Reset</Button>
          <div className="text-size-xxs text-muted mt-1">
            How high is the sun in the sky, 1.0 is the default.
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
        min={Defaults.SUN_ANGLE_FACTOR_MIN}
        max={Defaults.SUN_ANGLE_FACTOR_MAX}
        step={0.1} disabled={!enabled}
        value={Number(angle)} onChange={v => setAngle(v as number)}/>
    </div>
  );
};

// Default properties
SunAngleFactor.propTypes = {
  enabled: PropTypes.bool,
  angle: PropTypes.number,
  onChange: PropTypes.func,
};

export default SunAngleFactor;
