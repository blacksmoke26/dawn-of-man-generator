// noinspection HtmlUnknownAnchorTarget

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import cn from 'classname';
import React from 'react';
import merge from 'deepmerge';

// types
import type {Required} from 'utility-types';

interface TabTitleProps {
  title: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onRemove?(): void;
}

/** TabTitle functional component */
const TabTitle = (props: TabTitleProps) => {
  const newProps = merge<Required<TabTitleProps>>({
    disabled: false,
    className: 'text-size-sm',
    onRemove() {
    },
  }, props);

  return (
    <>
      <span
        className={cn('mr-1', {
          'text-muted text-line-through': newProps.disabled,
        }, newProps.className)}>
        {newProps.title}
      </span>
      <a href="#/close"
        aria-disabled={newProps.disabled}
        hidden={newProps.disabled}
        className="text-decoration-none text-white-50 p-0"
        style={{
          lineHeight: '10px',
          position: 'relative',
          top: 0,
          fontSize: '1rem'
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          newProps.onRemove();
        }}
      >&times;</a>
    </>
  );
};

export default React.memo(TabTitle);
