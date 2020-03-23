
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { Props as StringInputProps } from "src/Components/Inputs/StringInput";
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "../Basic/Basic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators";
import MyDate from "src/common/Date";
import { EventDispatcher, IEventDispatcher, fromEvent } from "src/common/EventDispatcher";
import { Props as DateProps } from "src/Components/inputs/DateTimeInput";
import { ROW_CONTAINER_HEIGHT } from "../Styled/Styles";
import FootSpacer from "../Basic/FootSpacer";
import { dueDate, startDate } from "./common/utils";

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
}

function Default(): State {
    return {
        name: "",
        description: "",
        start_date: startDate(MyDate.Now().toDate()),
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
        if(this.props.dateRange ) {
            const startMin = this.props.dateRange[0];
            if(start < startMin) {
                return "Start date cannot be before " + new MyDate(startMin).format("MM/DD");
            }

            const startMax = this.props.dateRange[1];
            if(start > startMax) {
                return "Start date cannot be after " + new MyDate(startMax).format("MM/DD")
            }
        }

        return undefined;
    }

    /**********************
     *  Event handling
     */
    private onChangeName = (name: string) => {
        this.setData({
            name: name
        });
    }

    private onChangeDescription = (desc: string) => {
        this.setData({
            description: desc
        });
    }

    private onChangeStart = (date: Date) => {
        this.setData({
            start_date: startDate(date),
        });
    }

    render = () => {
        const SummaryInput = this.SummaryInput;
        const StartDateInput = this.StartDateInput;
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            },this.props.style]}>

                <ScrollView>
                    <SummaryInput
                        title={"Name"} 
                        data={this.data().name}
                        placeholder={"Name of this task"}
                        onValidDataChange={this.onChangeName}
                        onInvalidDataChange={this.onChangeName}
                        accessibilityLabel={"task-name"}
                    ></SummaryInput>

                    <StringInput
                        title={"Description"}
                        data={this.data().description}
                        placeholder={"Description of this task"}
                        onDataChange={this.onChangeDescription}
                        accessibilityLabel={"task-description"}
                    />

                    <StartDateInput
                        title={this.title()}
                        type={"date"}
                        data={this.data().start_date}
                        onValidDataChange={this.onChangeStart}
                        onInvalidDataChange={this.onChangeStart}
                        accessibilityLabel={"task-start-date"}
                        revalidate={this.startDateRefresh}
                        readonly={this.inherited()}
                    ></StartDateInput>

                    <FootSpacer></FootSpacer>
                </ScrollView>
            </ColumnView>
        );
    }

    private inherited = () => {
        if(this.props.dateRange) {
            const start = new MyDate(this.props.dateRange[0]);
            const end = new MyDate(this.props.dateRange[1]);
            if(start.sameDayAs(end)) {
                return true;
            }
        }

        return false;
    }

    private title = () => {
        return (
            `Date${this.inherited() ? " (Inherited)" : this.dateRange()}`
        )
    }

    private dateRange = () => {
        if(this.props.dateRange) {
            return ` (${new MyDate(this.props.dateRange[0]).format("MM/DD") + " - " + new MyDate(this.props.dateRange[1]).format("MM/DD")})`
        } else {
            return "";
        }
    }
}

export {
    AddTaskForm,
    State as AddTaskData,
    Default as AddTaskDefault,
}