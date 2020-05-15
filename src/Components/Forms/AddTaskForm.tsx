
import { makeForm, thread, required, wrap, startsWithinRange, flatSchema } from "./common/Form";
import { ValidationResult, CheckValid, CheckReadonly, CheckHide, HideMap, ReadonlyMap, ValidationMap } from "@marmalade82/ts-react-forms";
import GoalQuery from "src/Models/Goal/GoalQuery";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import TaskQuery from "src/Models/Task/TaskQuery";

const remindChoices = [
    {label: "No", value: "no", key: "no"},
    {label: "Yes", value: "yes", key: "yes"},
]

const repeatChoices = [
    {label: "Daily", value: "daily", key: "daily"},
    {label: "Weekly", value: "weekly", key: "weekly"},
    {label: "Monthly", value: "monthly", key: "monthly"},
    {label: "Don't Repeat", value: "stop", key: "stop"},
]

const placeholderProps = {
    name: { placeholder: "Name of this task"},
    description: { placeholder: "Description of this task"},
}

const basicValidation = {
    name: async (data: any) => thread(data, required("name", "Name")),
    ["start-date"]: async (data: any) => thread(data, required("start-date", "Start Date")),
    ["start-time"]: async (data: any) => thread(data, required("start-time", "Time"))
}

export enum Mode {
    CREATE_NO_PARENT,
    EDIT_NO_PARENT,
    
    CREATE_GOAL_PARENT,
    EDIT_GOAL_PARENT, 

    CREATE_CYCLE_PARENT,
    EDIT_CYCLE_PARENT,

    CREATE_TASK_PARENT,
    EDIT_TASK_PARENT,

    UNDETERMINED,
}

export type FullData = {
    ["id"]: string,
    ["parent_id"]: string,
    ["name"]: string,
    ["description"]: string,
    ["start-date"]: Date,
    ["start-time"]: Date,
    ["repeats"]: string,
    ["reminder"]: string,
}

const FullSchema = {
    id: [""],
    parent_id: [""],
    name: [""],
    description: [""],
    ["start-date"]: [new Date()],
    ["start-time"]: [new Date()],
    ["repeats"]: [""],
    ["reminder"]: [""],
}

const FullValidate = (data: any) => flatSchema<FullData>(data, FullSchema);

const FullForm = makeForm<FullData>([
    { label: "ID", name: "id", type: "text"},
    { label: "Parent ID", name: "parent_id", type: "text"},
    { label: "Name", name: "name", type: "text"},
    { label: "Description", name: "description", type: "multi_text"},
    { label: "Start Date", name: "start-date", type: "date"},
    { label: "Time", name: "start-time", type: "time"},
    { label: "Repeat", name: "repeats", type: "choice", default: "daily"},
    { label: "Remind me?", name: "reminder", type: "choice", default: "no"}
])

const FullLogic = {
    choices: (_mode: Mode) => { return {
        reminder: remindChoices,
        repeat: repeatChoices,
    }},
    props: (_mode: Mode) => { return {
        ...placeholderProps
    }},
    validate: (mode: Mode) => GenValidateLogic(mode),
    readonly: (mode: Mode) => GenReadonlyLogic(mode),
    hide: (mode: Mode) => GenHideLogic(mode),
}

export const FullTaskForm = {
    Validate: FullValidate,
    Form: FullForm,
    Logic: FullLogic,
}


function GenValidateLogic(mode: Mode): ValidationMap<FullData> {

    switch(mode) {
        case Mode.UNDETERMINED: {
            return {}
        }
        case Mode.CREATE_NO_PARENT: {
            return {
                name: async (data) => ["ok", ""]
            }
        }
        case Mode.EDIT_NO_PARENT: {
            return GenValidateLogic(Mode.CREATE_NO_PARENT);
        }
        case Mode.CREATE_TASK_PARENT: {
            // If task is parent, we will hide date/time fields, so no need to validate those against parent.
            return {
                ...basicValidation
            }
        }
        case Mode.EDIT_TASK_PARENT: {
            return GenValidateLogic(Mode.CREATE_TASK_PARENT);
        }
        case Mode.CREATE_GOAL_PARENT: {
            return {
                name: basicValidation.name,
                ["start-date"]: async (data) => {
                    const goal = await new GoalQuery().get(data.parent_id);
                    if(goal) {
                        const res = thread(data, startsWithinRange(goal.startDate, goal.dueDate, "start-date", "Start Date"));
                        return await wrap(basicValidation.name)(res);
                    }

                    return ["error", "No goal parent found"]
                },
                ["start-time"]: basicValidation["start-time"]
            };
        }
        case Mode.EDIT_GOAL_PARENT: {
            return GenValidateLogic(Mode.CREATE_GOAL_PARENT);
        }
        case Mode.CREATE_CYCLE_PARENT: {
            return {
                name: basicValidation.name,
                ["start-date"]: async (data) => {
                    const cycle = await new StreakCycleQuery().get(data.parent_id);
                    if(cycle) {
                        const res = thread(data, startsWithinRange(cycle.startDate, cycle.endDate, "start-date", "Start Date"));
                        return await wrap(basicValidation.name)(res);
                    }

                    return ["error", "No cycle parent found"]
                },
                ["start-time"]: basicValidation["start-time"]
            }
        }
        case Mode.EDIT_CYCLE_PARENT: {
            return GenValidateLogic(Mode.CREATE_CYCLE_PARENT);
        }
        default: {
            return {};
        }
    }
}

function GenReadonlyLogic(mode: Mode): ReadonlyMap<FullData> {
    switch(mode) {
        default: {
            return {};
        }
    }
}

const alwaysHide = {
    id: async () => true,
    apple: async () => true,
}


function GenHideLogic(mode: Mode): HideMap<FullData> {
    let hide = {} as HideMap<FullData> 
    switch(mode) {
        // Generally, if something has a parent, we don't allow the user to specify repeating or reminders on it.
        // Also, validation SHOULD NOT RUN on a hidden field. That just makes sense.
        case Mode.UNDETERMINED: {
            hide = {
            };
        }
        case Mode.CREATE_NO_PARENT: {
            hide = {
            }; // With no parent, we can view all fields
        }
        case Mode.EDIT_NO_PARENT: {
            hide = {
                repeats: async (data) => {
                    const self = await new TaskQuery().get(data.id);
                    if(self) {
                        return self.nextRepeatCalculated === true
                    } 

                    throw new Error("No task found while editing")
                },
            } // We cannot see the repeat field if it's already been repeated.
        }
        case Mode.CREATE_TASK_PARENT: {
            hide = {
                ["start-date"]: async () => true,
                ["start-time"]: async () => true,
                ["reminder"]: async () => true,
                ["repeats"]: async () => true,
            }
        }
        case Mode.EDIT_TASK_PARENT: {
            hide = GenHideLogic(Mode.CREATE_TASK_PARENT);
        }
        case Mode.CREATE_GOAL_PARENT: {
            // Can't repeat within a goal. If you want to, it should be in a habit.
            hide = {
                ["repeats"]: async () => true
            }
        }
        case Mode.EDIT_GOAL_PARENT: {
            hide = GenHideLogic(Mode.CREATE_GOAL_PARENT);
        }
        case Mode.CREATE_CYCLE_PARENT: {
            hide = {
                repeats: async () => true
            }
        }
        case Mode.EDIT_CYCLE_PARENT: {
            hide = GenHideLogic(Mode.CREATE_CYCLE_PARENT);
        }
        default: {
            hide = {};
        }
    }

    return {
        ...hide,
        ...alwaysHide,
    }
}