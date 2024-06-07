/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from './../../index.types';

// utils
import {props} from '~/utils/random';
import {transformOverrideObject} from './../../utils/transform';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformOverrideObject(json, {
    root: 'environment.prop_override_prototypes.prop_override_prototype',
    wrapperKey: 'propOverridePrototypes',
    transformOptions: {
      requiredProp: 'id',
      requiredPropValidator: id => props.includes(id),
      optionalProps: [
        'density',
        {group: 'altitude', key: 'min_altitude'},
        {group: 'altitude', key: 'max_altitude'},
        {group: 'angle', key: 'min_angle'},
        {group: 'angle', key: 'max_angle'},
      ],
    },
    ...options,
  });
};
