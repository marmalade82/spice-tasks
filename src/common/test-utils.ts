
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import { Model } from "@nozbe/watermelondb";
import { Task, ITask } from "src/Models/Task/Task";
import { Goal, IGoal } from "src/Models/Goal/Goal";
import EarnedReward, { IEarnedReward } from "src/Models/Reward/EarnedReward";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";

function makeNavigation(params: {}) {
    const navigation = {
        navigate: jest.fn(),
        getParam: jest.fn((param: string, fallback: any) => {
            if(params[param] !== undefined) {
                return params[param];
            } else {
                return fallback;
            }
        }),
        goBack: jest.fn(),
    }
    return navigation;
}

async function destroyAllIn(table: string) {
    let models = await DB.get().collections.get(table).query().fetch();

    await DB.get().action(async() => {
        models.forEach(async (model: Model) => {
            await model.destroyPermanently();
        });
    });

    models = await DB.get().collections.get(table).query().fetch();

    expect(models.length).toEqual(0);
}

async function _create(table: string, data: any ) {
    return await DB.get().collections.get(table).create((target: Model) => {
        Object.assign(target, data);
    });
}

async function createTasks(data: Partial<ITask>, count: number) {
    let tasks: Task[] = [];
    for(let i = 0; i < count; i++) {
        let task = await _create('tasks', data) as Task;        
        tasks.push(task);
    }

    return tasks;
}

async function createGoals(data: Partial<IGoal>, count: number) {
    let goals: Goal[] = [];
    for(let i = 0; i < count; i++) {
        let goal = await _create('goals', data) as Goal;
        goals.push(goal);
    }
    return goals;
}

async function createEarnedRewards(data: Partial<IEarnedReward>, count: number) {
    /*
    let earned: EarnedReward[] = [];
    for(let i = 0; i < count; i++) {
        let earn = await _create('earnedrewards', data) as EarnedReward;
        earned.push(earn);
    }
    return earned;
    */
    return (await _createModels(EarnedRewardSchema.table, data, count)) as EarnedReward[];

}

async function _createModels<M extends Model>(table: string, data: any, count: number) {
    let models: M[] = [];
    for(let i = 0; i < count; i++) {
        let model = await _create(table, data) as M;
        models.push(model);
    }
    return models;
}

export {
    makeNavigation,
    destroyAllIn,
    createTasks,
    createGoals,
    createEarnedRewards,
}
