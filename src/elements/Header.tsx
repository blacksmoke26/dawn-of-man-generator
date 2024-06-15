/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

export const Header = () => {
  return (
    <h2 className="font-weight-light mb-0 text-center">
      <a href="https://store.steampowered.com/app/858810"
         target="_blank" rel="noopener noreferrer">
        Dawn of Man
      </a>
      {' - '}
      <a href="https://steamcommunity.com/app/858810/discussions/1/"
         rel="noopener noreferrer" target="_blank">
        Environment/Scenario Generator 2.1
      </a>
    </h2>
  );
};

export default Header;
