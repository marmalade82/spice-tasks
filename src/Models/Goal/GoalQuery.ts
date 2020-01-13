import DB from "src/Models/Database";
import { Goal, IGoal} from "src/Models/Goal/Goal";
import GoalSchema from "src/Models/Goal/GoalSchema";

class GoalQuery {
    static goals = () => {
        return DB.get().collections.get(GoalSchema.table);
    }

    static queryAll = () => {
        return GoalQuery.goals().query();
    };

    static all = () => {
        GoalQuery.queryAll().fetch();
    }

    static get = async (id: string) => {
        try {
            const goal = await GoalQuery.goals().find(id)
            return goal as Goal;
        } catch {
            return null;
        }
    }

    static create = async (props: Partial<IGoal>) => {
        const Default: IGoal = {
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
        };

        DB.get().action(async () => {
            GoalQuery.goals().create((goal: Goal) => {
                Object.assign(goal, Default);
                Object.assign(goal, props);
            });

        });
    }

    static update = async(goal: Goal, props: Partial<IGoal>) => {
        DB.get().action(async () => {
            goal.update((goal: Goal) => {
                Object.assign(goal, props);
            });
        });
    }

}

export default GoalQuery;
export {
    GoalQuery,
    Goal,
    IGoal,
}
