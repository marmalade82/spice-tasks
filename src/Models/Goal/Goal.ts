

import { Model } from "@nozbe/watermelondb";
import { field, date, children, relation } from "@nozbe/watermelondb/decorators";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";

type GoalType = "normal" | "streak"

interface IGoal extends IStreak{
    title: string;
    goalType: string;
    startDate: Date;
    dueDate: Date;
    parentId: string;
}

interface IStreak {
    streakMinimum: number;
    streakType: string; // daily, weekly, or monthly
    streakDailyStart: Date;  // really represents the time portion
    streakWeeklyStart: string;  // sunday, monday, tuesday, etc.
    streakMonthlyStart: number; // Specific day of month it starts on
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
    @field(name.TITLE) title
    @field(name.TYPE) goalType
    @date(name.STARTS_AT) startDate 
    @date(name.DUE_AT) dueDate
    @field(name.STREAK_MIN) streakMinimum
    @field(name.STREAK_TYPE) streakType
    @date(name.STREAK_DAILY_START) streakDailyStart
    @field(name.STREAK_WEEKLY_START) streakWeeklyStart
    @field(name.STREAK_MONTHLY_START) streakMonthlyStart
    @field(name.PARENT) parentId

    /*Relations*/
    @children('tasks') tasks
    @relation(GoalSchema.table, name.PARENT) parentGoal
}

export {
    Goal,
    IGoal,
}