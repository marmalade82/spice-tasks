
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import { Model } from "@nozbe/watermelondb";
import { Task, ITask } from "src/Models/Task/Task";
import { Goal, IGoal } from "src/Models/Goal/Goal";
import EarnedReward, { IEarnedReward } from "src/Models/Reward/EarnedReward";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from "src/Models/Task/TaskSchema";
import RewardSchema from "src/Models/Reward/RewardSchema";
import ClaimedReward, { IClaimedReward } from "src/Models/Reward/ClaimedReward";
import { PenaltySchema } from "src/Models/Penalty/PenaltySchema";
import Penalty, { IPenalty } from "src/Models/Penalty/Penalty";
import ClaimedRewardSchema from "src/Models/Reward/ClaimedRewardSchema";
import { IReward, Reward } from "src/Models/Reward/Reward";

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
    jest.useRealTimers();
    let models = await DB.get().collections.get(table).query().fetch();

    await DB.get().action(async() => {
        await DB.get().batch(
            ...models.map((model) => {
                return model.prepareDestroyPermanently();
            })
        )
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

async function createRewards(data: Partial<IReward>, count: number) {
    return (await _createModels(RewardSchema.table, data, count)) as Reward[];
}

async function createEarnedRewards(data: Partial<IEarnedReward>, count: number) {
    return (await _createModels(EarnedRewardSchema.table, data, count)) as EarnedReward[];

}

async function createClaimedRewards(data: Partial<IClaimedReward>, count: number) {
    return (await _createModels(ClaimedRewardSchema.table, data, count)) as ClaimedReward[];
}

async function createPenalties(data: Partial<IPenalty>, count: number) {
    return (await _createModels(PenaltySchema.table, data, count)) as Penalty[];
}

async function _createModels<M extends Model>(table: string, data: any, count: number) {
    let models: M[] = [];
    for(let i = 0; i < count; i++) {
        let model = await _create(table, data) as M;
        models.push(model);
    }
    return models;
}

async function destroyAll() {
    jest.useRealTimers();
    const tables: string[] = [
        GoalSchema.table, TaskSchema.table, RewardSchema.table,
        EarnedRewardSchema.table, ClaimedReward.table, PenaltySchema.table,
    ];
    const destroys = tables.map((name: string) => {
        return destroyAllIn(name);
    })
    await Promise.all(destroys);
}

export {
    makeNavigation,
    destroyAllIn,
    destroyAll,
    createTasks,
    createGoals,
    createEarnedRewards,
    createClaimedRewards,
    createPenalties,
    createRewards,
}
