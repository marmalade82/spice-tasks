
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
import Penalty, { IPenalty } from "src/Models/Penalty/Penalty";
import { IReward, Reward } from "src/Models/Reward/Reward";
import Recur, { IRecur } from "src/Models/Recurrence/Recur";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";
import { GlobalSchema } from "src/Models/Global/GlobalSchema";
import Global, { IGlobal } from "src/Models/Global/Global";
import GlobalQuery from "src/Models/Global/GlobalQuery";
import EarnedPenalty, { IEarnedPenalty } from "src/Models/Penalty/EarnedPenalty";
import { StreakCycle, IStreakCycle } from "src/Models/Group/StreakCycle";
import { GroupSchema } from "src/Models/Group/GroupSchema";
import { exportDefaultDeclaration } from "@babel/types";

var chance = require("chance");
var Chance = new chance();

function makeNavigation(params: {}, key?: string): any {
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
        state: {
            key: Chance.guid(),
        }
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

export async function createGlobal(data: Partial<IGlobal>) {
    return await _create(GlobalSchema.table, data) as Global;
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

export async function createRecurrences(data: Partial<IRecur>, count: number) {
    return (await _createModels(RecurSchema.table, data, count)) as Recur[];
}

export async function createStreakCycles(data: Partial<IStreakCycle>, count: number) {
    data.type = "streak_cycle";
    return (await _createModels(GroupSchema.table, data, count)) as StreakCycle[];
}

async function createRewards(data: Partial<IReward>, count: number) {
    data.type = "reward";
    return (await _createModels(RewardSchema.table, data, count)) as Reward[];
}

async function createEarnedRewards(data: Partial<IEarnedReward>, count: number) {
    data.classType = "reward";
    return (await _createModels(EarnedRewardSchema.table, data, count)) as EarnedReward[];

}

async function createEarnedPenalties(data: Partial<IEarnedPenalty>, count: number) {
    data.classType = "penalty";
    return (await _createModels(EarnedRewardSchema.table, data, count)) as EarnedPenalty[];
}


async function createPenalties(data: Partial<IPenalty>, count: number) {
    data.type = "penalty";
    return (await _createModels(RewardSchema.table, data, count)) as Penalty[];
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
        EarnedRewardSchema.table,
        GlobalSchema.table, RecurSchema.table, GroupSchema.table,
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
    createEarnedPenalties,
    createPenalties,
    createRewards,
}

export function waitForAsyncLifecycleMethods(time?: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time ? time : 1000);
    })
}

export async function asyncTestWithTag(tag: string, expectation: any, ...args: any[]) {
    try {
        await expectation(...args);
    } catch (e) {
        e.message = tag + "\n" + e.message
        throw e;
    }
}

