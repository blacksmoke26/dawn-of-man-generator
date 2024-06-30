/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-25
 * @version 2.3.0
 */

import * as React from 'react';
import {nanoid} from 'nanoid';
import cn from 'classname';
import {OverlayTrigger, OverlayTriggerProps, Popover, PopoverBodyProps} from 'react-bootstrap';

// elemental components
import LinkButton, {LinkButtonProps} from '~/components/ui/LinkButton';

// icons
import {ChevronDown} from 'lucide-react';
import {COLOR_DISABLED, COLOR_GRAYED} from '~/components/icons/app';

interface PopoverBodyArgs {
  hide: (() => void);
}

export interface PopoverButtonProps extends React.PropsWithChildren {
  buttonProps?: LinkButtonProps;
  popoverHeader?: React.ReactNode;
  popoverBody: React.ReactNode | ((args: PopoverBodyArgs) => React.ReactNode);
  popoverBodyProps?: PopoverBodyProps;
  isCovered?: boolean;
  overlayProps?: OverlayTriggerProps;
  disabled?: boolean;
  hideArrow?: boolean;
}

/** PopoverButton functional component */
const PopoverButton = (props: PopoverButtonProps) => {
  const uniquePopoverId = `popover_${nanoid(10)}`;

  const newProps = {
    disabled: false,
    hideArrow: false,
    ...props,
  };

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const hidePopover = () => setShowPopup(false);

  React.useEffect(() => {
    props?.disabled && setShowPopup(false);
  }, [props?.disabled]);

  const popover = (
    <Popover
      id={uniquePopoverId}
      className={cn({'text-muted-deep': newProps?.disabled})}
      style={{marginTop: props?.isCovered ? -27 : -8}}>
      {props?.popoverHeader && (
        <Popover.Header as="h3">
          {props?.popoverHeader}
        </Popover.Header>
      )}
      <Popover.Body {...(props?.popoverBodyProps || {})}>
        {'function' === typeof props?.popoverBody
          ? props?.popoverBody({hide: hidePopover})
          : props?.popoverBody}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger
        {...props?.overlayProps}
        rootClose
        show={showPopup}
        trigger="click"
        placement="bottom-start"
        overlay={popover} onToggle={(show: boolean) => {
        setShowPopup(show);
      }}>
        <LinkButton
          disabled={newProps?.disabled}
          {...props?.buttonProps}
          aria-describedby={uniquePopoverId}
          onClick={e => {
            setShowPopup(true);
            'function' === typeof props?.buttonProps?.onClick
            && props?.buttonProps?.onClick(e);
          }}
          className={cn(
            'm-0 p-0 position-relative',
            props?.buttonProps?.className ?? '',
            {'text-muted-deep': newProps?.disabled},
          )}>
          {props?.children}
          {!newProps?.hideArrow && (
            <ChevronDown
              color={newProps?.disabled ? COLOR_DISABLED : COLOR_GRAYED}
              className="position-absolute d-inline"
              style={{marginLeft: 2, top: -1}} width="14"/>
          )}
        </LinkButton>
      </OverlayTrigger>
    </>
  );
};

export default PopoverButton;
