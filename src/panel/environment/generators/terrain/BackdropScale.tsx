/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';
import * as PropTypes from 'prop-types';
import {Button, Col, Form, Row} from 'react-bootstrap';

// components
import Slider from '~/components/ui/Slider';

// types
import {Json} from '~/types/json.types';

// utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';

/**
 * BackdropScale `props` type
 */
export interface Props {
  enabled?: boolean;
  angle1?: number;
  angle2?: number;
  angle3?: number;

  onChange?(template: string, values?: Json): void;
}

/** Default values */
const defaultValues: { angle3: number; angle1: number; angle2: number } = {
  angle1: 1.0,
  angle2: 0.25,
  angle3: 1.0,
};

/** BackdropScale functional component */
const BackdropScale = (props: Props) => {
  props = merge({
    enabled: false,
    ...defaultValues,
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);
  const [angle1, setAngle1] = React.useState<number | string>(props.angle1 as number);
  const [angle2, setAngle2] = React.useState<number | string>(props.angle2 as number);
  const [angle3, setAngle3] = React.useState<number | string>(props.angle3 as number);

  const environment = useAppSelector(({environment}) => (environment));

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = environment?.backdropScale ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }

    if (Array.isArray(extValue)) {
      setEnabled(true);
      setAngle1(extValue[0]);
      setAngle2(extValue[1]);
      setAngle3(extValue[2]);
    }
  }, [environment]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), {angle1, angle2, angle3});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, angle1, angle2, angle3]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    return enabled
      ? `<backdrop_scale value="${angle1}, ${angle2}, ${angle3}"/>`
      : '';
  }, [enabled, angle1, angle2, angle3]);

  return (
    <div className={cn('mb-2', {'text-muted': !enabled})}>
      <Row className="mb-1">
        <Col xs="10" className={cn({'text-muted': !enabled})}>
          Backdrop Scale <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
          {angle1}, {angle2}, {angle3}
        </code>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    const rand = random.randomBackdropScale();
                    setAngle1(rand[0]);
                    setAngle2(rand[1]);
                    setAngle3(rand[2]);
                  }}>
            Random
          </Button>
          <Button disabled={!enabled} className="button-reset-sm" variant="link"
                  onClick={() => {
                    setAngle1(defaultValues.angle1);
                    setAngle2(defaultValues.angle2);
                    setAngle3(defaultValues.angle3);
                  }}>Reset</Button>
          <div className="text-size-xxs text-muted mt-1">
            Change the size of backdrops (the mountains you see beyond the map).
          </div>
        </Col>
        <Col xs="2" className="text-right">
          <Form.Check
            className="pull-right"
            type="switch"
            id={`backdrop_scale-switch-${nanoid(5)}`}
            label=""
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
        </Col>
      </Row>
      <div className="mb-2">
        <Slider disabled={!enabled} step={0.01} value={Number(angle1)}
                onChange={v => setAngle1(v as number)}/>
      </div>
      <div className="mb-2">
        <Slider disabled={!enabled} step={0.01} value={Number(angle2)}
                onChange={v => setAngle2(v as number)}/>
      </div>
      <div className="mb-2">
        <Slider disabled={!enabled} step={0.01} value={Number(angle3)}
                onChange={v => setAngle3(v as number)}/>
      </div>
    </div>
  );
};

// Default properties
BackdropScale.propTypes = {
  enabled: PropTypes.bool,
  angle1: PropTypes.number,
  angle2: PropTypes.number,
  angle3: PropTypes.number,
  onChange: PropTypes.func,
};

export default BackdropScale;
