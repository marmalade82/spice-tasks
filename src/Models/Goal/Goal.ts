

import { Model } from "@nozbe/watermelondb";
import { field, date, children, relation } from "@nozbe/watermelondb/decorators";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import { RewardType } from "src/Models/Reward/RewardLogic";
import { GoalType } from "src/Models/Goal/GoalLogic";


interface IGoal extends IStreak{
    title: string;
    details: string;
    goalType: GoalType;
    startDate: Date;
    dueDate: Date;
    parentId: string;
    state: "open" | "in_progress" | "complete" | "cancelled"
    active: boolean;
    rewardType: RewardType;
    recurId: string;
    latestCycleStartDate: Date;
    rewardId: string;
}

interface IStreak {
    streakMinimum: number;
    streakType: "daily" | "weekly" | "monthly"; // daily, weekly, or monthly
    streakDailyStart: Date;  // really represents the time portion
    streakWeeklyStart: string;  // sunday, monday, tuesday, etc.
    streakMonthlyStart: number; // Specific day of month it starts on
    lastRefreshed: Date;
}

const name = GoalSchema.name;

export default class Goal extends Model implements IGoal {
    static table = GoalSchema.table;
    static associations = {
        tasks: {
            type: "has_many",
            foreignKey: TaskSchema.name.PARENT,
        } as const,
        [GoalSchema.table]: {
            type: "belongs_to",
            key: name.PARENT,
        } as const,
    }
    @field(name.TITLE) title!: string;
    @field(name.TYPE) goalType!: GoalType;
    @date(name.STARTS_AT) startDate!: Date;
    @date(name.DUE_AT) dueDate!: Date;
    @field(name.STREAK_MIN) streakMinimum!: number;
    @field(name.STREAK_TYPE) streakType!: "daily" | "weekly" | "monthly";
    @date(name.STREAK_DAILY_START) streakDailyStart!: Date;
    @field(name.STREAK_WEEKLY_START) streakWeeklyStart!: string;
    @field(name.STREAK_MONTHLY_START) streakMonthlyStart!: number;
    @field(name.PARENT) parentId!: string;
    @field(name.STATE) state!: "open" | "in_progress" | "complete" | "cancelled";
    @field(name.ACTIVE) active!: boolean;
    @field(name.REWARD_TYPE) rewardType!: RewardType;
    @field(name.DETAILS) details!: string;
    @field(name.RECUR_ID) recurId!: string;
    @date(name.LATEST_CYCLE_START) latestCycleStartDate!: Date;
    @date(name.LAST_REFRESHED) lastRefreshed!: Date;
    @field(name.REWARD_ID) rewardId!: string;

    /*Relations*/
    @children('tasks') tasks
    @relation(GoalSchema.table, name.PARENT) parentGoal
}

export {
    Goal,
    IGoal,
}