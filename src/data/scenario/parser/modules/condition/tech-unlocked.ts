/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {techEntities} from '~/utils/entities';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'TechUnlocked';

const parseTechs = (techs: string): string[] => {
  if (!isString(techs)
    // e.g., 'baking' // single
    // e.g., 'baking bone_polishing bone_tools' // multiple (more than one)
    && !/^([a-z]+[a-z_]+)( [a-z]+[a-z_]+)*$/g.test(techs)) {
    return [];
  }

  return techs.split(' ')
    .filter(tech => techEntities.includes(tech));
};

/** Convert a `TechUnlocked` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
  };

  if (isString(node?.tech) && techEntities.includes(node?.tech)) {
    condition.tech = node?.tech;
  }

  if (isString(node?.techs)) {
    const techList = parseTechs(node?.techs);
    techList.length && (condition.techs = techList);
  }

  return Object.keys(condition).length === 1
    ? null
    : condition;
};
