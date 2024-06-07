/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

export const theme = (theme: any) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    danger: '#DE350B',
    dangerLight: '#FFBDAD',
    neutral0: '#2a3141',
    neutral10: '#2a3141',
    neutral20: '#293040',
    neutral30: '#293040',
    neutral40: 'rgba(255,255,255,.1)',
    neutral50: 'rgba(255,255,255,.2)',
    neutral60: 'rgba(255,255,255,.7)',
    neutral70: 'rgba(255,255,255,.7)',
    neutral80: 'rgba(255,255,255,.5)',
    neutral90: 'rgba(255,255,255,.1)',
    primary: '#2a3141',
    primary25: '#363847',
    primary50: '#33343e',
    primary75: '#37373e',
  },
});

// @ts-ignore
export const styles = {
  menuPortal: (base: any) => ({...base, zIndex: 9999}),
  control: (styles: any) => ({...styles, backgroundColor: 'rgb(242 242 242 / 4%)'}),
  option: (styles: any, {isDisabled, isSelected}: { isDisabled: boolean, isSelected: boolean }) => ({
    ...styles,
    color: isDisabled
      ? '#2e2e32'
      : (
        isSelected
          ? '#ffb74d'
          : '#FFF'
      ),
    singleValue: (styles: any) => ({...styles, color: '#ffb74d'}),
  })
};
