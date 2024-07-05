/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {props} from '~/utils/random';
import {transformOverrideObject} from '~/utils/parser/transform';
import {transformObjectOutput, transformPrototypesPropertyValue} from '../../utils/prototypes';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformOverrideObject(json, {
    root: 'environment.prop_override_prototypes.prop_override_prototype',
    wrapperKey: 'propOverridePrototypes',
    transformOptions: {
      requiredProp: 'id',
      requiredPropValidator: id => props.includes(id),
      transformPropertyValue: transformPrototypesPropertyValue,
      transformOutput: transformObjectOutput,
      optionalProps: [
        'density',
        {group: 'altitude', key: 'min_altitude'},
        {group: 'altitude', key: 'max_altitude'},
        {group: 'humidity', key: 'min_humidity'},
        {group: 'humidity', key: 'max_humidity'},
        {group: 'angle', key: 'min_angle'},
        {group: 'angle', key: 'max_angle'},
      ],
    },
    ...options,
  });
};
