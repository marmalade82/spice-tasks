import React, { MutableRefObject } from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { 
    Mode,
    FullTaskForm,
    FullData,
 } from "src/Components/Forms/AddTaskForm";
import { TaskQuery, Task, TaskLogic } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader, Toast, IconButton } from "src/Components/Styled/Styled";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { TaskParentTypes } from "src/Models/Task/Task";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

import { FormHandle } from "@marmalade82/ts-react-forms";  
import MyDate from "src/common/Date";
import GlobalQuery from "src/Models/Global/GlobalQuery";

interface Props {
    navigation: object;
}

interface State { 
    task?: Task;
    showToast: boolean;
    toast: string;
    dateRange?: [Date, Date];
    mode: Mode,
}

const dispatcher = new EventDispatcher();

export default class AddTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
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

    handle: React.RefObject<FormHandle<FullData>> = React.createRef();
    navigation: MainNavigator<"AddTask">
    markFormRendered = () => {};
    renderForm: () => JSX.Element | null;
    constructor(props: Props) {
        super(props);
        this.state = {
            showToast: false,
            toast: "",
            mode: Mode.UNDETERMINED,
        }
        this.navigation = new ScreenNavigation(props);
        this.renderForm = () => null;
    }

    componentDidMount = async () => {
        // Once the mode is determined and the form is rendered BASED ON A KNOWN mode, we run code to load the data
        const formRendered = new Promise((resolve, reject) => {
            this.markFormRendered = resolve;
        }) 

        const mode = await this.determineMode();
        console.log("MODE IS " + mode.toString())
        this.renderForm = this.renderFormByMode(mode);

        this.setState({
            mode: mode
        })

        // Once the form is rendered, we can load data into it
        await formRendered;
        const t = await new TaskQuery().get(this.navigation.getParam("id", ""));

        if(t) {
            const data: FullData = {
                name: t.title,
                description: t.instructions,
                ["start-date"]: t.startDate,
                ["start-time"]: t.startTime,
                reminder: t.remindMe ? "yes" : "no",
                repeats: t.repeat,
                id: t.id,
                parent_id: t.parent.id,
            }

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 5000)
            })
            if(this.handle.current) {

                this.handle.current.setForm(data);
            } else {
                throw new Error("Form ref not initialized");
            }
        } else {
            // If we're creating a form, the default new data may depend on what mode we're in -- the context of 
            // what we're trying to accomplish.
            const data: FullData = await this.getTaskDefaults(mode);
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 5000)
            })

            if(this.handle.current) {
                this.handle.current.setForm(data);
            } else {
                throw new Error("Form ref not initialized");
            }
        }

        dispatcher.addEventListener(getKey(this.navigation), this.onSave);
    }

    private getTaskDefaults = async (mode: Mode): Promise<FullData> => {
        const global = await new GlobalQuery().current();
        let data: FullData = {
            repeats: "stop",
            reminder: global.remindMe ? "yes" : "no",
            name: "",
            description: "",
            ["start-date"]: MyDate.Now().toDate(),
            ["start-time"]: MyDate.Zero().toDate(),
            id: this.navigation.getParam("id", ""),
            parent_id: this.navigation.getParam("parent_id", ""),
        }

        return data;
    }

    private renderFormByMode = (mode: Mode): () => (JSX.Element | null) => {
        const { Form, Logic } = FullTaskForm;
        const validate = Logic.validate(mode);
        const readonly = Logic.readonly(mode);
        const hide = Logic.hide(mode);
        const props = Logic.props(mode);
        const choices = Logic.choices(mode);

        return () => {
            return (
                <Form
                    ref={this.handle}
                    validation={validate}
                    readonly={readonly}
                    hide={hide}
                    props={props}
                    choices={choices}
                ></Form>
            )
        }
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onSave);
    }

    private determineMode = async () => {
        const task = await new TaskQuery().get(this.navigation.getParam("id", ""));

        if(task){
            // We're editing an existing task
            return await this.determineEditMode();

        } else {
            // We're creating a task
            return this.determineCreateMode();
        }
    }

    private determineCreateMode = () => {
        const parentType = this.navigation.getParam("parent_type", TaskParentTypes.NONE);
        switch(parentType) {
            case TaskParentTypes.CYCLE: {
                return Mode.CREATE_CYCLE_PARENT;
            }
            case TaskParentTypes.GOAL: {
                return Mode.CREATE_GOAL_PARENT;
            }
            case TaskParentTypes.TASK: {
                return Mode.CREATE_TASK_PARENT;
            }
            case TaskParentTypes.NONE: {
                return Mode.CREATE_NO_PARENT;
            }
            default: {
                console.log("undetermined")
                return Mode.UNDETERMINED;
            }
        }
    }

    private determineEditMode = async () => {
        const task = await new TaskQuery().get(this.navigation.getParam("id", ""));
        if(task) {
            const parentType = task.parent.type;
            switch(parentType) {
                case TaskParentTypes.CYCLE: {
                    return Mode.EDIT_CYCLE_PARENT;
                }
                case TaskParentTypes.GOAL: {
                    return Mode.EDIT_GOAL_PARENT;
                }
                case TaskParentTypes.TASK: {
                    return Mode.EDIT_TASK_PARENT;
                }
                case TaskParentTypes.NONE: {
                    return Mode.EDIT_NO_PARENT;
                }
                default: {
                    return Mode.UNDETERMINED;
                }
            }
        }
        return Mode.UNDETERMINED;
    }

    private onSave = () => {
        if(!this.handle.current) {
            throw new Error("Form ref not initialized");
        }

        let messages = this.handle.current.getErrors();
        if(messages.length > 0) {
            this.setState({
                showToast: true,
                toast: messages[0],
            });
        }

        if(this.state.mode === Mode.UNDETERMINED) {
            throw new Error("Cannot save in undetermined mode");
        }

        // Load all known data. Let Application logic decide what to do with it.
        const { Validate } = FullTaskForm;
        const data = Validate(this.handle.current.getForm());
        const taskData = {
            title: data.name,
            startDate: data["start-date"],
            startTime: data["start-time"],
            instructions: data.description,
            remindMe: data.reminder === "yes" ? true : false,
            repeats:    data.repeats === "daily" ? "daily" : 
                        data.repeats === "weekly" ? "weekly" : 
                        data.repeats === "monthly" ? "monthly" : 
                        "daily" as "daily" | "weekly" | "monthly",
            parent: {
                id: data.parent_id,
                type: this.navigation.getParam("parent_type", TaskParentTypes.NONE),
            },
            id: data.id,
        }

        TaskLogic.request(this.state.mode, taskData).then(([code, error]) => {
            if(code === "error") {
                this.setState({
                    showToast: true,
                    toast: error,
                });
            }
        })

        this.navigation.goBack();
        return;
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
        // Rendering logic is a simple render. The complication is determining the correct form, which we can only do on mount.

        if(this.state.mode === Mode.UNDETERMINED) {
            return null;
        }

        this.markFormRendered();

        return this.renderForm();
    }
}
