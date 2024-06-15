/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-2 mb-2 text-size-xs text-center">
      Copyright &copy; 2019-{(new Date()).getFullYear()} {' '}
      <a href="https://github.com/blacksmoke26"
         rel="noopener noreferrer" target="_blank">Junaid Atari</a>
      <br/>
      <a href="https://www.nexusmods.com/dawnofman/mods/11"
         rel="noopener noreferrer" target="_blank">View on Nexus</a>
      {' - '}
      <a href="https://github.com/blacksmoke26/dawn-of-man-generator"
         rel="noopener noreferrer" target="_blank">Source on GitHub</a>
    </footer>
  );
};

export default Footer;
