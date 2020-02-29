
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { Props as StringInputProps } from "src/Components/Inputs/StringInput";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "../Basic/Basic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators";
import MyDate from "src/common/Date";
import { EventDispatcher, IEventDispatcher, fromEvent } from "src/common/EventDispatcher";
import { Props as DateProps } from "src/Components/inputs/DateTimeInput";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    style: StyleProp<ViewStyle>;
    dateRange?: [Date, Date]
}

interface State {
    name: string
    description: string
    start_date: Date
    due_date: Date
}

function Default(): State {
    return {
        name: "",
        description: "",
        start_date: new Date(),
        due_date: new Date(),
    };
}

const DUE_DATE_CHANGE = 'due_date_change';

export function ValidateTaskForm(form: AddTaskForm) {
    const state = form.data();
    const nameMessage = form.validateName(state.name);
    if(nameMessage !== undefined) {
        return nameMessage;
    }

    const startDateMessage = form.validateStartDate(state.start_date);
    if(startDateMessage !== undefined) {
        return startDateMessage;
    }

    return undefined;
}

export default class AddTaskForm extends DataComponent<Props, State, State> {
    SummaryInput = Validate<string, StringInputProps>(
                        StringInput,
                        (s: string) => this.validateName(s),
                        (s: string) => this.validateName(s)
                   )
    StartDateInput = Validate<Date, DateProps>(
                        DateTimeInput,
                        (d: Date) => this.validateStartDate(d) ,
                        (d: Date) => this.validateStartDate(d) ,
                    );
    DueDateInput = Validate<Date, DateProps>(
                        DateTimeInput, 
                        (d: Date) => this.validateDueDate(d) ,
                        (d: Date) => this.validateDueDate(d) ,
                    )
    dispatcher: IEventDispatcher;
    startDateRefresh : Observable<boolean>;
    constructor(props: Props) {
        super(props);

        this.state = Default();
        this.dispatcher = new EventDispatcher();
        this.startDateRefresh = fromEvent(this.dispatcher, DUE_DATE_CHANGE).pipe(mapTo(true));
    }

    /***********************
     * Validation
     */

    validateName = (summary : string) => {
        return summary.length > 0 ? undefined : "Please provide a name";
    }

    validateStartDate = (start: Date) => {
        if(start > this.data().due_date) {
            return "Start date cannot be after due date";
        }

        if(this.props.dateRange ) {
            const startMin = this.props.dateRange[0];
            if(start < startMin) {
                return "Start date cannot be before " + startMin.toString();
            }
        }

        return undefined;
    }

    validateDueDate = (due: Date) => {
        if(this.props.dateRange) {
            const dueMax = this.props.dateRange[1];
            if(due > dueMax) {
                return "Due date cannot be after " + dueMax.toString();
            }
        }

        return undefined;
    }
    

    /**********************
     *  Event handling
     */

    onChangeName = (name: string) => {
        this.setData({
            name: name
        });
    }

    onChangeDescription = (desc: string) => {
        this.setData({
            description: desc
        });
    }

    onChangeStart = (date: Date) => {
        this.setData({
            start_date: date
        });
    }

    onChangeDue = (date: Date) => {
        this.setData({
            due_date: date
        });

        this.dispatcher.fireEvent(DUE_DATE_CHANGE);
    }

    render = () => {
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            },this.props.style]}>

                <this.SummaryInput
                    title={"Name"} 
                    data={this.data().name}
                    placeholder={"Name of this task"}
                    onValidDataChange={this.onChangeName}
                    onInvalidDataChange={this.onChangeName}
                    accessibilityLabel={"task-name"}
                ></this.SummaryInput>

                <StringInput
                    title={"Description"}
                    data={this.data().description}
                    placeholder={"Description of this task"}
                    onDataChange={this.onChangeDescription}
                    accessibilityLabel={"task-description"}
                />

                <this.StartDateInput
                    title={"Starts on"}
                    type={"date"}
                    data={this.data().start_date}
                    onValidDataChange={this.onChangeStart}
                    onInvalidDataChange={this.onChangeStart}
                    accessibilityLabel={"task-start-date"}
                    revalidate={this.startDateRefresh}
                ></this.StartDateInput>

                <DateTimeInput
                    title={"Due on"}
                    type={"date"} 
                    data={this.data().due_date}
                    onDataChange={ this.onChangeDue }
                    accessibilityLabel={"task-due-date"}
                />

            </ColumnView>
        );
    }
}

export {
    AddTaskForm,
    State as AddTaskData,
    Default as AddTaskDefault,
}