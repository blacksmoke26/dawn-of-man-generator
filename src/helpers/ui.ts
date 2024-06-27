/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import merge from 'deepmerge';

// types
import type {CSSProperties} from 'react';

/**
 * Find the next/previous tab key to set as active
 * @param tabsList the list of tabs
 * @param activeKey Current selected tab key
 * @param tabId The clicked tab
 * @return The next tab key
 */
export const findNextTabKey = (tabsList: string[], activeKey: string, tabId: string): string => {
  let nextActiveKey: string = activeKey;
  const currentIndex: number = tabsList.findIndex(tabKey => tabKey === nextActiveKey);

  // only
  if (1 === (tabsList.length - 1)) {
    return tabsList[0];
  }

  return currentIndex === 0
    ? tabsList[currentIndex + 1]
    : tabsList[currentIndex - 1];
};

interface StyleCnArg extends CSSProperties {
  compare?: boolean;
}

/**
 * Allow CSS properties to be merged based on a `compare` value is true otherwise ignore being merged
 *
 * @example Plain css properties
 * <span style={styleCn({color: 'red'})}>
 *   ...
 * </span>
 *
 * @example Based on a value comparison
 * <span style={styleCn({compare: !someValue, color: 'red'})}>
 *   ...
 * </span>
 *
 * @example Using multiple style arguments
 * <span style={styleCn({marginTop: 2}, {compare: !someValue, color: 'red'})}>
 *   ...
 * </span>
 *
 * @param style - CSS properties with a `compare` value
 * @return Style properties
 */
export const styleCn = (...style: StyleCnArg[]): CSSProperties => {
  const allStyles = [] as CSSProperties[];

  for (const styl of style) {
    if (styl?.compare !== undefined && styl?.compare) {
      const cssProps = {...styl};
      delete cssProps.compare;

      allStyles.push(cssProps);
      continue;
    }

    allStyles.push(styl);
  }

  return merge.all<CSSProperties>(allStyles);
};
