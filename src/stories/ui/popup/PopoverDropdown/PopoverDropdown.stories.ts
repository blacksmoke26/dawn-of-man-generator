/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

import {fn} from '@storybook/test';

// components
import {PopoverDropdown} from './PopoverDropdown';

// types
import type {Meta, StoryObj} from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/Popup/PopoverDropdown',
  component: PopoverDropdown,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['!autodocs', 'ui'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    //backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {onSelect: fn()},
} satisfies Meta<typeof PopoverDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const options =[{
  label: 'Do not wrap',
  value: 'do_not_wrap',
}, {
  label: 'Wrap if long',
  value: 'wrap_if_long',
}, {
  label: 'Wrap always',
  value: 'wrap_always',
}]

export const Default: Story = {
  args: {
    options,
  },
};
