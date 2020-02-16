
import { Q, Database, Model } from "@nozbe/watermelondb";
import { ChildSchema, ActiveSchema, StateSchema } from "src/Models/base/SharedSchema";
import { TaskSchema } from "src/Models/Task/TaskSchema";
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import GoalSchema from "src/Models/Goal/GoalSchema";
import { GoalType } from "../Goal/GoalLogic";

const name = TaskSchema.name;
const goalName = GoalSchema.name ;

function inactiveConditions() {
    return [
        Q.where(name.ACTIVE, false)
    ]
}

function inactiveChildConditions(parent_id: string) {
    return [
        inactiveConditions(),
        childConditions(parent_id),
    ].flat()
}

function activeConditions() {
    return [
        Q.where(name.ACTIVE, true)
    ]
}

function activeChildConditions(parent_id: string) {
    return [
        activeConditions(),
        childConditions(parent_id),
    ].flat()
}

function childConditions(parent_id: string) {
    return [
        Q.where(name.PARENT, parent_id)
    ]
}

function openConditions() {
    return [
        Q.where(name.STATE, 'open')
    ]
}

function completeConditions() {
    return [
        Q.where(name.STATE, 'complete')
    ]
}

function dueTodayConditions() {
    return [
        Q.where(name.DUE_ON, Q.lt(new MyDate().nextMidnight().toDate().valueOf())),
        Q.where(name.DUE_ON, Q.gte(new MyDate().prevMidnight().toDate().valueOf())),
    ]
}

function dueInFutureConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(new MyDate().toDate().valueOf()))
    ]
}

function overdueConditions() {
    return [
        Q.where(name.DUE_ON, Q.lt(new MyDate().toDate().valueOf())),
    ];
}

function startedConditions() {
    return [
        Q.where(name.STARTS_ON, Q.lte(new MyDate().toDate().valueOf())),
    ]
}

function notDueConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(new MyDate().nextMidnight().toDate().valueOf()))
    ]
}

function notStartedConditions() {
    return [
        Q.where(name.STARTS_ON, Q.gt(new MyDate().toDate().valueOf())),
    ]
}

function completedTodayConditions() {
    return [
        Q.where(name.COMPLETED_ON, Q.lt(new MyDate().nextMidnight().toDate().valueOf())),
        Q.where(name.COMPLETED_ON, Q.gte(new MyDate().prevMidnight().toDate().valueOf())),
    ]
}

function notOverdueConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(new MyDate().toDate().valueOf()))
    ]
}

function streakConditions() {
    return [
        Q.where(goalName.TYPE, GoalType.STREAK)
    ]
}

function failedConditions() {
    return [
        Q.where(name.ACTIVE, false),
        Q.where(name.STATE, "cancelled"),
    ]
}

function createdAfterConditions(d: Date) {
    return [
        Q.where(name.CREATED_ON, Q.gt(d.valueOf()))
    ]
}

function createdBeforeConditions(d: Date) {
    return [
        Q.where(name.CREATED_ON, Q.lt(d.valueOf()))
    ]
}

export const Conditions = {
    active: activeConditions,
    activeChild: activeChildConditions,
    child: childConditions,
    inactive: inactiveConditions,
    inactiveChild: inactiveChildConditions,
    open: openConditions,
    complete: completeConditions,
    dueToday: dueTodayConditions,
    dueInFuture: dueInFutureConditions,
    overdue: overdueConditions,
    started: startedConditions,
    notDue: notDueConditions,
    notStarted: notStartedConditions,
    completedToday: completedTodayConditions,
    failed: failedConditions,
    isStreak: streakConditions,
    notOverdue: notOverdueConditions,
    createdAfter: createdAfterConditions,
    createdBefore: createdBeforeConditions,
}



export async function findAllChildrenIn<M extends Model>(table: string, parentId: string, models: M[]): Promise<M[]> {
    if(parentId === '') {
        return models;
    }

    const children = await DB.get().collections.get(table).query(
        Q.where('parent_id', parentId)
    ).fetch()

    const descendants = await Promise.all(children.map(async (child: M) => {
        return await findAllChildrenIn(table, child.id, [child])
    }));

    return descendants.flat().concat(models);
}