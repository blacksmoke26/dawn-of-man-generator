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

  export type ConditionWithType<N, O> = { type: N } & O;

  export interface ConditionLogical {
    type: LogicalCondition;
    conditions: ConditionPlain[];
  }

  export type ConditionPlain =
    | ConditionWithType<'AnyTasksActive', ConditionAnyTasksActive>
    | ConditionWithType<'AnyWorkAreasActive', ConditionAnyWorkAreasActive>
    | ConditionWithType<'EntityCountComparison', ConditionEntityCountComparison>
    | ConditionWithType<'EntityCountReached', ConditionEntityCountReached>
    | ConditionWithType<'EntityNearMarker', ConditionEntityNearMarker>
    | ConditionWithType<'EraUnlocked', ConditionEraUnlocked>
    | ConditionWithType<'InitGame', ConditionInitGame>
    | ConditionWithType<'IsAlive', ConditionIsAlive>
    | ConditionWithType<'IsGameInteractionPending', ConditionIsGameInteractionPending>
    | ConditionWithType<'NewGame', ConditionNewGame>
    | ConditionWithType<'ScenarioCompleted', ConditionScenarioCompleted>
    | ConditionWithType<'TechUnlocked', ConditionTechUnlocked>
    | ConditionWithType<'TimeElapsed', ConditionTimeElapsed>
    | ConditionWithType<'ValueEquals', ConditionValueEquals>
    | ConditionWithType<'ValueReached', ConditionValueReached>;

  export interface Milestone {
    id: Lowercase<string>;
    conditions: (ConditionPlain | ConditionLogical)[];
  }

  export interface Goal {
    id: Lowercase<string>;
    conditions: (ConditionPlain | ConditionLogical)[];
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
