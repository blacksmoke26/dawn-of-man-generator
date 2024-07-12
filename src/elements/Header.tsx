/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import nexusIcon from '~/assets/icons/nexus.svg';
import githubIcon from '~/assets/icons/github.svg';
import linkedinIcon from '~/assets/icons/linkedin.svg';

export const Header = () => {
  return (
    <div className="d-flex justify-content-between align-items-baseline mb-2 pl-4 pr-4">
      <h2 className="font-weight-light mb-2 text-center">
        <a href="https://store.steampowered.com/app/858810"
           target="_blank" rel="noopener noreferrer">
          Dawn of Man
        </a>
        {' - '}
        <a href="https://steamcommunity.com/app/858810/discussions/1/"
           rel="noopener noreferrer" target="_blank">
          Mod Generator v2.6
        </a>
        <em className="pl-1 position-relative" style={{fontSize: 14, top: -8}}>(alpha)</em>
      </h2>
      <div className="mt-2 text-size-xs d-flex align-items-center">
        <a href="https://github.com/blacksmoke26" className="text-size-sm"
           rel="noopener noreferrer" target="_blank">Junaid Atari</a>
        <span className="ml-1 mr-1" style={{color: 'rgb(235, 60, 84)', fontSize: 16}}>❤️</span>
        2019-{(new Date()).getFullYear()}
        <a href="https://www.nexusmods.com/dawnofman/mods/11"
           title="View on Nexus Mods" className="ml-3"
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
      </div>
    </div>
  );
};

export default Header;
