/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */export const COMMON_THEME_COLORS = {
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: '#353f53',
  neutral10: '#353f53',
  neutral20: '#4f515a',
  neutral30: '#53555c', // over input border
  neutral40: 'rgba(255,255,255,.6)',
  neutral50: 'rgba(255,255,255,.2)',
  neutral60: 'rgba(255,255,255,.7)',
  neutral70: 'rgba(255,255,255,.7)',
  neutral80: 'rgba(255,255,255,.5)',
  neutral90: 'rgba(255,255,255,.1)',
  primary: '#353f53',
  primary25: '#363847',
  primary50: '#33343e',
  primary75: '#37373e',
}


export const theme = (theme: any) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    ...COMMON_THEME_COLORS,
  },
});

// @ts-ignore
export const styles = {
  menuPortal: (base: any) => ({...base, zIndex: 9999}),
  control: (styles: any) => ({
    ...styles, backgroundColor: 'rgb(42 50 66)',
    borderColor: '#2b3345',
    height: 35,
    minHeight: 35,
  }),
  option: (styles: any, {isDisabled, isSelected}: { isDisabled: boolean, isSelected: boolean }) => ({
    ...styles,
    color: isDisabled
      ? '#30394b'
      : (
        isSelected
          ? '#ffb74d'
          : '#FFF'
      ),
    singleValue: (styles: any) => ({...styles, color: '#ffb74d'}),
  }),
};
