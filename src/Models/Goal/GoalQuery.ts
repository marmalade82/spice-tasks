import DB from "src/Models/Database";
import { Goal, IGoal} from "src/Models/Goal/Goal";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Task, ITask } from "src/Models/Task/Task";
import ModelQuery from "src/Models/base/Query";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils";

class GoalQuery extends ModelQuery<Goal, IGoal>{
    constructor() {
        super(GoalSchema.table);
    }

    default = () => {
        const Default = {
            title: 'Default Goal',
            goalType: 'normal',
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
        } as const;
        return Default;
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

    inactiveGoals = async () => {
        return await this.queryInactive().fetch() as Goal[];
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

                DB.get().action(async() => {
                    DB.get().batch(...[...allGoalsPrep, ...allTasksPrep]);
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
