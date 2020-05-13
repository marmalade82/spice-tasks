
import { TaskParentTypes } from 'src/Models/Task/Task';
import { any } from 'prop-types';

export interface Navigation<ScreenParams> {
    navigate: <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => void;
    push: <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => void;
    replace: <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => void;
    goBack: (dest? : null) => void;
    state: any;
}

export class ScreenNavigation<ScreenParams, Screen extends keyof ScreenParams> implements Navigation<ScreenParams> {
    props: { navigation: object };
    constructor(props: {navigation: object}) {
        this.props = props;
    }

    private get navigator() {
      return this.props.navigation as any;
    }

    goBack = (dest? : null) => {
        this.navigator.goBack(null);
    }

    getParam: <T extends keyof ScreenParams[Screen]>(param: T, fallback: ScreenParams[Screen][T]) => ScreenParams[Screen][T] = (param, fallback) => {
        return this.navigator.getParam(param, fallback);
    }

    navigate = <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => {
        this.navigator.navigate(screen, params)
    }

    push = <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => {
        this.navigator.push(screen, params);
    }

    replace = <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => {
        this.navigator.replace(screen, params);
    }

    get state() {
      return this.navigator.state
    }
}

const Single = {
  id: "", 
}

const Child = {
  id: "",
  parent_id: "",
}

const None = { }

const NavigatorParams = {
    Home: None
  , Goal: {
      title: "Goal" as "Goal" | "Habit",
      ...Single,
    }
  , Goals: {
      type: "" as string | undefined,
      parentId: "" as string | undefined,
    }
  , Menu: None
  , AddGoal: {
      title: "Goal" as "Goal" | "Habit",
      ...Child
    }
  , Streak: None
  , AddTask: {
      parent_type: TaskParentTypes.TASK as TaskParentTypes,
      ...Child
    }
  , Tasks: {
      type: "" as string,
      parentId: "" as string,
      id: "" as string | undefined,
    }
  , Reward: Single
  , Rewards: None
  , AddReward: Child
  , Task: Single
  , RewardOptions: None
  , EarnedReward: Single
  , EarnedRewards: {
      type: "" as string | undefined
    }
  , UnusedEarnedRewards: None
  , Penalty: Single
  , Penalties: None
  , AddPenalty: Child
  , AppStart : None
  , RemainingTasks : None
  , Overdue: None
  , InProgressGoals: None
  , SpecificTask: None
  , SpecificTaskLists: None
  , EarnedPenalties: {
      type: "" as string | undefined
    }
  , EarnedPenalty: Single
  , UnusedEarnedPenalties: None
  , Lists: None
  , StreakCycle: Single
  , StreakCycles: {
      type: "" as string | undefined,
      goalId: "" as string | undefined,
    }
  , Test: None
  , None: None
  , Star: None
  , Reports: None
  , Settings: None
} as const;

export type ScreenParams = typeof NavigatorParams;

export type FullNavigation = Navigation<ScreenParams>;

export type MainNavigator<Screen extends keyof ScreenParams> = ScreenNavigation<ScreenParams, Screen>
