/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

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
