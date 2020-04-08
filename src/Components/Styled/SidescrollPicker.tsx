import React from "react";
import { FlatList, View, Button } from "react-native";
import { TAB_GREY, PLACEHOLDER_GREY, BACKGROUND_GREY, BORDER_GREY, LEFT_FIRST_MARGIN, RIGHT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, TEXT_HORIZONTAL_MARGIN, MODAL_ROW_HEIGHT, TEXT_GREY, RIGHT_SECOND_MARGIN, TEXT_VERTICAL_MARGIN, LEFT_SECOND_MARGIN } from "./Styles";
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
    label?: string;
    filters: LabelValue<Filters>[]
    filter: Filters;
    onChangeFilter: (f: Filters) => void;
    sorters: LabelValue<Sorters>[]
    initialSorter: Sorters;
    initialRange?: [Date, Date]
    initialDirection: "up" | "down";
    onSubmit: (r: Results<Filters, Sorters>) => void;
    accessibilityLabel: string;
}

type Results<Filters, Sorters> = {
    sorter: Sorters,
    range?: [Date, Date]
    direction: "up" | "down";
}

export interface State<Filters, Sorters> {
    showSorting: boolean;
    range?: [Date, Date]
    sorter: Sorters;
    direction: "up" | "down";
    label?: string;
}

const marginHorizontal = 13;
const spacer = 10;

export class SidescrollPicker<Filters, Sorters> extends React.Component<Props<Filters, Sorters>, State<Filters, Sorters>> {
    constructor(props: Props<Filters, Sorters>) {
        super(props);
        let state = {
            showSorting: false,
            proposedRange: "all",
            range: this.props.initialRange,
            sorter: this.props.initialSorter,
            direction: this.props.initialDirection,
        } as const;
        this.state = Object.assign({}, state);

    }

    private resetState = () => {
        this.setState({
            range: this.props.initialRange,
            sorter: this.props.initialSorter,
            direction: this.props.initialDirection,
        })
    }

    componentDidMount = () => {
        this.resetState();
    }


    render = () => {
        return (
            <View
                style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    backgroundColor: this.backgroundColor(),
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
                            this.renderHeader()
                        }
                    ></FlatList>
                </View>
            </View>
        )
    }

    private renderHeader = () => {
        let label: JSX.Element | null = null;
        if(this.props.label) {
            label = (
                <HeaderText level={2} style={{
                    color: TEXT_GREY,
                }}>
                    {this.props.label}
                </HeaderText>
            )
        }

        return (
            <RowView
                style={{
                    flex: 0,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginRight: TEXT_HORIZONTAL_MARGIN,
                    backgroundColor: this.backgroundColor(),
                    paddingLeft: LEFT_SECOND_MARGIN,
                }}
            >
                {label}
                {this.renderFilter()}
            </RowView>
        )
    }

    private backgroundColor = () => {
        if(this.props.label) {
            return "transparent";
        } else {
            return "white";
        }
    }

    private renderFilter = () => {
        return (
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
                backgroundColor={this.backgroundColor()}
                color={TAB_GREY}
                style={{
                    marginLeft: LEFT_FIRST_MARGIN,
                    marginRight: TEXT_HORIZONTAL_MARGIN,
                    borderColor: BORDER_GREY,
                    backgroundColor: this.backgroundColor(),
                }}
                onModalClose={() => {
                    this.resetState();
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
                            })
                            this.resetState();
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
                            this.props.onSubmit({
                                range: this.state.range,
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
                    this.props.onChangeFilter(item.value)
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
                        ...colorStyles(this.props.filter, item.value),
                    }}
                >
                    <BodyText
                        style={{
                            marginHorizontal: marginHorizontal,
                            fontSize: 14,
                            ...textStyles(this.props.filter, item.value),
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
                        if(item.value === "all") {
                            this.setState({
                                range: undefined
                            })
                        } else {
                            if(this.props.initialRange === undefined) {
                                this.setState({
                                    range: [MyDate.Now().toDate(), MyDate.Now().toDate()]
                                })
                            } else {
                                this.setState({
                                    range: this.props.initialRange
                                })
                            }
                        }
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
                            ...this.colorStyles(this.state.range ? "range" : "all", item.value),
                        }}
                    >
                        <BodyText
                            style={{
                                marginHorizontal: marginHorizontal,
                                fontSize: 14,
                                ...this.textStyles(this.state.range ? "range" : "all", item.value),
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
        if(this.state.range === undefined) {
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
                                value={this.state.range[0]}
                                onChangeDate={(date) => {
                                    this.setState((prevState) => {
                                        return {
                                            range: [date, prevState.range? prevState.range[1] : MyDate.Now().toDate()]
                                        }
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
                                value={this.state.range[1]}
                                onChangeDate={(date) => {
                                    this.setState((prevState) => {
                                        return {
                                            range: [prevState.range? prevState.range[0] : MyDate.Now().toDate(), date]
                                        }
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