

import { Model, Relation } from "@nozbe/watermelondb";
import { field, date, children, relation } from "@nozbe/watermelondb/decorators";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import { RewardType } from "src/Models/Reward/RewardLogic";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";
import RewardSchema from "../Reward/RewardSchema";
import { Reward } from "src/Models/Reward/Reward";
import Penalty from "../Penalty/Penalty";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import MyDate from "src/common/Date";
import { startDate, dueDate } from "src/Components/Forms/common/utils";


export enum GoalParentTypes {
    GOAL = "goal",
    RECUR = "recur",
    NONE = "none",
}

interface IGoal extends IStreak{
    title: string;
    details: string;
    goalType: GoalType;
    startDate: Date;
    dueDate: Date;
    state: "open" | "in_progress" | "complete" | "cancelled"
    active: boolean;
    rewardType: RewardType;
    penaltyType: PenaltyTypes
    recurId: string;
    latestCycleId: string;
    rewardId: string;
    penaltyId: string;
    parent: ParentInfo;
}

interface IStreak {
    streakMinimum: number;
    streakType: "daily" | "weekly" | "monthly"; // daily, weekly, or monthly
    streakDailyStart: Date;  // really represents the time portion
    streakWeeklyStart: string;  // sunday, monday, tuesday, etc.
    streakMonthlyStart: number; // Specific day of month it starts on
    lastRefreshed: Date;
}

interface ParentInfo {
    readonly id: string;
    readonly type: GoalParentTypes;
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
    @field(name.STATE) state!: "open" | "in_progress" | "complete" | "cancelled";
    @field(name.ACTIVE) active!: boolean;
    @field(name.REWARD_TYPE) rewardType!: RewardType;
    @field(name.DETAILS) details!: string;
    @field(name.RECUR_ID) recurId!: string;
    @field(name.LATEST_CYCLE) latestCycleId!: string; // to cache the last cycle generated automatically
    @date(name.LAST_REFRESHED) lastRefreshed!: Date; // to track that this goal has been processed today.
    @field(name.REWARD_ID) rewardId!: string;
    @field(name.PENALTY_TYPE) penaltyType!: PenaltyTypes;
    @field(name.PENALTY_ID) penaltyId!: string;
    

    //TODO: FIX USAGES OF OBJECT.ASSIGN

    @field(name.PARENT) private parentId!: string;
    @field(name.PARENT_TABLE) private parentType!: GoalParentTypes;

    get reward() {
        return this.rewardRelation.observe().pipe(filter((r) => {
            return r ? true : false;
        }));
    }
    get penalty() {
        return this.penaltyRelation.observe().pipe(filter((r) => {
            return r ? true : false;
        }));
    }

    /*Relations*/
    @children('tasks') tasks
    @relation(GoalSchema.table, name.PARENT) parentGoal
    @relation(RewardSchema.table, name.REWARD_ID) rewardRelation!: Relation<Reward>;
    @relation(RewardSchema.table, name.PENALTY_ID) penaltyRelation!: Relation<Penalty>;

    get parent() {
        return {
            id: this.parentId,
            type: this.parentType,
        }
    }

    set parent(info: ParentInfo) {
        this.parentId = info.id;
        this.parentType = info.type;
    }

    isStreak = () => {
        return this.goalType === GoalType.STREAK;
    }

    isNormal = () => {
        return this.goalType === GoalType.NORMAL;
    }

    currentCycleStart = () => {
        const correctDate = ( d: Date) => {
            const goalStart = new MyDate( startDate(this.startDate)).toDate();
            const goalEnd = new MyDate( dueDate(this.dueDate)).toDate()
            return d < goalStart ? goalStart : (d > goalEnd ? startDate(goalEnd) : d);
        }
        switch(this.streakType) {
            case "daily": {
                const today = new MyDate( startDate(MyDate.Now().toDate())).toDate();
                return correctDate(today); 
            } break;
            case "weekly": {
                const dayName = new MyDate( this.startDate).dayName();
                const day = MyDate.Now().setDay(dayName);
                if( day.toDate() > MyDate.Now().toDate() ) {
                    day.subtract(1, "weeks");
                }

                return correctDate(startDate(day.toDate()))
            } break;
            case "monthly": {
                const dayInMonth = new MyDate(this.startDate).dayOfMonth();
                const date = MyDate.Now().setDayOfMonth(dayInMonth);
                if( date.toDate() > MyDate.Now().toDate()) {
                    date.subtract(1, "months")
                }

                return correctDate(startDate(date.toDate()))
            } break;
            default: {
                return correctDate(MyDate.Now().toDate());
            }
        }
    }

    currentCycleEnd = () => {
        const correctDate = ( d: Date) => {
            const goalStart = new MyDate( startDate(this.startDate)).toDate();
            const goalEnd = new MyDate( dueDate(this.dueDate)).toDate();
            return d > goalEnd ? goalEnd : (d < goalStart ? dueDate(goalStart) : d);
        }
        switch(this.streakType) {
            case "daily": {
                const today = new MyDate( dueDate(MyDate.Now().toDate())).toDate();
                return correctDate(today);
            } break;
            case "weekly": {
                const dayName = new MyDate( this.startDate).subtract(1, "days").asDueDate().dayName();
                const day = MyDate.Now().setDay(dayName);
                if( day.toDate() < MyDate.Now().toDate() ) {
                    day.add(1, "weeks");
                }

                let date = correctDate(dueDate(day.toDate()));
                return correctDate(dueDate(day.toDate()));
            } break;
            case "monthly": {
                const dayInMonth = new MyDate(this.startDate).subtract(1, "days").asDueDate().dayOfMonth();
                const date = MyDate.Now().setDayOfMonth(dayInMonth);
                if( date.toDate() < MyDate.Now().toDate()) {
                    date.add(1, "months")
                }

                return correctDate(dueDate(date.toDate()))
            } break;
            default: {
                return correctDate(MyDate.Now().toDate());
            }
        }
    }

}

export {
    Goal,
    IGoal,
}