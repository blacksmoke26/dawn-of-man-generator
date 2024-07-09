/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

// utils
import * as objects from '~/utils/objects';

// types
import type {Option} from '~/components/ui/Select';
import type {environment} from '~/data/environments/parser/types';

type OverridePrototypes = environment.prototypes.OverridePrototypes;
type ObjectType = environment.prototypes.ObjectType;

export interface Props {
  disabled?: boolean;
  initialValues?: OverridePrototypes;
  onTemplate?(template: string): void;
}

/**
 * Returns the list of objects for the given type
 * @param type - The type of object
 */
export const typeToList = (type: ObjectType) => {
  switch (type) {
    case 'deposit':
      return objects.deposits;
    case 'prop':
      return objects.props;
    case 'tree':
      return objects.trees;
    case 'detail':
      return objects.details;
  }
};

/**
 * Returns react-select options by given type
 * @param type - The type of object
 * @param [excluded] - The list of excluded values
 * @returns The react-select options
 */
export const optionsByType = (type: ObjectType, excluded: string[] = []): Option[] => {
  const options: Option[] = [];

  const list = typeToList(type) as unknown as string[];
  const excludedCount = excluded.length;

  for (const value of list) {
    if (excludedCount && excluded.includes(value)) {
      continue;
    }

    options.push({label: value, value});
  }

  return options;
};
