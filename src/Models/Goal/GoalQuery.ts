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

class GoalQuery extends ModelQuery<Goal, IGoal>{
    constructor() {
        super(GoalSchema.table);
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
            details: "",
        } as const;
        return Default;
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
                new TaskQuery().createMultiple(newTasks);
            } else {
                console.log("not in next cycle start");
            }
        }
    }
}
