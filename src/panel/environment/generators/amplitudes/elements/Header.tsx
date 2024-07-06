/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-06
 * @version 2.5.0
 */

import React from 'react';
import {nanoid} from 'nanoid';
import {Form} from 'react-bootstrap';

export const Header = (props: { checked: boolean, onChange(state: boolean): void }) => {
  return (
    <div className="text-size-xxs text-muted mb-1">
      Modify the amplitudes of the different noise layers, the initial numbers
      define the amplitudes of the low-frequencies (the height of large mountains), and the later
      numbers define the amplitudes of the high_frequencies (the height of the small bumps).
      <p className="mt-1">
        For a complete guide: {' '}
        <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=2087224377"
          target="_blank" rel="noopener noreferrer"
          title="This guide explains how the <noise_amplitude> element works in Environment
         configuration files. It will help build your intuition for how amplitudes
         influence one another so you can more quickly achieve the results you're
         looking for.">
          Understanding Amplitudes in Environment
        </a>.
      </p>
      <div className="mt-2 mb-2">
        <Form>
          <Form.Switch
            className="pull-right"
            id={`switch-${nanoid(5)}`}
            label="Override noise amplitudes parameters"
            checked={props.checked}
            onChange={(e: any) => props.onChange(e.target.checked)}
          />
        </Form>
      </div>
    </div>
  )
};

export default Header;
