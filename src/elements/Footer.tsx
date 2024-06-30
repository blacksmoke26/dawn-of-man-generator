/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';

// icons
import nexusIcon from '~/assets/icons/nexus.svg';
import githubIcon from '~/assets/icons/github.svg';
import linkedinIcon from '~/assets/icons/linkedin.svg';

export const Footer = () => {
  return (
    <footer className="mt-2 mb-2 text-size-xs text-center">
      <a href="https://github.com/blacksmoke26" className="text-size-sm"
         rel="noopener noreferrer" target="_blank">Junaid Atari</a>
      <span className="ml-1 mr-1" style={{color: 'rgb(235, 60, 84)', fontSize: 16}}>❤️</span>
      2019-{(new Date()).getFullYear()}
      <div className="mt-1"></div>
      <a href="https://www.nexusmods.com/dawnofman/mods/11"
         title="View on Nexus Mods"
         rel="noopener noreferrer" target="_blank">
        <img src={nexusIcon} style={{width: 25, height: 25}} alt="Nexus Mods"/>
      </a>
      <a href="https://github.com/blacksmoke26/dawn-of-man-generator"
         title="View source on Github"
         className="ml-2"
         rel="noopener noreferrer" target="_blank">
        <img src={githubIcon} style={{width: 27, height: 27}} alt="Github"/>
      </a>
      <a href="https://www.linkedin.com/in/junaid-a-1a87346a/"
         title="Reach me on LinkedIn"
         className="ml-2"
         rel="noopener noreferrer" target="_blank">
        <img src={linkedinIcon} style={{width: 25, height: 25}} alt="LinkedIn"/>
      </a>
    </footer>
  );
};

export default Footer;
