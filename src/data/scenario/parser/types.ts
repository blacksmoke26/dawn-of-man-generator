/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

// types
import {Season} from '~/utils/seasons.types';
import {Event as AnyEvent} from '~/types/event.types';
import {Disaster as DisasterName} from '~/types/scenario.types';
import {
  ConditionAnyTasksActive,
  ConditionAnyWorkAreasActive,
  ConditionEntityCountComparison,
  ConditionEntityCountReached,
  ConditionEntityNearMarker,
  ConditionEraUnlocked,
  ConditionInitGame,
  ConditionIsAlive,
  ConditionIsGameInteractionPending,
  ConditionNewGame,
  ConditionScenarioCompleted,
  ConditionTechUnlocked,
  ConditionTimeElapsed,
  ConditionValueEquals,
  ConditionValueReached,
  LogicalCondition,
} from '~/types/condition.types';

export namespace scenario {
  export interface Scenario {
    hardcoreModeAllowed?: boolean;
    nomadModeAllowed?: boolean;
    category?: Capitalize<string>;
    groupId?: Lowercase<string>;
    size?: number;
    showCompletionIcon?: boolean;
    requiredMilestones?: number;
    customSettlementNameAllowed?: boolean;
    loadingScreens?: Lowercase<string>;
    startingConditions?: StartingConditions;
    visible?: boolean;
    disasters?: Disaster[];
    locations?: Location[];
    goals?: Goal[];
    milestones?: Milestone[];
    events?: AnyEvent[];
  }

  export type Event = AnyEvent;
  export type Events = Event[];

  export interface StartingConditions {
    seasonId: Season;
    visualSetupId?: string;
  }

  export namespace condition {
    type ConditionWithType<N, O> = { type: N } & O;

    export type AnyTasksActive = ConditionWithType<'AnyTasksActive', ConditionAnyTasksActive>;
    export type AnyWorkAreasActive = ConditionWithType<'AnyWorkAreasActive', ConditionAnyWorkAreasActive>;
    export type EntityCountComparison = ConditionWithType<'EntityCountComparison', ConditionEntityCountComparison>;
    export type EntityCountReached = ConditionWithType<'EntityCountReached', ConditionEntityCountReached>;
    export type EntityNearMarker = ConditionWithType<'EntityNearMarker', ConditionEntityNearMarker>;
    export type EraUnlocked = ConditionWithType<'EraUnlocked', ConditionEraUnlocked>;
    export type InitGame = ConditionWithType<'InitGame', ConditionInitGame>;
    export type IsAlive = ConditionWithType<'IsAlive', ConditionIsAlive>;
    export type IsGameInteractionPending = ConditionWithType<'IsGameInteractionPending', ConditionIsGameInteractionPending>;
    export type NewGame = ConditionWithType<'NewGame', ConditionNewGame>;
    export type ScenarioCompleted = ConditionWithType<'ScenarioCompleted', ConditionScenarioCompleted>;
    export type TechUnlocked = ConditionWithType<'TechUnlocked', ConditionTechUnlocked>;
    export type TimeElapsed = ConditionWithType<'TimeElapsed', ConditionTimeElapsed>;
    export type ValueEquals = ConditionWithType<'ValueEquals', ConditionValueEquals>;
    export type ValueReached = ConditionWithType<'ValueReached', ConditionValueReached>;

    export type GeneralCondition =
      | condition.AnyTasksActive
      | condition.AnyWorkAreasActive
      | condition.EntityCountComparison
      | condition.EntityCountReached
      | condition.EntityNearMarker
      | condition.EraUnlocked
      | condition.InitGame
      | condition.IsAlive
      | condition.IsGameInteractionPending
      | condition.NewGame
      | condition.ScenarioCompleted
      | condition.TechUnlocked
      | condition.TimeElapsed
      | condition.ValueEquals
      | condition.ValueReached

    export interface LogicalCondition {
      type: LogicalCondition;
      conditions: GeneralCondition[];
    }
  }

  export interface Milestone {
    id: Lowercase<string>;
    conditions: (condition.GeneralCondition | condition.LogicalCondition)[];
  }

  export interface Goal {
    id: Lowercase<string>;
    conditions: (condition.GeneralCondition | condition.LogicalCondition)[];
  }

  export interface Disaster {
    disasterType: DisasterName;
    period: number;
    variance: number;
  }

  export interface Location {
    id: Lowercase<string>;
    seed: number;
    environment: Lowercase<string>;
    mapLocation: [number, number];
    position?: [number, number];
    river?: boolean;
    lakes?: number;
  }
}
