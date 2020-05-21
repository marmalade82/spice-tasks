import DB from "src/Models/Database";
import { Goal, IGoal, GoalParentTypes} from "src/Models/Goal/Goal";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Task, ITask, TaskParentTypes } from "src/Models/Task/Task";
import ModelQuery from "src/Models/base/Query";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { RewardTypes } from "src/Models/Reward/RewardLogic";
import EarnedRewardQuery from "../Reward/EarnedRewardQuery";
import MyDate from "src/common/Date";
import TaskQuery, { TaskLogic, ActiveTaskQuery, ChildTaskQuery } from "src/Models/Task/TaskQuery";
import { take } from "src/Models/common/logicUtils";
import EarnedRewardLogic from "../Reward/EarnedRewardLogic";
import { PenaltyTypes } from "../Penalty/PenaltyLogic";
import EarnedPenaltyQuery from "../Penalty/EarnedPenaltyQuery";
import EarnedPenaltyLogic from "../Penalty/EarnedPenaltyLogic";
import ActiveTransaction, {InactiveTransaction} from "../common/Transaction";
import StreakCycleQuery, { ChildStreakCycleQuery } from "../Group/StreakCycleQuery";
import StreakCycle from "../Group/StreakCycle";
import { Condition } from "@nozbe/watermelondb/QueryDescription";
import { assignAll } from "src/common/types";
import * as R from "ramda";

export class GoalQuery extends ModelQuery<Goal, IGoal>{
    constructor() {
        super(GoalSchema.table);
    }

    assign = (target: Goal, source: IGoal) => {
        return assignAll(['parent'], target, source) as Goal;
        target.parent = source.parent;
    }

    queries = () => {
        return [] as Condition[];
    }

    default = () => {
        const Default: IGoal = {
            title: 'Default Goal',
            goalType: GoalType.NORMAL,
            startDate: MyDate.Now().toDate(),
            dueDate: MyDate.Now().toDate(),
            streakMinimum: 2,
            streakType: 'weekly',
            streakDailyStart: MyDate.Now().toDate(),
            streakWeeklyStart: 'sunday',
            streakMonthlyStart: 1,
            active: true,
            state: "open",
            rewardType: RewardTypes.NONE,
            penaltyType: PenaltyTypes.NONE,
            details: "",
            latestCycleId: "",
            lastRefreshed: MyDate.Now().toDate(),
            rewardId: "",
            penaltyId: "",
            parent: {
                id: "",
                type: GoalParentTypes.NONE,
            }
        };
        return Default;
    }


    queryOngoingStreakGoals = () => {
        return this.query(
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

    queryInactive = () => {
        return this.query(...Conditions.inactive());
    }

    queryFailed = () => {
        return this.query(...Conditions.failed());
    }

    inactiveGoals = async () => {
        return await this.queryInactive().fetch() as Goal[];
    }

    failedGoals = async() => {
        return await this.queryFailed().fetch() as Goal[];
    }

    queryLastDays = (count: number) => {
        let date = MyDate.Now().subtract(count - 1, "days").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date)
        );
    }

    queryLastDaysComplete = (count: number) => {
        let date = MyDate.Now().subtract(count - 1, "days").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date),
            ...Conditions.complete()
        );
    }

    queryLastMonths = (count: number) => {
        let date = MyDate.Now().subtract(count, "months").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date)
        );
    }

    queryLastMonthsComplete = (count: number) => {
        let date = MyDate.Now().subtract(count, "months").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date),
            ...Conditions.complete()
        );
    }
}

export default GoalQuery;

export class ActiveGoalQuery extends ModelQuery<Goal, IGoal>{ 
    constructor() {
        super(GoalSchema.table);
    }

    assign = (target: Goal, source: IGoal) => {
        return assignAll([], target, source) as Goal;
    }

    default = () => {
        let def = new GoalQuery().default();
        def.active = true;
        return def;
    }

    queries = () => {
        return new GoalQuery().queries().concat(
            Conditions.active()
        ) 
    }

    queryOverdue = () => {
        return this.query(
            ...[...Conditions.overdue()]
        );
    }

    queryStartedButNotDue = () => {
        return this.query(
            ...[...Conditions.started(), ...Conditions.notDue()]
        )
    }

    queryDueOrOverdue = () => {
        return this.query(
            Q.or(
                Q.and(
                    ...[...Conditions.overdue()]
                ),
                Q.and(
                    ...[...Conditions.dueToday()]
                )
            )
        )
    }

    queryDueToday = () => {
        return this.query(
            ...[...Conditions.dueToday()]
        );
    }

    queryNotStarted = () => {
        return this.query(
            ...[...Conditions.notStarted()]
        );
    }

    queryStarted = () => {
        return this.query(
            ...[
                ...Conditions.started()
            ]
        )
    }

    queryUnprocessed = () => {
        return this.query(
            ...[...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
            ]
        );
    }

    unprocessed = async () => {
        return (await this.queryUnprocessed().fetch()) as Goal[];
    }

    queryUnprocessedStreaks = () => {
        return this.query(
            ...[ ...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
                 ...Conditions.isStreak(),
            ]
        )
    }

    unprocessedStreaks = async () => {
        return (await this.queryUnprocessedStreaks().fetch()) as Goal[];
    }

}

export class CompleteGoalQuery extends ModelQuery<Goal, IGoal>{ 
    constructor() {
        super(GoalSchema.table);
    }

    assign = (target: Goal, source: IGoal) => {
        return assignAll([], target, source) as Goal;
    }

    default = () => {
        let def = new GoalQuery().default();
        def.active = false;
        def.state = "complete";
        return def;
    }

    queries = () => {
        return new GoalQuery().queries().concat(
            ...Conditions.complete()
        )
    }
}

export {
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
        const goals: Goal[] = await new ActiveGoalQuery().unprocessedStreaks();
        await GoalLogic.process(goals, n)
    }

    private static process = async (arr: Goal[], n?: number) => {
            
        let firstN = take(arr, n? n : arr.length);
        for(let i = 0; i < firstN.length; i++) {
            // Since only one transaction may run at a time (we cannot call batch without the full batch), 
            // we might as well do each transaction just 
            // one at a time.
            await new GoalLogic(firstN[i].id).generateNextStreakTasks();
        }
    }

    private isStreak = async () => {
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
    private metMinimum = async () => {
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        const activeTasks: number = await new ActiveTaskQuery().queryHasParent(this.id).fetchCount();
        const completedTasks: number = await new ChildTaskQuery(this.id).queryCompleted().fetchCount();
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
            switch(goal.streakType) {
                case "daily": {
                    unit = "days";
                } break;
                case "weekly": {
                    unit = "weeks";
                } break;
                default: {
                    unit = "months";
                }
            }

            /**
             * In reality, we only need to generate at most this cycle's new streaks and YESTERDAY's 
             * new streaks. This is because, if the phone has been off for 2 weeks, we assume the 
             * user does not want to come back to an avalanche of streaks to process. Instead,
             * we make allowance for the possibility that the user might lose the ability to charge
             * their phone for one cycle, so we only refresh this cycle cycle and the previous cycle by 
             * checking if they exist. If not, we create them.
             */
            const tx = await ActiveTransaction.new();
            let initialLatestCycle = await new ChildStreakCycleQuery(goal.id).latest();

            if(initialLatestCycle) {
                //Generate at most this cycle and previous cycle.
                const { latestCycleId, newTx } = 
                        await this._generateNextStreakTasks(initialLatestCycle, goal.id, unit, 
                                goal.currentCycleStart());

                tx.consume(newTx);

                tx.addUpdate(new GoalQuery(), goal, {
                    latestCycleId: latestCycleId ? latestCycleId : initialLatestCycle.id,
                    lastRefreshed: MyDate.Now().toDate(),
                })
            } else {
                // If there's no initial latest cycle at all, then there are no tasks. All we can do is add an initial cycle.
                tx.addCreate(new StreakCycleQuery(), {
                    parentGoalId: goal.id,
                    startDate: goal.currentCycleStart(),
                    endDate: goal.currentCycleEnd(),
                })
                tx.addUpdate(new GoalQuery(), goal, {
                    lastRefreshed: MyDate.Now().toDate(),
                });
            }

            await tx.commitAndReset();
        }
    }

    private _generateNextStreakTasks = async (latestCycle: StreakCycle, goalId: string, 
                                unit: "days" | "weeks" | "months",
                                currentCycleStart: Date): Promise<{ latestCycleId: string, newTx: InactiveTransaction }> => {
        const latestTasks: Task[] = await new TaskQuery().inStreakCycle(latestCycle.id);
        const latestCycleStart: Date = latestCycle.startDate;
        // If there was no cycle created after the latest known generated cycle, 
        // we keep generating cycles until we've also generated the current cycle.
        const tx = InactiveTransaction.new();
        let latestCycleId = "";

        /*Returns latest open cycles in sorted order, ascending* */
        const latestOpenCycles = await getLatestOpenCycles(currentCycleStart);
        const promises = latestOpenCycles.map(async (cycle, index) => {
            const newCycle = tx.addCreate(new StreakCycleQuery(), {
                parentGoalId: goalId,
                startDate: cycle.start,
                endDate: cycle.end,
            })
            const promises = latestTasks.map(async (latestTask) => {
                const cloneTx = await TaskLogic.cloneRelativeTo(latestCycleStart, cycle.start, latestTask, {
                    id: newCycle.id,
                    type: TaskParentTypes.CYCLE,
                });
                tx.consume(cloneTx);
            });

            await Promise.all(promises);
            if(index === latestOpenCycles.length - 1) {
                latestCycleId = newCycle.id;
            }
        })

        await Promise.all(promises)

        return {
            newTx: tx,
            latestCycleId: latestCycleId,
        }

        async function getLatestOpenCycles(currentCycleStart: Date) {
            const openCycles: { start: Date, end: Date }[] = [];

            const promises = R.map((n) => {
                const cycleStart = new MyDate(currentCycleStart).subtract(n, unit).asStartDate().toDate();
                return new StreakCycleQuery().exists(cycleStart, goalId, unit).then((cycles) => {
                    if(cycles.length === 0) {
                        openCycles.push({
                            start: cycleStart,
                            end: new MyDate(cycleStart).addIncompleteCycle(unit).toDate(),
                        })
                    }
                })

            }, R.reverse(R.range(0, 2)))

            await Promise.all(promises)

            return openCycles;
        }
    }

    /**
     * Creates a new goal based on an old goal. Start/Due dates have the same relation to new Date that
     * the old goal's start/due dates had to the oldDate.
     */
    static cloneRelativeTo = (oldDate: Date, newDate: Date, goal: Goal) => {
        const newStart = new MyDate(newDate).add( new MyDate(goal.startDate).diff(oldDate, "minutes"), "minutes");
        const newGoal : IGoal = {
            title: goal.title,
            details: goal.details,
            goalType: goal.goalType,
            state: 'open',
            active: true,
            rewardType: goal.rewardType,
            streakMinimum: goal.streakMinimum,
            streakDailyStart: goal.streakDailyStart,
            streakMonthlyStart: goal.streakMonthlyStart,
            streakType: goal.streakType,
            streakWeeklyStart: goal.streakWeeklyStart,
            startDate: newStart.toDate(),
            dueDate: new MyDate(newDate).add( new MyDate(goal.dueDate).diff(oldDate, "minutes"), "minutes").toDate(),
            latestCycleId: "", //starts with no cycle? No, it should start with a cycle, and tasks in the cycle
            lastRefreshed: goal.lastRefreshed,
            rewardId: goal.rewardId,
            penaltyType: goal.penaltyType,
            penaltyId: goal.penaltyId,
            parent: goal.parent,
        }
        return newGoal;
    }

    update = async (goalData: Partial<IGoal>) => {
        // no reason to touch the latest cycle concept here.
        //goalData.latestCycleId = new MyDate(goalData.startDate).prevMidnight().toDate();
        const goal = await new GoalQuery().get(this.id);
        if(goal) {
            const children = await new ChildTaskQuery(goal.id).all();
            const message = validateAgainstChildren(goalData, children);
            if(message === undefined) {
                const tx = await ActiveTransaction.new();
                tx.addUpdate(new GoalQuery(), goal, goalData);
                tx.commitAndReset();
                return undefined;
            } else {
                return message;
            }
        }

        function validateAgainstChildren(data: Partial<IGoal>, children: Task[]) {
            let message = "";
            const invalid = children.find((task) => {
                if(data.startDate && task.startDate < data.startDate) {
                    message = "Goal update failed: New start date is after the date of a subtask";
                    return true;
                }

                if(data.dueDate && task.dueDate > data.dueDate) {
                    message = "Goal update failed: New due date is before the date of a subtask";
                    return true;
                }

                return false;
            })
            
            if(invalid) {
                return message;
            }
            return undefined;
        }
    }

    static create = async (goalData: Partial<IGoal>, repeats: "never" | "daily" | "weekly" | "monthly") => {

        const tx = await ActiveTransaction.new();
        const goal = tx.addCreate(new GoalQuery(), goalData);

        if(goal.goalType === GoalType.STREAK) {
            tx.addCreate(new StreakCycleQuery(), {
                parentGoalId: goal.id,
                startDate: goal.currentCycleStart(),
                endDate: goal.currentCycleEnd()
            })
        }

        await tx.commitAndReset();

        return goal;
    }

    complete = async () => {
        if( await this.isStreak() && (! (await this.metMinimum()))) {
              return "Goal cannot be completed. Streak minimum has not been met yet.";
        } else {
            const tx = await ActiveTransaction.new();
            tx.consume(await this.completeGoalAndDescendants({
                id: this.id
            }));

            tx.consume(await this.earnReward())
            await tx.commitAndReset();

            return undefined;
        }

    }

    private earnReward = async () => {
        const tx = InactiveTransaction.new();
        const goal: IGoal | null = await new GoalQuery().get(this.id);
        if(goal) {
            switch(goal.rewardType) {
                case RewardTypes.NONE: {
                    // If none, do nothing. No reward was earned.
                } break;
                case RewardTypes.SPECIFIC: {
                    tx.consume(await EarnedRewardLogic.earnSpecific(goal.rewardId, this.id));
                };
                default: {
                    tx.addCreate(new EarnedRewardQuery(), {
                        earnedDate: MyDate.Now().toDate(),
                        type: goal.rewardType,
                        goalId: this.id,
                    })
                }
            }
        }
        return tx;
    }

    fail = async () => {
        const tx = await ActiveTransaction.new();
        tx.consume( await this.failGoalAndDescendants({
            id: this.id
        }));

        tx.consume( await this.earnPenalty() );

        await tx.commitAndReset();
    }

    private earnPenalty = async () => {
        const tx = InactiveTransaction.new();
        const goal = await new GoalQuery().get(this.id);
        if(goal) {
            switch(goal.penaltyType) {
                case PenaltyTypes.NONE: {
                    // Nothing
                } break;
                case PenaltyTypes.SPECIFIC: {
                    tx.consume(await EarnedPenaltyLogic.earnSpecific(goal.penaltyId, this.id))
                } break;
                default: {
                    // Nothing for now.
                }
            }
        }

        return tx;
    }

    private completeGoalAndDescendants = async ( opts: { id: string}) => {
        return await this.actionGoalAndDescendants("complete", opts.id);
    }

    private actionGoalAndDescendants = async (action: "complete" | "fail", id: string) => {
        const tx = new InactiveTransaction();
        const goal = await new GoalQuery().get(id);
        if(goal) {
            const update = getUpdate(action);
            [goal].forEach((g) => {
                tx.addUpdate(new GoalQuery(), g, {
                    ...update
                })
            })

            const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, goal.id, []);
            allTasks.forEach((task: Task) => {
                tx.addUpdate(new TaskQuery(), task, {
                    ...update
                })
            });
        }

        return tx;

        function getUpdate(action: "complete" | "fail") {
            switch(action) {
                case "complete": {
                    return {
                        active: false,
                        state: 'complete',
                    } as const;
                }
                case "fail": {
                    return {
                        active: false,
                        state: 'cancelled',
                    } as const;
                }
            }
        }
    }

    private failGoalAndDescendants = async(opts: { id: string}) => {
        return await this.actionGoalAndDescendants("fail", opts.id);
    }
}
