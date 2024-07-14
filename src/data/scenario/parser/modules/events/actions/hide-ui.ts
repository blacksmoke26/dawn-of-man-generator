/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isBool} from '~/helpers/bool';
import {ENTITIES} from '~/utils/entities';
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {BUILDABLE_CATEGORIES} from '~/utils/action';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionHideUi, ActionName, ActionWithType} from '~/types/action.types';
import {isInList} from '~/helpers/array';

const ACTION_NAME: ActionName = 'HideUi';
type ActionParams = ActionWithType<'HideUi', ActionHideUi>;

/** Convert a `HideUi` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  if (isString(node?.entity_types, true)) {
    const entityTypes = node.entity_types.split(' ')
      .map((name: string) => name.trim())
      .filter((name: string) => ENTITIES.includes(name));

    entityTypes.length && (action.entityTypes = entityTypes);
  }
  
  isInList(
    node?.buildable_categories, BUILDABLE_CATEGORIES as unknown as string[],
    value => action.buildableCategories = value,
  );

  isBool(node?.hide_disabled_ui) && (action.hideDisabledUi = node.hide_disabled_ui);
  isBool(node?.hide_quick_panels) && (action.hideQuickPanels = node.hide_quick_panels);

  return Object.keys(action).length ? action : null;
};
