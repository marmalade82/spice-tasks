import DB from "src/Models/Database";


class GoalQuery {
    static queryAll = () => {
        return DB.get().collections.get('goals').query();
    };

    static all = () => {
        GoalQuery.queryAll().fetch();
    }

}

export default GoalQuery;
