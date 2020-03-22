
import { TaskParentTypes } from 'src/Models/Task/Task';
import { any } from 'prop-types';

export interface Navigation<ScreenParams> {
    navigate: <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => void;
    push: <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) => void;
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
        this.navigator.goBack(dest);
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
  , Goal: Single
  , Goals: None
  , Menu: None
  , AddGoal: Child
  , Streak: None
  , AddTask: {
      parent_type: TaskParentTypes.TASK as TaskParentTypes,
      ...Child
    }
  , Tasks: None
  , Reward: Single
  , Rewards: None
  , AddReward: Child
  , Task: Single
  , RewardOptions: None
  , EarnedReward: Single
  , EarnedRewards: None
  , UnusedEarnedRewards: None
  , Penalty: Single
  , Penalties: None
  , AddPenalty: Child
  , HomePage : None
  , AppStart : None
  , RemainingTasks : None
  , Overdue: None
  , InProgressGoals: None
  , SpecificTask: None
  , SpecificTaskLists: None
  , Recurrings: None
  , Recur: Single
  , AddRecur: Child
  , EarnedPenalties: None
  , EarnedPenalty: Single
  , UnusedEarnedPenalties: None
  , Lists: None
  , StreakCycle: Single
  , StreakCycles: None
  , Test: None
  , None: None
  , Star: None
} as const;

export type ScreenParams = typeof NavigatorParams;

export type FullNavigation = Navigation<ScreenParams>;

export type MainNavigator<Screen extends keyof ScreenParams> = ScreenNavigation<ScreenParams, Screen>
