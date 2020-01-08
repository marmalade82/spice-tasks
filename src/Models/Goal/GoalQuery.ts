import DB from "src/Models/Database";
import { Goal, IGoal} from "src/Models/Goal/Goal";


class GoalQuery {
    static goals = () => {
        return DB.get().collections.get('goals');
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
        try {
            DB.get().action(async () => {
                GoalQuery.goals().create((goal: Goal) => {
                    Object.assign(goal, props);
                });
            });
        } catch {

        }
    }

}

export default GoalQuery;
export {
    GoalQuery,
    Goal,
    IGoal,
}
