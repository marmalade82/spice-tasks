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

import Form from "@marmalade82/ts-react-forms";  
import GlobalQuery from "src/Models/Global/GlobalQuery";
import {
    StringInput,
    DateTimeInput,
    ChoiceInput,

} from "src/Components/Inputs";
import { string } from "prop-types";
import MyDate from "src/common/Date";

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
        let message: string | undefined = undefined;

        if(message !== undefined) {
            this.setState({
                showToast: true,
                toast: message,
            });
        } else {
            const data = this.state;
            const formData = {
                name: data.name,
                description: data.description,
                starts: data.starts,
                time: data.time,
                remindMe: data.remindMe === "yes" ? true : false,
                repeats:    data.repeats === "daily" ? "daily" : 
                            data.repeats === "weekly" ? "weekly" : 
                            data.repeats === "monthly" ? "monthly" : 
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
            <React.Fragment>
                <StringInput
                    title={"Name"}
                    data={this.state.name}
                    placeholder={"Name of this task"}
                    onDataChange={(val) => {
                        this.setState({
                            name: val
                        })
                    }}
                    accessibilityLabel={"task-name"}
                ></StringInput>
                <StringInput
                    title={"Description"}
                    data={this.state.description}
                    placeholder={"Description of this task"}
                    onDataChange={(val) => {
                        this.setState({
                            description: val
                        })
                    }}
                    accessibilityLabel={"task-description"}
                />

                <DateTimeInput
                    title={"Start Date"}
                    type={"date"}
                    data={this.state.starts}
                    onDataChange={(val) => {
                        this.setState({
                            starts: val
                        });
                    }}
                    accessibilityLabel={"task-start-date"}
                ></DateTimeInput>

                <DateTimeInput
                    title={"Time"}
                    type={"time"}
                    data={this.state.time}
                    onDataChange={(val) => {
                        this.setState({
                            time: val
                        })
                    }}
                    accessibilityLabel={"task-start-time"}
                ></DateTimeInput>

                <ChoiceInput
                    title={"Repeat"}
                    data={this.state.repeats}
                    choices={[
                        {label: "Daily", value: "daily", key: "daily"},
                        {label: "Weekly", value: "weekly", key: "weekly"},
                        {label: "Monthly", value: "monthly", key: "monthly"},
                        {label: "Don't Repeat", value: "stop", key: "stop"},
                    ]}
                    onDataChange={(val) => {
                        this.setState({
                            repeats: val
                        })
                    }}
                    accessibilityLabel={"task-reminder"}
                ></ChoiceInput>

                <ChoiceInput
                    title={"Remind me?"}
                    data={this.state.remindMe}
                    choices={[
                        {label: "No", value: "no", key: "no"},
                        {label: "Yes", value: "yes", key: "yes"},
                    ]}
                    onDataChange={(val) => {
                        this.setState({
                            remindMe: val
                        })
                    }}
                    accessibilityLabel={"task-reminder"}
                ></ChoiceInput>
            </React.Fragment>
        );
    }
}

