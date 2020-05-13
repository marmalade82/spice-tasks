
import { ScreenParams } from 'src/common/Navigator';
import * as Screens from "src/Screens";

export const ScreenDirectory: Record<keyof Omit<ScreenParams, "None">, any> = {
  Home: Screens.Home
  , Goal: Screens.Goal
  , Goals: Screens.GoalList
  , Menu: Screens.Menu
  , AddGoal: Screens.AddGoal
  , Streak: Screens.Streak
  , AddTask: Screens.AddTask
  , Task: Screens.Task
  , Tasks: Screens.TaskList
  , Reward: Screens.Reward
  , Rewards: Screens.RewardList
  , AddReward: Screens.AddReward
  , RewardOptions: Screens.RewardOptions
  , EarnedReward: Screens.EarnedReward
  , EarnedRewards: Screens.EarnedRewardList
  , UnusedEarnedRewards: Screens.UnusedEarnedRewards
  , Penalty: Screens.Penalty
  , Penalties: Screens.PenaltyList
  , AddPenalty: Screens.AddPenalty
  , AppStart : Screens.AppStart
  , RemainingTasks : Screens.RemainingTasks
  , Overdue: Screens.Overdue
  , InProgressGoals: Screens.InProgressGoalList
  , SpecificTask: Screens.SpecificTask
  , SpecificTaskLists: Screens.SpecificTaskList
  , EarnedPenalties: Screens.EarnedPenaltyList
  , EarnedPenalty: Screens.EarnedPenalty
  , UnusedEarnedPenalties: Screens.UnusedEarnedPenalties
  , Lists: Screens.Lists
  , Test: Screens.Test
  , Reports: Screens.Reports
  , StreakCycle: Screens.StreakCycle
  , StreakCycles: Screens.StreakCycles
  , Star: Screens.Star
  , Settings: Screens.Settings
};