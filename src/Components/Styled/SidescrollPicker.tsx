import React from "react";
import { FlatList, View, Button } from "react-native";
import { TAB_GREY, PLACEHOLDER_GREY, BACKGROUND_GREY, BORDER_GREY, LEFT_FIRST_MARGIN, RIGHT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, TEXT_HORIZONTAL_MARGIN, MODAL_ROW_HEIGHT, TEXT_GREY, RIGHT_SECOND_MARGIN, TEXT_VERTICAL_MARGIN } from "./Styles";
import { BodyText, TouchableView, RowView, HeaderText } from "../Basic/Basic";
import { Icon } from "./Icon";
import { ModalIconButton, DateInput } from "./Styled";
import { DropdownInput } from "./DropdownInput";
import ModalRow from "./ModalRow";
import InlineDateInput from "./InlineDateInput";
import MyDate from "src/common/Date";


export interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

export interface Props<Filters, Sorters> {
    filters: LabelValue<Filters>[]
    initialFilter: Filters;
    sorters: LabelValue<Sorters>[]
    initialSorter: Sorters;
    initialDirection: "up" | "down";
    onSubmit: (r: Results<Filters, Sorters>) => void;
    accessibilityLabel: string;
}

type Results<Filters, Sorters> = {
    filter: Filters,
    sorter: Sorters,
    range?: [Date, Date]
    direction: "up" | "down";
}

export interface State<Filters, Sorters> {
    showSorting: boolean;
    proposedRange: "all" | "range";
    start: Date;
    end: Date;
    filter: Filters;
    sorter: Sorters;
    direction: "up" | "down";
}

const marginHorizontal = 13;
const spacer = 10;

export class SidescrollPicker<Filters, Sorters> extends React.Component<Props<Filters, Sorters>, State<Filters, Sorters>> {
    initial: State<Filters, Sorters>
    constructor(props: Props<Filters, Sorters>) {
        super(props);
        let state = {
            showSorting: false,
            proposedRange: "all",
            start: MyDate.Now().toDate(),
            end: MyDate.Now().toDate(),
            filter: this.props.initialFilter,
            sorter: this.props.initialSorter,
            direction: this.props.initialDirection,
        } as const;
        this.state = Object.assign({}, state);

        this.initial = Object.assign({}, state)
    }

    componentDidMount = () => {
        this.setState({
            start: MyDate.Now().toDate(),
            end: MyDate.Now().toDate(),
            filter: this.props.initialFilter,
            sorter: this.props.initialSorter,
            direction: this.props.initialDirection,
        })
    }


    render = () => {
        return (
            <View
                style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    elevation: 7,
                }}
            >
                <View
                    style={{
                        paddingVertical: 10,
                        //marginLeft: RIGHT_FIRST_MARGIN + ICON_CONTAINER_WIDTH,
                    }}
                >
                    <FlatList
                        horizontal={true}
                        data={this.props.filters}
                        renderItem={({item, index, separators}) => {
                            return this.renderLabel(item);
                        }}
                        style={{
                            flex: 0,
                        }}
                        showsHorizontalScrollIndicator={false}
                        ListHeaderComponent={
                            <ModalIconButton
                                data={{
                                    showModal: this.state.showSorting,
                                }}
                                onDataChange={({ showModal }) => {
                                    this.setState({
                                        showSorting: showModal,
                                    })
                                }}
                                type={"sort"}
                                backgroundColor={"white"}
                                color={TAB_GREY}
                                style={{
                                    marginLeft: LEFT_FIRST_MARGIN,
                                    marginRight: TEXT_HORIZONTAL_MARGIN,
                                    borderColor: BORDER_GREY,
                                    backgroundColor: "white",
                                }}
                            >
                                <RowView
                                    style={{
                                        flex: 0,
                                        height: MODAL_ROW_HEIGHT,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: LEFT_FIRST_MARGIN,
                                        marginRight: RIGHT_FIRST_MARGIN,
                                    }}
                                >
                                    <HeaderText
                                        level={2}
                                        style={{}}
                                    >
                                        Sort Criteria
                                    </HeaderText>
                                    <RowView
                                        style={{
                                            flex: 0,                                            
                                        }}
                                    >
                                        {this.renderArrows()}
                                    </RowView>
                                </RowView>
                                <RowView
                                    style={{
                                        flex: 0,
                                        height: MODAL_ROW_HEIGHT,
                                        width: "100%",
                                        justifyContent: "flex-start",
                                        alignItems: "stretch",
                                        marginLeft: LEFT_FIRST_MARGIN,
                                        marginRight: RIGHT_FIRST_MARGIN,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            width: "100%",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        { this.renderSorters() }
                                    </View>
                                </RowView>
                                <RowView
                                    style={{
                                        flex: 0,
                                        height: MODAL_ROW_HEIGHT,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: LEFT_FIRST_MARGIN,
                                        marginRight: RIGHT_FIRST_MARGIN,
                                    }}
                                >
                                    <HeaderText
                                        level={2}
                                        style={{}}
                                    >
                                        Date Range
                                    </HeaderText>
                                    <RowView
                                        style={{
                                            flex: 0,                                            
                                        }}
                                    >
                                        {this.renderOpts()}
                                    </RowView>
                                </RowView>
                                {this.renderRange()}
                                <RowView
                                    style={{
                                        justifyContent: "flex-end",
                                        marginRight: RIGHT_SECOND_MARGIN / 2,
                                    }}
                                >
                                    <TouchableView
                                        style={{
                                            flex: 0,
                                            marginLeft: spacer,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                showSorting: false,
                                                ...this.initial,
                                            })
                                        }}
                                    >
                                        <HeaderText style={{
                                            fontSize: 14,
                                            marginVertical: TEXT_VERTICAL_MARGIN,
                                            marginHorizontal: TEXT_HORIZONTAL_MARGIN,
                                        }} level={3}>CANCEL</HeaderText>
                                    </TouchableView>
                                    <TouchableView
                                        style={{
                                            flex: 0,
                                            marginLeft: spacer,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() => {
                                            console.log("start: " + new MyDate(this.state.start).format("MM/DD/YY"))
                                            console.log("end: " + new MyDate(this.state.end).format("MM/DD/YY"))
                                            let start = new MyDate(this.state.start).asStartDate().toDate();
                                            let end = new MyDate(this.state.end).asDueDate().toDate();
                                            this.props.onSubmit({
                                                range: this.state.proposedRange === "range" ? [start, end] : undefined,
                                                filter: this.state.filter,
                                                sorter: this.state.sorter,
                                                direction: this.state.direction,
                                            })                                            
                                            this.setState({
                                                showSorting: false,
                                            })
                                        }}
                                    >
                                        <HeaderText style={{
                                            fontSize: 14,
                                            marginVertical: TEXT_VERTICAL_MARGIN,
                                            marginHorizontal: TEXT_HORIZONTAL_MARGIN,
                                        }} level={3}>OK</HeaderText>
                                    </TouchableView>
                                </RowView>
                            </ModalIconButton>
                        }
                    ></FlatList>
                </View>
            </View>
        )
    }

    private renderArrows = (): JSX.Element[] => {
        return ["ascending" as const, "descending" as const].map((type) => {
            return (
                <TouchableView
                    style={{
                    }}
                    onPress={() => {
                        this.setState({
                            direction: type === "ascending" ? "up" : "down",
                        })
                    }}
                    accessibilityLabel={
                        `dir-${type === "ascending" ? "up" : "down"}-` + this.props.accessibilityLabel
                    }
                >
                    <Icon
                        type={type}
                        {...colorStyles(this.state.direction, type === "ascending" ? "up" : "down")}
                    >
                    </Icon>
                </TouchableView>
            )
        })

        function colorStyles(current: "up" | "down", actual: "up" | "down") {
            const styles = {
                //marginBottom: spacer,
                //marginRight: spacer,
                marginLeft: spacer,
            }
            if(current === actual) {
                return {
                    backgroundColor: TAB_GREY,
                    color: "white",
                    style: {
                        borderColor: TAB_GREY,
                        borderWidth: 1,
                        ...styles
                    }
                }
            } else {
                return {
                    backgroundColor: BACKGROUND_GREY,
                    color: "black",
                    style: {
                        borderColor: BORDER_GREY,
                        borderWidth: 1,
                        ...styles
                    }
                }
            }
        }
    }

    private renderLabel = (item: LabelValue<Filters>) => {
        return (
            <TouchableView
                style={{
                    flex: 0,
                }}
                onPress={() => {
                    this.setState({
                        filter: item.value,
                    })
                }}
                accessibilityLabel={"filter-" + item.value + "-" + this.props.accessibilityLabel}
            >
                <View
                    style={{
                        flex: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 7,
                        marginRight: spacer,
                        ...colorStyles(this.state.filter, item.value),
                    }}
                >
                    <BodyText
                        style={{
                            marginHorizontal: marginHorizontal,
                            fontSize: 14,
                            ...textStyles(this.state.filter, item.value),
                        }}
                    >
                        {item.label}
                    </BodyText> 
                </View>
            </TouchableView>
        )

        function colorStyles(current: Filters, actual: Filters) {
            if(current === actual) {
                return {
                    backgroundColor: TAB_GREY,
                    borderColor: TAB_GREY,
                    borderWidth: 1,
                    borderRadius: 20,
                } as const
            } else {
                return {
                    backgroundColor: BACKGROUND_GREY,
                    borderColor: BORDER_GREY,
                    borderWidth: 1,
                    borderRadius: 20,
                } as const;
            }

        }

        function textStyles(current: Filters, actual: Filters) {
            if(current === actual) {
                return {
                    color: "white",
                } as const;
            } else {
                return {
                    color: "black",
                } as const;
            }
        }
    }

    private renderOpts = () => {
        let opts: LabelValue<"all" | "range">[] = [
            { label: "All", value: "all", key: "all"} as const,
            { label: "Range", value: "range", key: "range"} as const
        ]

        return opts.map((item: LabelValue<"all" | "range">) => {
            return (
                <TouchableView
                    style={{
                        flex: 0,
                    }}
                    onPress = { () => {
                        this.setState({
                            proposedRange: item.value,
                        })
                    }}
                    accessibilityLabel={"date-" + item.value + "-" + this.props.accessibilityLabel}
                >
                    <View
                        style={{
                            flex: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 7,
                            //marginRight: spacer,
                            marginLeft: spacer,
                            ...this.colorStyles(this.state.proposedRange, item.value),
                        }}
                    >
                        <BodyText
                            style={{
                                marginHorizontal: marginHorizontal,
                                fontSize: 14,
                                ...this.textStyles(this.state.proposedRange, item.value),
                            }}
                        >
                            {item.label}
                        </BodyText> 
                    </View>
                </TouchableView>
            )
        })
    }

    private renderSorters = () => {
        let choices = this.props.sorters;
        return choices.map((item: LabelValue<Sorters>) => {
            return (

                <TouchableView
                    style={{
                        flex: 0,
                    }}
                    onPress={() => {
                        this.setState({
                            sorter: item.value
                        })
                    }}
                    accessibilityLabel={"sort-" + item.value + "-" + this.props.accessibilityLabel}
                >
                    <View
                        style={{
                            flex: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 7,
                            marginRight: spacer,
                            ...this.colorStyles(this.state.sorter, item.value),
                        }}
                    >
                        <BodyText
                            style={{
                                marginHorizontal: marginHorizontal,
                                fontSize: 14,
                                ...this.textStyles(this.state.sorter, item.value),
                            }}
                        >
                            {item.label}
                        </BodyText> 
                    </View>
                </TouchableView>
            )
        })
    }
    private colorStyles = <T extends unknown>(current: T, actual: T) => {
        if(current === actual) {
            return {
                backgroundColor: TAB_GREY,
                borderColor: TAB_GREY,
                borderWidth: 1,
                borderRadius: 20,
            } as const
        } else {
            return {
                backgroundColor: BACKGROUND_GREY,
                borderColor: BORDER_GREY,
                borderWidth: 1,
                borderRadius: 20,
            } as const;
        }

    }

    private textStyles = <T extends unknown>(current: T, actual: T) => {
        if(current === actual) {
            return {
                color: "white",
            } as const;
        } else {
            return {
                color: "black",
            } as const;
        }
    }

    private renderRange = () => {
        if(this.state.proposedRange === "all") {
            return (
                <RowView
                    style={{
                        flex: 0,
                        width: "100%",
                        height: MODAL_ROW_HEIGHT,
                    }}

                ></RowView>
            )
        } else {
            return (
                <RowView
                    style={{
                        height: MODAL_ROW_HEIGHT,
                        flex: 0,
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        marginLeft: LEFT_FIRST_MARGIN,
                        marginRight: RIGHT_FIRST_MARGIN,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                            <BodyText
                                style={{
                                    marginRight: 5,
                                }}
                            >
                                From
                            </BodyText>
                            <InlineDateInput
                                value={this.state.start}
                                onChangeDate={(date) => {
                                    this.setState({
                                        start: date,
                                    })
                                }}
                                format={"01/31/20"}
                                readonly={false}
                            ></InlineDateInput>

                            <BodyText
                                style={{
                                    marginRight: 5,
                                }}
                            >
                                to
                            </BodyText>
                            <InlineDateInput
                                value={this.state.end}
                                onChangeDate={(date) => {
                                    this.setState({
                                        end: date
                                    })
                                }}
                                format={"01/31/20"}
                                readonly={false}
                            ></InlineDateInput>
                    </View>
                </RowView>
            )
        }
    }

}


export default SidescrollPicker;