// @flow

import React from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

// Types
import type { Node } from 'react';
import type { CommonApiProps, SliderProps } from 'rc-slider';

type ComponentProps = CommonApiProps & SliderProps;

const Handle = Slider.Handle;

const handle = props => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={toPoints(value)}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={toPoints(value)} {...restProps} />
		</Tooltip>
	);
};

/**
 * UiSlider functional component
 */
const UiSlider = ( props: ComponentProps ): Node => {
	return (
		<Slider
			step={0.001}
			min={0}
			max={1}
			defaultValue={0}
			handle={handle}
			onChange={()=>{}}
			{...props}
		/>
	);
};

export function toPoints ( value: number ): number {
	return Number(value) || 0;
}

export const defaultProps = {
	step:0.001,
	min: 0,
	max:1,
	handle
};

export default UiSlider;
export {handle}
