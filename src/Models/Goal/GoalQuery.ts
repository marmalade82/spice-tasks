import DB from "src/Models/Database";
import { Goal, IGoal} from "src/Models/Goal/Goal";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Task, ITask } from "src/Models/Task/Task";
import ModelQuery from "src/Models/base/Query";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { Rewards } from "src/Models/Reward/RewardLogic";
import EarnedRewardQuery from "../Reward/EarnedRewardQuery";
import MyDate from "src/common/Date";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import { take } from "src/Models/common/logicUtils";
import EarnedRewardLogic from "../Reward/EarnedRewardLogic";
import { PenaltyTypes } from "../Penalty/PenaltyLogic";
import EarnedPenaltyQuery from "../Penalty/EarnedPenaltyQuery";
import EarnedPenaltyLogic from "../Penalty/EarnedPenaltyLogic";

class GoalQuery extends ModelQuery<Goal, IGoal>{
    constructor() {
        super(GoalSchema.table);
    }

    queries = () => {
        return [];
    }

    default = () => {
        const Default = {
            title: 'Default Goal',
            goalType: GoalType.NORMAL,
            startDate: new Date(),
            dueDate: new Date(),
            streakMinimum: 2,
            streakType: 'weekly',
            streakDailyStart: new Date(),
            streakWeeklyStart: 'sunday',
            streakMonthlyStart: 1,
            parentId: "",
            active: true,
            state: "open",
            rewardType: Rewards.NONE,
            penaltyType: PenaltyTypes.NONE,
            details: "",
            recurId: "",
            latestCycleStartDate: new Date(),
            lastRefreshed: new Date(),
            rewardId: "",
            penaltyId: "",
        } as const;
        return Default;
    }

    queryInRecurrence = (recurId: string) => {
        return this.store().query(
            Q.where(GoalSchema.name.RECUR_ID, recurId)
        );
    }

    inRecurrence = async (recurId: string) => {
        return (await this.queryInRecurrence(recurId).fetch()) as Goal[]
    }

    queryUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...Conditions.active(),
            ]
        );
    }

    unprocessed = async () => {
        return (await this.queryUnprocessed().fetch()) as Goal[];
    }

    queryUnprocessedStreaks = () => {
        return this.store().query(
            ...[ ...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                 ...Conditions.active(),
                 ...Conditions.isStreak(),
            ]
        )
    }

    unprocessedStreaks = async () => {
        return (await this.queryUnprocessedStreaks().fetch()) as Goal[];
    }

    latestInRecurrence = async (recurId: string) => {
        let goals = await this.inRecurrence(recurId);
        goals.sort((a, b) => {
            return b.startDate.valueOf() - a.startDate.valueOf();
        })

        if(goals[0]) {
            return goals[0];
        } else {
            return null;
        }
    }

    queryInRecentRecurrence = (recurId: string) => {
        return this.store().query(
            ...[ Q.where(GoalSchema.name.RECUR_ID, recurId),
                ...Conditions.createdAfter( new MyDate().subtract(2, "months").toDate() )
            ]
        )
    }

    inRecentRecurrence = async (recurId: string) => {
        return (await this.queryInRecentRecurrence(recurId).fetch()) as Goal[]
    }

    queryOngoingStreakGoals = () => {
        return this.store().query(
            ...[...Conditions.active(), 
                ...Conditions.isStreak(), 
                ...Conditions.started(), 
                ...Conditions.notOverdue()
            ]
        )
    }

    ongoingStreakGoals = async () => {
        return (await this.queryOngoingStreakGoals().fetch()) as Goal[];
    }

    queryActiveAndDue = () => {
        return this.store().query(
            Q.or(
                Q.and(
                    ...[...Conditions.active(), ...Conditions.overdue()]
                ),
                Q.and(
                    ...[...Conditions.active(), ...Conditions.dueToday()]
                )
            )
        )
    }

    queryActiveAndDueToday = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.dueToday()]
        );
    }

    queryActiveAndStartedButNotDue = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.started(), ...Conditions.notDue()]
        )
    }

    queryActiveButNotStarted = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.notStarted()]
        );
    }

    queryActive = () => {
        return this.store().query(
            ...Conditions.active()
        );
    }

    activeGoals = async () => {
        return await this.queryActive().fetch() as Goal[];
    }

    queryCompleted = () => {
        return this.store().query(...Conditions.complete())
    }

    completedGoals = async () => {
        return await this.queryCompleted().fetch() as Goal[];
    }

    queryInactive = () => {
        return this.store().query(...Conditions.inactive());
    }

    queryFailed = () => {
        return this.store().query(...Conditions.failed());
    }

    inactiveGoals = async () => {
        return await this.queryInactive().fetch() as Goal[];
    }

    failedGoals = async() => {
        return await this.queryFailed().fetch() as Goal[];
    }

    queryActiveAndOverdue = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.overdue()]
        );
    }

    completeGoalAndDescendants = async (opts: { id: string}) => {
        if(opts.id !== '') {
            try {
                const parent: Goal = await this.store().find(opts.id) as Goal;
                /* THIS ISN"T READY YET. need to recursively check descendant goals for both goals and tasks */
                const allGoals: Goal[] = [parent]// await findAllChildrenIn(this.table, parent.id, [parent]);
                const allGoalsPrep = allGoals.map((goal: Goal) => {
                    return goal.prepareUpdate((g: IGoal) => {
                        g.active = false;
                        g.state = 'complete';
                    });
                });

                const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, parent.id, []);
                const allTasksPrep = allTasks.map((task: Task) => {
                    return task.prepareUpdate((t: ITask) => {
                        t.active = false;
                        t.state = 'complete';
                    });
                });

                await DB.get().action(async() => {
                    await DB.get().batch(...[...allGoalsPrep, ...allTasksPrep]);
                })
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    }

    failGoalAndDescendants = async(opts: { id: string}) => {
        if(opts.id !== '') {
            try {
                const parent: Goal = await this.store().find(opts.id) as Goal;
                /* THIS ISN"T READY YET. need to recursively check descendant goals for both goals and tasks */
                const allGoals: Goal[] = [parent]// await findAllChildrenIn(this.table, parent.id, [parent]);
                const allGoalsPrep = allGoals.map((goal: Goal) => {
                    return goal.prepareUpdate((g: IGoal) => {
                        g.active = false;
                        g.state = 'cancelled';
                    });
                });

                const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, parent.id, []);
                const allTasksPrep = allTasks.map((task: Task) => {
                    return task.prepareUpdate((t: ITask) => {
                        t.active = false;
                        t.state = 'cancelled';
                    });
                });

                await DB.get().action(async() => {
                    await DB.get().batch(...[...allGoalsPrep, ...allTasksPrep]);
                })

            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    }
}

export default GoalQuery;
export {
    GoalQuery,
    Goal,
    IGoal,
}

export class GoalLogic {
    valid: boolean;
    id: string;
    constructor(id: string) {
        this.valid = true;
        this.id = id;
    }

    static processStreaks = async () => {
        await GoalLogic.processSomeStreaks();
    }

    static processSomeStreaks = async (n?: number) => {
        const goals: Goal[] = await new GoalQuery().unprocessedStreaks();
        await GoalLogic.process(goals, n)
    }

    static process = async (arr: Goal[], n?: number) => {
        take(arr, n? n : arr.length).forEach((goal) => {
            void new GoalLogic(goal.id).generateNextStreakTasks();
        })
    }

    complete = async () => {
        await new GoalQuery().completeGoalAndDescendants({
            id: this.id
        });

        await this.earnReward();
    }

    earnReward = async () => {
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        if(goal) {
            switch(goal.rewardType) {
                case Rewards.NONE: {
                    // If none, do nothing. No reward was earned.
                } break;
                case Rewards.SPECIFIC: {
                    await EarnedRewardLogic.earnSpecific(goal.rewardId, this.id);
                };
                default: {
                    await new EarnedRewardQuery().create({
                        earnedDate: new MyDate().toDate(),
                        type: goal.rewardType,
                        goalId: this.id,
                    })
                }
            }
        }
    }

    fail = async () => {
        await new GoalQuery().failGoalAndDescendants({
            id: this.id
        })

        await this.earnPenalty();
    }

    earnPenalty = async () => {
        const goal = await new GoalQuery().get(this.id);
        if(goal) {
            switch(goal.penaltyType) {
                case PenaltyTypes.NONE: {
                    // Nothing
                } break;
                case PenaltyTypes.SPECIFIC: {
                    await EarnedPenaltyLogic.earnSpecific(goal.penaltyId, this.id);
                } break;
                default: {
                    // Nothing for now.
                }
            }
        }
    }

    isStreak = async () => {
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        if(goal) {
            return goal.goalType === GoalType.STREAK;
        }

        return true;
    }

    /**
     * We meet the minimum if the sum of completable goals and already-completed goals
     * is gte the actual minimum of the goal.
     */
    metMinimum = async () => {
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        const activeTasks: number = await new TaskQuery().queryActiveHasParent(this.id).fetchCount();
        const completedTasks: number = await new TaskQuery().queryCompletedHasParent(this.id).fetchCount();
        debugger;
        if(goal) {
            const met = (activeTasks + completedTasks) >= goal.streakMinimum;
            return met;
        }

        return false;
    }

    generateNextStreakTasks = async (timeUntilNext? : number) => {
        const goal = await new GoalQuery().get(this.id);
        if(goal) {
            let unit: "days" | "weeks" | "months" = "days";
            let updatedCycleStart: MyDate = new MyDate();
            switch(goal.streakType) {
                case "daily": {
                    unit = "days";
                    updatedCycleStart = new MyDate().lastCycleStart(goal.streakType, goal.latestCycleStartDate);
                } break;
                case "weekly": {
                    unit = "weeks";
                    updatedCycleStart = new MyDate().lastCycleStart(goal.streakType, new MyDate(goal.latestCycleStartDate).dayName());
                } break;
                case "monthly": {
                    unit = "months";
                    updatedCycleStart = new MyDate().lastCycleStart(goal.streakType, new MyDate(goal.latestCycleStartDate).dayOfMonth());
                } break;
                default: {
                    updatedCycleStart = new MyDate();
                }
            }
            const latest = new MyDate(goal.latestCycleStartDate);
            const latestCycleTasks: Task[] = await new TaskQuery().inStreakCycle(latest.toDate(), goal.streakType );
            if(latestCycleTasks.length > 0) {
                await this._generateNextStreakTasks(latestCycleTasks, goal.id, goal.latestCycleStartDate, unit);
            }

            // once we've processed everything, the latest cycle start date should be updated to be latest
            // relative to TODAY's date.
            await new GoalQuery().update(goal, {
                latestCycleStartDate: updatedCycleStart.toDate(),
                lastRefreshed: new Date(),
            })
        }
    }

    _generateNextStreakTasks = async (latestTasks: Task[], parentId: string, 
                                latestCycleStart: Date,
                                unit: "days" | "weeks" | "months") => {
        let start = latestCycleStart;
        let tasks: Promise<Partial<ITask>>[] = [];
        // We continue generating streak tasks until processed everything up to the next cycle
        while(new MyDate().isInOrAfterNextCycleAfterDate(start, unit)) {
            const next = new MyDate(start).add(1, unit);
            let clones = latestTasks.map((task) => {
                return new TaskLogic(task.id).cloneRelativeTo(latestCycleStart, next.toDate());
            });

            tasks = tasks.concat(clones);
            start = next.toDate();
        }

        let fullTasks = await Promise.all(tasks);
        void new TaskQuery().createMultiple(fullTasks); // this should be batched, as it's all or nothing.
    }

    /**
     * For each task created in the last cycle (after the scheduled start),
     * create duplicate tasks with the exact same date relationships to the scheduled start.
     */
    generateStreakTasks = async (timeUntilNext?: number) => {
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        if(goal) {
            let nextCycle: MyDate;
            let lastCycle: MyDate;
            switch(goal.streakType) {
                case "daily": {
                    nextCycle =  new MyDate().nextCycleStart(goal.streakType, goal.streakDailyStart);
                    lastCycle = new MyDate().lastCycleStart(goal.streakType, goal.streakDailyStart);
                } break;
                case "weekly": {
                    nextCycle = new MyDate().nextCycleStart(goal.streakType, goal.streakWeeklyStart);
                    lastCycle = new MyDate().lastCycleStart(goal.streakType, goal.streakWeeklyStart);
                } break;
                case "monthly": {
                    nextCycle = new MyDate().nextCycleStart(goal.streakType, goal.streakMonthlyStart);
                    lastCycle = new MyDate().lastCycleStart(goal.streakType, goal.streakMonthlyStart);
                } break;
                default: {
                    throw new Error("unhandled streak type")
                }
            }

            if( nextCycle.inNext("minutes", timeUntilNext ? timeUntilNext : 50)) {
                // If the time is really soon, then we'll generate the next streak's tasks right now.
                // We query all completed or active tasks created AFTER shortly before the last cycle start,
                // and we clone them.
                let tasks = await new TaskQuery().createdBetween(
                        lastCycle.subtract(2, "hours").toDate(), MyDate.Now().toDate());

                const newTasks = await Promise.all(tasks.map(async (task) => {
                    return await (new TaskLogic(task.id).cloneRelativeTo(lastCycle.toDate(), nextCycle.toDate()))
                }));
                void new TaskQuery().createMultiple(newTasks);
            } else {
                console.log("not in next cycle start");
            }
        }
    }

    /**
     * Creates a new goal based on an old goal. Start/Due dates have the same relation to newDate taht 
     * the old goal's start/due dates had to the oldDate.
     */
    cloneRelativeTo = async (oldDate: Date, newDate: Date) => {
        const goal = await new GoalQuery().get(this.id);

        if(goal) {
            const newStart = new MyDate(newDate).add( new MyDate(goal.startDate).diff(oldDate, "minutes"), "minutes");
            const newGoal : IGoal = {
                title: goal.title,
                details: goal.details,
                goalType: goal.goalType,
                parentId: goal.parentId,
                state: 'open',
                active: true,
                rewardType: goal.rewardType,
                recurId: goal.recurId,
                streakMinimum: goal.streakMinimum,
                streakDailyStart: goal.streakDailyStart,
                streakMonthlyStart: goal.streakMonthlyStart,
                streakType: goal.streakType,
                streakWeeklyStart: goal.streakWeeklyStart,
                startDate: newStart.toDate(),
                dueDate: new MyDate(newDate).add( new MyDate(goal.dueDate).diff(oldDate, "minutes"), "minutes").toDate(),
                latestCycleStartDate: newStart.prevMidnight().toDate(),
                lastRefreshed: goal.lastRefreshed,
                rewardId: goal.rewardId,
                penaltyType: goal.penaltyType,
                penaltyId: goal.penaltyId,
            }
            return newGoal;
        } else {
            throw new Error()
        }
    }
}
