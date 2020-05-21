
import Goal, { IGoal } from "../Goal/Goal";
import GoalQuery from "../Goal/GoalQuery";
import Task, { ITask } from "../Task/Task";
import TaskQuery, { ChildTaskQuery } from "../Task/TaskQuery";
import { map } from "rxjs/operators";
import StreakCycleQuery, { ChildStreakCycleQuery } from "../Group/StreakCycleQuery";
import StreakCycle, { IStreakCycle } from "../Group/StreakCycle";
import { loadPartialConfig } from "@babel/core";
import { Observable, Subscription } from "rxjs";


export abstract class Context<M> {
    private init: boolean = false;
    private unsubscribe: (() => void)[] = [];
    private notifiers: (() => void)[] = [];

    constructor() {

    }

    notify = () => {
        this.notifiers.forEach((notifier) => {
            notifier();
        })
    }

    addUnsubscribe = (unsub: () => void) => {
        this.unsubscribe.push(unsub);
    }

    observe = () => {
        return new Observable<this>((subscriber) => {
            this.notifiers.push(() => {
                subscriber.next(this);
            })
            subscriber.next(this);
            return () => {
                this.destroy();
            }
        })

    }

    checkInit = () => {
        if(!this.init) {
            throw new Error("Context method was called without initialization");
        }
    }

    initFailed = () => {
        throw new Error("Initialization failed");
    }

    get isInitialized() {
        return this.init;
    }

    markInitialized = () => {
        this.init = true;
    }

    destroy = () => {
        this.unsubscribe.forEach((unsub) => {
            unsub();
        })
    }

    abstract initialize: () => void;

    protected abstract val: <K extends keyof M> (field: K) => M[K];

}

// Inserts the initialization function into the method
export function requireInit() {
    return function(_target: any, name: string, descriptor?: PropertyDescriptor) {
        if(descriptor) {
            const original = descriptor.value;
            if(original !== undefined && typeof original === "function") {
                descriptor.value = function(...args) {
                    this.checkInit();
                    return original.apply(this, args);
                }
            }
        }
    }
}

export function fieldFrom() {
    return function(_target: any, name: string, descriptor?: TypedPropertyDescriptor<any>) {
        return {
            set: function (value) {
                this.checkInit();
                this.updates[name] = value;
            },
            get: function() {
                this.checkInit();
                return this.val(name);
            },
            enumerable: true,
            configurable: true
        } as any;
    }
}

type OmitHabit = "parent" | "streakDailyStart" | "streakWeeklyStart" | "streakMonthlyStart" | "latestCycleId" | "streakMinimum" |
                    "lastRefreshed" | "streakType";
export class GoalContext extends Context<IGoal> implements 
            Omit<IGoal, OmitHabit> {
    id: string;
    goal!: Goal;
    private tasks!: Task[];
    private updates!: IGoal;

    constructor(id: string) {
        super();
        this.id = id;
        this.updates = { } as any;
    }

    initialize = async () => {
        const goal = await new GoalQuery().get(this.id);

        if(!goal){
            return this.initFailed();
        }

        // We want to make sure that whatever values that this goal has are kept updated in the context
        (() => {
            this.goal = goal;
            const sub = goal.observe().subscribe((goal) => {
                this.goal = goal;
            })

            this.addUnsubscribe(() => sub.unsubscribe())
        })();


        let r = () => {}
        const loading = new Promise((resolve, reject) => {
            r = resolve;
        });

        // We want to load all tasks immediately
        (() => {
            const sub = new ChildTaskQuery(goal.id).queryAll().observe().pipe(map((tasks) => {
                return tasks;
            })).subscribe((tasks) => {
                this.tasks = tasks;

                if(!this.isInitialized) {
                    r();
                }
            });

            this.addUnsubscribe(() => sub.unsubscribe())

        })();

        await loading;
        this.markInitialized();
    }

    protected val = <K extends keyof IGoal>(field: K): IGoal[K] => {
        return (this.updates[field] !== undefined ? this.updates[field] : this.goal[field]);
    }

    @fieldFrom() title!: IGoal["title"]
    @fieldFrom() details!: IGoal["details"]
    @fieldFrom() goalType!: IGoal["goalType"];
    @fieldFrom() state!: IGoal["state"];
    @fieldFrom() active!: IGoal["active"];
    @fieldFrom() rewardType!: IGoal["rewardType"];
    @fieldFrom() penaltyType!: IGoal["penaltyType"];
    @fieldFrom() rewardId!: IGoal["rewardId"];
    @fieldFrom() penaltyId!: IGoal["penaltyId"];
    
    // Start date is calculated from the goal's tasks
    @requireInit()
    get startDate() {
        return findStart(this.tasks);
    }

    // Due date is calculated from the goal's tasks
    @requireInit()
    get dueDate() {
        return findEnd(this.tasks);
    }
}

type OmitGoal = "parent" | "streakDailyStart" | "streakWeeklyStart" | "streakMonthlyStart";

export class HabitContext extends Context<IGoal> implements Omit<IGoal, OmitGoal> {
    id: string;
    goal!: Goal;
    private updates: IGoal = { } as any;
    private cycles!: StreakCycleContext[];

    constructor(id: string) {
        super();
        this.id = id;
    }

    initialize = async () => {
        const goal = await new GoalQuery().get(this.id);

        if(!goal){
            return this.initFailed();
        }

        (() => {
            // We want to make sure that whatever values that this goal has are kept updated in the context
            this.goal = goal;
            const sub = goal.observe().subscribe((goal) => {
                this.goal = goal;
            })

            this.addUnsubscribe(() => sub.unsubscribe())

        })()

        let r = () => {}
        const loading = new Promise((resolve, reject) => {
            r = resolve;
        });

        (() => {
            // We want to load all cycles immediately
            const sub = new ChildStreakCycleQuery(goal.id).queryAll().observe().pipe(map((cycles) => {
                const promises = cycles.map(async (cycle) => {
                    const context = new StreakCycleContext(cycle.id);
                    await context.initialize();
                    return context;
                })

                const result = Promise.all(promises);
                return result;
            })).subscribe(async (promise) => {
                const cycles = await promise;
                this.cycles = cycles;

                if(!this.isInitialized) {
                    r();
                }
            })

            this.addUnsubscribe(() => sub.unsubscribe());
        })()

        await loading;
        this.markInitialized();
    }

    protected val = <K extends keyof IGoal>(field: K): IGoal[K] => {
        return (this.updates[field] !== undefined ? this.updates[field] : this.goal[field]);
    }

    @fieldFrom() streakType!: IGoal["streakType"]
    @fieldFrom() latestCycleId!: IGoal["latestCycleId"]
    @fieldFrom() streakMinimum!: IGoal["streakMinimum"]
    @fieldFrom() lastRefreshed!: IGoal["lastRefreshed"]
    @fieldFrom() title!: IGoal["title"]
    @fieldFrom() details!: IGoal["details"]
    @fieldFrom() goalType!: IGoal["goalType"];
    @fieldFrom() state!: IGoal["state"];
    @fieldFrom() active!: IGoal["active"];
    @fieldFrom() rewardType!: IGoal["rewardType"];
    @fieldFrom() penaltyType!: IGoal["penaltyType"];
    @fieldFrom() rewardId!: IGoal["rewardId"];
    @fieldFrom() penaltyId!: IGoal["penaltyId"];

    @requireInit()
    get startDate() {
        return findStart(this.cycles);
    }


    @requireInit()
    get dueDate() {
        return findEnd(this.cycles);
    }
}


export class StreakCycleContext extends Context<IStreakCycle> implements Omit<IStreakCycle, "type"> {
    id: string;
    cycle!: StreakCycle;
    private tasks!: Task[];
    private updates: IStreakCycle = { } as any;
    
    constructor(id: string) {
        super();
        this.id = id;
    }

    initialize = async () => {
        const cycle = await new StreakCycleQuery().get(this.id);
        if(!cycle) {
            return this.initFailed();
        }

        (() => {
            // We want to make sure that whatever values that this cycle has are kept updated in the context
            this.cycle = cycle;
            const sub = cycle.observe().subscribe((cycle) => {
                this.cycle = cycle;
            })

            this.addUnsubscribe(() => sub.unsubscribe())
        })()

        let r = () => {}
        const loading = new Promise((resolve, reject) => {
            r = resolve;
        });

        (() => {
            // We want to load all tasks immediately
            const sub = new ChildTaskQuery(cycle.id).queryAll().observe().pipe(map((tasks) => {
                return tasks.map(task => task.task)
            })).subscribe((tasks) => {
                this.tasks = tasks;

                if(!this.isInitialized) {
                    r();
                }
            })

            this.addUnsubscribe(() => sub.unsubscribe());
        })();

        await loading;
        this.markInitialized();
    }

    protected val = <K extends keyof IStreakCycle>(field: K): IStreakCycle[K] => {
        return (this.updates[field] !== undefined ? this.updates[field] : this.cycle[field]);
    }
    
    @fieldFrom() parentGoalId!: IStreakCycle["parentGoalId"];
    
    @requireInit()
    get startDate() {
        return findStart(this.tasks);
    }

    @requireInit()
    get endDate() {
        return findEnd(this.tasks);
    }
}


interface Starts {
    startDate: Date;
}

function findStart(t: Starts[]) {
    const sorted = t.sort((a, b) => {
        return a.startDate.valueOf() - b.startDate.valueOf();
    })
    if(sorted[0]) {
        return sorted[0].startDate;
    } else {
        return new Date(NaN);
    }
}

function findEnd(t: Starts[]) {
    const sorted = t.sort((a, b) => {
        return b.startDate.valueOf() - a.startDate.valueOf();
    })
    if(sorted[0]) {
        return sorted[0].startDate;
    } else {
        return new Date(NaN);
    }
}
