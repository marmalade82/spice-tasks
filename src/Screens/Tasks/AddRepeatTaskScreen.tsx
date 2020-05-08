import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault, 
 } from "src/Components/Forms/AddTaskForm";
import { TaskQuery, Task, TaskLogic, RepeatTaskLogic } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader, Toast, IconButton } from "src/Components/Styled/Styled";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { TaskParentTypes } from "src/Models/Task/Task";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { GoalType } from "src/Models/Goal/GoalLogic";
import * as moment from "moment";

import Form from "@marmalade82/ts-react-forms";  
import GlobalQuery from "src/Models/Global/GlobalQuery";
import {
    StringInput,
    DateTimeInput,
    ChoiceInput,

} from "src/Components/Inputs";
import { string } from "prop-types";
import MyDate from "src/common/Date";
import { AStringInput, AMultiStringInput } from "src/Components/Inputs/StringInput";
import { ADateInput, ATimeInput } from "src/Components/Inputs/DateTimeInput";
import { AChoiceInput } from "src/Components/Inputs/ChoiceInput";
import { ANumberInput } from "src/Components/Inputs/NumberInput";
import * as R from "ramda";
import { threadId } from "worker_threads";
import { Exact } from "src/common/types";

interface Props {
    navigation: object;
}

interface State { 
    task?: Task;
    showToast: boolean;
    toast: string;
    dateRange?: [Date, Date];

    name: string;
    description: string;
    starts: Date;
    time: Date;
    remindMe: string;
    repeats: string;
}

type Data = {
    name: string;
    description: string;
    ["start-date"]: Date;
    ["start-time"]: Date;
    reminder: string;
    repeat: string;
}

const dispatcher = new EventDispatcher();

export default class AddRepeatTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Repeat Task',
            right: [
                () => {
                    return (
                        <HeaderSaveButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderSaveButton>
                    );
                }
            ]
        }
    }

    handle: any = {};
    navigation: MainNavigator<"AddTask">
    constructor(props: Props) {
        super(props);
        this.state = {
            showToast: false,
            toast: "",
            name: "",
            description: "",
            starts: MyDate.Now().toDate(),
            time: MyDate.Zero().toDate(),
            remindMe: "no",
            repeats: "daily",
        }
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 
        let data = AddTaskDefault();
        if(task) {
            data = {
                name: task.title,
                start_date: task.startDate,
                description: task.instructions,
                time: task.startTime,
                remindMe: task.remindMe,
            }
        } 

        if(!task) {
            const global = await new GlobalQuery().current();
            data.remindMe = global.remindMe;
        }

        const parentType = task && task.parent ? task.parent.type : this.navigation.getParam('parent_type', TaskParentTypes.NONE);
        const parentId = task && task.parent ? task.parent.id : this.navigation.getParam('parent_id', '');
        switch(parentType) {
            case TaskParentTypes.TASK: {
                const parent = await new TaskQuery().get(parentId);
                if(parent) {
                    this.setState({
                        dateRange: [ parent.startDate, parent.dueDate ]
                    })

                    if(!task) {
                        data.start_date = parent.startDate;
                    }
                }
            } break;
            case TaskParentTypes.CYCLE: {
                const parent = await new StreakCycleQuery().get(parentId);
                if(parent) {
                    this.setState({
                        dateRange: [ parent.startDate, parent.endDate ]
                    })

                    if(!task) {
                        data.start_date = parent.startDate;
                    }
                }
            } break;
            case TaskParentTypes.GOAL: {
                const parent = await new GoalQuery().get(parentId);
                if(parent) {
                    let parentStart:Date = new Date();
                    if(parent.goalType === GoalType.NORMAL) {
                        this.setState({
                            dateRange: [ parent.startDate, parent.dueDate]
                        })
                        parentStart = parent.startDate;
                    } else {
                        this.setState({
                            dateRange: [ parent.currentCycleStart(), parent.currentCycleEnd() ]
                        });
                        parentStart = parent.currentCycleStart();
                    }

                    if(!task) {
                        // Default should start the new task where its parent is, whether that's a cycle or not.

                        data.start_date = parentStart
                    }
                }
            } break;
            case TaskParentTypes.NONE: {
                // Do nothing
            } break;
            default: {
                // Do nothing
            }
        }

        this.setState({
            task: task ? task : undefined,
        })


        dispatcher.addEventListener(getKey(this.navigation), this.onSave);

    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onSave);
    }

    onSave = () => {
        let messages: string[] = this.handle.getErrors();

        if(messages.length > 0) {
            this.setState({
                showToast: true,
                toast: messages[0],
            });
        } else {
            const data = this.handle.getForm();
            const validated = flatSchema<Data>(data, {
                name: [""],
                description: [""],
                ["start-date"]: [new Date()],
                ["start-time"]: [new Date()],
                reminder: [ "" ],
                repeat: [""]
            })

            const formData = {
                name: validated.name,
                description: validated.description,
                starts: validated["start-date"],
                time: validated["start-time"],
                remindMe: validated.reminder === "yes" ? true : false,
                repeats:    validated.repeat === "daily" ? "daily" : 
                            validated.repeat === "weekly" ? "weekly" : 
                            validated.repeat === "monthly" ? "monthly" : 
                            "daily" as "daily" | "weekly" | "monthly"
            };

            void RepeatTaskLogic.create(formData);

            this.navigation.goBack();
        }
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"add-task"}>
                <ScrollView style={{
                    backgroundColor: "transparent",
                }}>
                    { this.renderTaskForm() }
                </ScrollView>

                <Toast
                    visible={this.state.showToast}
                    message={this.state.toast}
                    onToastDisplay={() => {
                        this.setState({
                            showToast: false
                        });
                    }}
                ></Toast>
            </DocumentView>
        );
    }

    private renderTaskForm = () => {
        return (
            <MyForm
                validation={{
                    name: async (data: any) => {
                        console.log("RUNNING")
                        return thread(
                            data,
                            required("name", "Name")
                        )
                    },
                    ["start-date"]: async (data: any) => {
                        return thread(
                            data,
                            required("start-date", "Start Date")
                        )
                    },
                    ["start-time"]: async (data: any) => {
                        return thread(
                            data,
                            required("start-time", "Time"),
                        )
                    }
                }}
                readonly={{}}
                choices={{
                    repeat: [
                        {label: "Daily", value: "daily", key: "daily"},
                        {label: "Weekly", value: "weekly", key: "weekly"},
                        {label: "Monthly", value: "monthly", key: "monthly"},
                        {label: "Don't Repeat", value: "stop", key: "stop"}, ],
                    reminder: [
                        {label: "No", value: "no", key: "no"},
                        {label: "Yes", value: "yes", key: "yes"}, ],
                }}
                props={{
                    name: { placeholder: "Name of this task"},
                    description: { placeholder: "Description of this task"},
                }}
                handle={this.handle}
            ></MyForm>
        )
    }
}

const makeForm = Form.install({
    text: AStringInput,   
    multi_text: AMultiStringInput,
    date: ADateInput,
    time: ATimeInput,
    choice: AChoiceInput,
    number: ANumberInput
})

const MyForm = makeForm([
    { label: "Name", name: "name", type: "text"},
    { label: "Description", name: "description", type: "multi_text"},
    { label: "Start Date", name: "start-date", type: "date"},
    { label: "Time", name: "start-time", type: "time"},
    { label: "Repeat", name: "repeat", type: "choice", default: "daily"},
    { label: "Remind me?", name: "reminder", type: "choice", default: "no"}
], { name: "task", startActive: true })


const thread = (data: any, ...errorArgs: ((data: Either) => Either)[] ) => {

    const pipeline: (val: Either) => Either = (R.pipe as any)(...(errorArgs))

    return pipeline(["ok", data]);
}


type Either = ["ok", any] | ["error", string]

function required(field: string, label: string): (val: Either) => Either {
    return ([code, data]: ["ok", any] | ["error", string]) => {
        console.log(`required ${`${label}, ${field}`} with data ${JSON.stringify(data)}`)
        if(code === "error") {
            return [code, data] as ["ok", any] | ["error", string]
        }

        const val = data[field]
        if(val === undefined) {
            return ["error", `Field ${field} does not exist`];
        }

        if(typeof val === "string") {
            return val.length > 0 ? ["ok", data] : ["error", label + " is required"]
        } else if (val instanceof Date) {
            let result: Either = !isNaN(val.valueOf()) ? ["ok", data] : ["error", label + " is required"]
            return result;
        }

        return ["ok", data]
    }
}

/**
 * This function validates that a piece of data satisfies the constraints specified by the example object,
 * and then returns the object as the Target type if it does. Otherwise it throws an error.
 * 
 * Success examples:
 * 
 * flatSchema({ }, { 
 *      apple: ["I", undefined]; 
 * })
 * 
 * 
 * Failure examples:
 * 
 * flatSchema({ apple: 3 }, { 
 *      apple: ["I", undefined]; 
 * })
 */

 type SchemaExample <Source> = {
     [P in keyof Source]: (Source[P])[]
 }
function flatSchema<Target>(data: any, example: SchemaExample<Target> ): Target   {
    let valid = true;
    const errors = [] as string[];
    Object.keys(example).forEach((key) => {
        const found = (example[key] as any[]).findIndex((val) => {
            if(typeof val === typeof data[key]) {
                return true;
            }

            return false;
        })

        if(found < 0) {
            const fieldTypes: string = (example[key] as any[]).map((val) => {
                return typeof val;
            }).join(" | ");
            errors.push(`Field '${key}' is not ${fieldTypes}`)
        }
    })

    if(valid) {
        return data as Target;
    }

    const errorMessages = errors.join("\n");
    throw new Error("Invalid schema for data " + JSON.stringify(data) + ":\n" + errorMessages);

}