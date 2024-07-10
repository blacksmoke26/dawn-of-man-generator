/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */
import type {Props as SelectProps} from 'react-select/dist/declarations/src';

export const COMMON_THEME_COLORS = {
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: '#353f53',
  neutral10: '#353f53',
  neutral20: '#4f515a',
  neutral30: '#53555c', // over input border
  neutral40: 'rgba(255, 255, 255, .3)',
  neutral50: 'rgba(255,255,255,.2)',
  neutral60: 'rgba(255,255,255,.7)',
  neutral70: 'rgba(255,255,255,.7)',
  neutral80: 'rgba(255,255,255,.7)',
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
export const styles: Partial<SelectProps['styles']> = {
  menuPortal: (base: any) => ({...base, zIndex: 9999}),
  control: (styles: any, {isDisabled}) => ({
    ...styles,
    backgroundColor: isDisabled ? '#30394b' : '#2a3242',
    borderColor: isDisabled ? '#30394b' : '#2a3242',
    height: 32,
    minHeight: 32,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorsContainer: (styles: any, {isDisabled}) => ({
    ...styles,
    height: 32,
  }),
  valueContainer: (styles: any, {isDisabled}) => ({
    ...styles,
    padding: '0px 8px 1px 8px'
  }),
  multiValue: (styles: any, {isDisabled}) => ({
    ...styles,
    padding: 0,
    paddingBottom: 0,
    color: isDisabled ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.7)',
    margin: 0,
    marginRight: 4
  }),
  multiValueLabel: (styles: any, {isDisabled}) => ({
    ...styles,
    color: isDisabled ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.7)',
  }),
  groupHeading: (styles: any) => ({
    ...styles,
    color: 'rgba(255,255,255,.6)',
  }),

  option: (styles: any, {isDisabled, isSelected}: { isDisabled: boolean, isSelected: boolean }) => ({
    ...styles,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: '.75rem',
    color: isDisabled
      ? '#30394b'
      : (
        isSelected
          ? '#ffb74d'
          : '#FFF'
      ),
    singleValue: (styles: any, {isDisabled}: { isDisabled: boolean}) => ({...styles, color: isDisabled ? 'rgba(255,255,255,.5)' : '#fff'}),
  }),
}
