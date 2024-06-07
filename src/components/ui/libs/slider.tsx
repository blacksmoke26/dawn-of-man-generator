import Tooltip from 'rc-tooltip';
import React from 'react';

export const defaultProps = {
  step: 0.001,
  min: 0,
  max: 1
};

export const toPoints = (value: number): number => Number(value) || 0;

export const handleRender = (renderProps: any, data: any) => {
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={toPoints(data.value)}
      visible={data.dragging}
      placement="top"
      key={data.index}
    >
      <div {...renderProps.props}></div>
    </Tooltip>
  );
};
