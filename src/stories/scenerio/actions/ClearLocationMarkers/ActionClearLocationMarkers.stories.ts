/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {ActionClearLocationMarkers} from './ActionClearLocationMarkers';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Scenario/Action Types/ClearLocationMarkers',
  component: ActionClearLocationMarkers,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['!autodocs', 'action'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    //backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {onChange: fn(), onValuesChange: fn(), onTemplate: fn()},
} satisfies Meta<typeof ActionClearLocationMarkers>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Default: Story = {
  args: {
    initialValues: {},
  },
};
