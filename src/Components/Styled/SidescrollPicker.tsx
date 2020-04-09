import React from "react";
import { FlatList, View, Button, StyleProp, ViewStyle } from "react-native";
import { TAB_GREY, PLACEHOLDER_GREY, BACKGROUND_GREY, BORDER_GREY, LEFT_FIRST_MARGIN, RIGHT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, TEXT_HORIZONTAL_MARGIN, MODAL_ROW_HEIGHT, TEXT_GREY, RIGHT_SECOND_MARGIN, TEXT_VERTICAL_MARGIN, LEFT_SECOND_MARGIN, SECONDARY_COLOR, PRIMARY_COLOR_LIGHT } from "./Styles";
import { BodyText, TouchableView, RowView, HeaderText } from "../Basic/Basic";
import { Icon } from "./Icon";
import { ModalIconButton, DateInput } from "./Styled";
import { DropdownInput } from "./DropdownInput";
import ModalRow from "./ModalRow";
import InlineDateInput from "./InlineDateInput";
import MyDate from "src/common/Date";
import { ILocalState } from "src/Screens/common/StateProvider";
import * as v from "voca";

export function makeChoices<Choice>(filters: Choice[]) {
    return filters.map((filter) => {
        return {
            label: v.chain(filter)
                    .words().thru((str) => {
                        return str.map((s) => v.capitalize(s)).join(" ");
                    }).value(),
            value: filter,
            key: filter,
        }
    })
}

export interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

export type LocalState<Filters, Sorters> = {
    filter: Filters;
    sorter: Sorters;
    range?: [Date, Date]
    direction: "up" | "down"
}


export interface Props<Filters, Sorters> {
    label?: string;
    filters: LabelValue<Filters>[]
    sorters: LabelValue<Sorters>[]
    localState: ILocalState<LocalState<Filters, Sorters>>
    accessibilityLabel: string;
}

export interface State<Filters, Sorters> {
    showSorting: boolean;
    range?: [Date, Date]
    sorter: Sorters;
    direction: "up" | "down";
    filter: Filters
}

const marginHorizontal = 13;
const spacer = 10;

export class SidescrollPicker<Filters, Sorters> extends React.Component<Props<Filters, Sorters>, State<Filters, Sorters>> {
    constructor(props: Props<Filters, Sorters>) {
        super(props);
        let state: State<Filters, Sorters> = {
            showSorting: false,
            range: this.props.localState.get("range"),
            sorter: this.props.localState.get("sorter"),
            direction: this.props.localState.get("direction"),
            filter: this.props.localState.get("filter"),
        } as const;
        this.state = Object.assign({}, state);

    }

    private resetState = () => {
        this.setState({
            range: this.props.localState.get("range"),
            sorter: this.props.localState.get("sorter"),
            direction: this.props.localState.get("direction")
        })
    }


    componentDidMount = () => {
        this.props.localState.subscribe("filter", (filter) => {
            console.log("RECEIVED A FILTER")
            this.setState({
                filter: filter
            });
        })
        this.resetState();
    }


    render = () => {
        if (this.props.label === undefined) {
            return this.renderAsSidescroll();
        } else {
            return this.renderAsLabel();
        }
    }

    private renderAsSidescroll = () => {
        return (
            <View
                style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    backgroundColor: backgroundColor(),
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
                            return this.renderFilter(item);
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

    private renderFilter = (item: LabelValue<Filters>) => {
        return (
            <TouchableView
                style={{
                    flex: 0,
                }}
                onPress={() => {
                    console.log("pushing filter " + item.value)
                    this.props.localState.push("filter", item.value)
                }}
                accessibilityLabel={"filter-" + item.value + "-" + this.props.accessibilityLabel}
            >
                {renderLabelBase(this.state.filter, item, "right")}
            </TouchableView>
        )
    }

    private renderHeader = () => {
        return (
            <RowView
                style={{
                    flex: 0,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginRight: TEXT_HORIZONTAL_MARGIN,
                    backgroundColor: backgroundColor(),
                }}
            >
                <FilterModal
                    filters={[] /* we pass no filters, since they will be rendered in the sidescroll*/} 
                    sorters={this.props.sorters}
                    localState={this.props.localState}
                    accessibilityLabel={this.props.accessibilityLabel}
                    backgroundColor={backgroundColor()}
                >
                </FilterModal>
            </RowView>
        )
    }

    private renderAsLabel = () => {
        let {label, ...rest} = this.props;
        if(label !== undefined) {
            return (
                <RowView style={{
                        flex: 0,
                        height: 50,
                        justifyContent: "flex-start",
                        alignItems: "center",
                        backgroundColor: PRIMARY_COLOR_LIGHT,
                        paddingLeft: LEFT_SECOND_MARGIN,
                    }}
                >
                    <HeaderText style={{
                        color: TEXT_GREY,
                    }} level={2}>{label}</HeaderText>
                    <FilterModal
                        backgroundColor={PRIMARY_COLOR_LIGHT}
                        {...rest}
                        style={{
                            position: "absolute",
                            right: RIGHT_FIRST_MARGIN,
                        }}
                    ></FilterModal>
                </RowView>
            )
        }
        return null;
    }

}
export default SidescrollPicker;

function renderLabelBase<Thing>(current: Thing, item: LabelValue<Thing>, margin: "left" | "right") {
    return (
        <View
            style={{
                flex: 0,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 7,
                marginRight: margin === "right" ? spacer : 0,
                marginLeft: margin === "left" ? spacer : 0,
                ...colorStyles(current, item.value),
            }}
        >
            <BodyText
                style={{
                    marginHorizontal: marginHorizontal,
                    fontSize: 14,
                    ...textStyles(current, item.value),
                }}
            >
                {item.label}
            </BodyText> 
        </View>
    )

    function colorStyles(current: Thing, actual: Thing) {
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

    function textStyles(current: Thing, actual: Thing) {
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

interface ModalProps<Filters, Sorters> {
    filters: LabelValue<Filters>[]
    sorters: LabelValue<Sorters>[]
    localState: ILocalState<LocalState<Filters, Sorters>>
    backgroundColor: string;
    style?: StyleProp<ViewStyle>
    accessibilityLabel: string;
}

interface ModalState<Filters, Sorters> {
    showSorting: boolean;
    range?: [Date, Date]
    sorter: Sorters;
    direction: "up" | "down";
    filter: Filters;
}

class FilterModal<Filters, Sorters> extends React.Component<ModalProps<Filters, Sorters>, ModalState<Filters, Sorters>> {
    constructor(props: ModalProps<Filters, Sorters>) {
        super(props);
        const localState = this.props.localState;
        this.state = {
            range: localState.get("range"),
            sorter: localState.get("sorter"),
            direction: localState.get("direction"),
            filter: localState.get("filter"),
            showSorting: false,
        }
    }

    private resetState = () => {
        this.setState({
            range: this.props.localState.get("range"),
            sorter: this.props.localState.get("sorter"),
            direction: this.props.localState.get("direction"),
            filter: this.props.localState.get("filter"),
        })
    }

    componentDidMount = () => {
        // We don't subscribe here, since everythign will live in the modal.
        this.resetState();
    }

    render = () => {
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
                backgroundColor={this.props.backgroundColor}
                color={TAB_GREY}
                style={[{
                    marginLeft: LEFT_FIRST_MARGIN,
                    marginRight: TEXT_HORIZONTAL_MARGIN,
                    borderColor: BORDER_GREY,
                    backgroundColor: this.props.backgroundColor,
                }, this.props.style]}
                onModalClose={() => {
                    this.resetState();
                }}
            >
                {this.renderFilterSection()}
                {this.renderSorterSection()}
                {this.renderRangeSection()}
                {this.renderCloseButtons()}
            </ModalIconButton>
        )
    }

    private renderFilterSection = () => {
        if(this.props.filters.length > 0) {
            return (
                <React.Fragment>
                    <RowView
                        style={{
                            flex: 0,
                            height: MODAL_ROW_HEIGHT,
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginLeft: LEFT_FIRST_MARGIN,
                            marginRight: RIGHT_FIRST_MARGIN,
                        }}>
                        <HeaderText
                            level={2}
                            style={{}}
                        >
                            Filter By
                        </HeaderText>
                    </RowView>
                    <View
                        style={{
                            flex: 0,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            backgroundColor: backgroundColor(),
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
                                    return this.renderFilter(item, index);
                                }}
                                style={{
                                    flex: 0,
                                }}
                                showsHorizontalScrollIndicator={false}
                            ></FlatList>
                        </View>
                    </View>
                </React.Fragment>
            )
        }
        return null;
    }

    private renderFilter = (item: LabelValue<Filters>, index: number) => {
        return (
            <TouchableView
                style={{
                    flex: 0,
                    paddingLeft: index === 0 ? LEFT_FIRST_MARGIN : 0,
                }}
                onPress={() => {
                    this.setState({
                        filter: item.value,
                    })
                }}
                accessibilityLabel={"filter-" + item.value + "-" + this.props.accessibilityLabel}
                key={item.value as unknown as string}
            >
                {renderLabelBase(this.state.filter, item, "right")}
            </TouchableView>
        )
    }

    private renderSorterSection = () => {
        if(this.props.sorters.length > 0) {
            return (
                <React.Fragment>
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
                            Sort By
                        </HeaderText>
                        <RowView
                            style={{
                                flex: 0,                                            
                            }}
                        >
                            {renderArrows(this.state.direction, "sort-direction", (dir) => {
                                this.setState({
                                    direction: dir
                                })
                            })}
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
                </React.Fragment>
            )
        }

        return null;
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
                    {renderLabelBase(this.state.sorter, item, "right")}
                </TouchableView>
            )
        })
    }

    private renderRangeSection = () => {
        return (
            <React.Fragment>
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
                    {   renderRange(
                            this.state.range, 
                            (date) => {
                                this.setState((prevState) => {
                                    return {
                                        range: [date, prevState.range? prevState.range[1] : MyDate.Now().toDate()]
                                    }
                                })
                            },
                            (date) => {
                                this.setState((prevState) => {
                                    return {
                                        range: [prevState.range? prevState.range[0] : MyDate.Now().toDate(), date]
                                    }
                                })
                            }
                        )
                    }
            </React.Fragment>
        )
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
                            if(this.state.range === undefined) {
                                this.setState({
                                    range: [MyDate.Now().toDate(), MyDate.Now().toDate()]
                                })
                            } else {
                                this.setState({
                                    range: this.state.range
                                })
                            }
                        }
                    }}
                    accessibilityLabel={"date-" + item.value + "-" + this.props.accessibilityLabel}
                >
                    {renderLabelBase(this.state.range ? "range" : "all", item, "left")}
                </TouchableView>
            )
        })
    }

    private renderCloseButtons = () => {
        return (
            <React.Fragment>
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
                            const corrected: [Date, Date] | undefined = this.state.range !== undefined ? [
                                new MyDate(this.state.range[0]).asStartDate().toDate(),
                                new MyDate(this.state.range[1]).asDueDate().toDate(),
                            ] : this.state.range;
                            this.props.localState.pushAll({
                                range: corrected,
                                sorter: this.state.sorter,
                                direction: this.state.direction,
                                filter: this.state.filter,
                            });
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
            </React.Fragment>
        )
    }

}
function renderRange(range: undefined | [Date, Date], onStartChange: (d: Date) => void, onEndChange: (d: Date) => void) {
    if(range === undefined) {
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
                            value={range[0]}
                            onChangeDate={(date) => { 
                                onStartChange(new MyDate(date).asStartDate().toDate())
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
                            value={range[1]}
                            onChangeDate={ (date) => {
                                onEndChange(new MyDate(date).asDueDate().toDate())
                            }}
                            format={"01/31/20"}
                            readonly={false}
                        ></InlineDateInput>
                </View>
            </RowView>
        )
    }
}

function backgroundColor() {
    return "white";
}

function renderArrows(direction: "up" | "down", accessibilityLabel: string, onPress: (dir: "up" | "down") => void): JSX.Element[] {
    return ["ascending" as const, "descending" as const].map((type) => {
        return (
            <TouchableView
                style={{
                }}
                onPress={() => {
                    onPress(type === "ascending" ? "up" : "down");
                }}
                accessibilityLabel={
                    `dir-${type === "ascending" ? "up" : "down"}-` + accessibilityLabel
                }
            >
                <Icon
                    type={type}
                    {...colorStyles(direction, type === "ascending" ? "up" : "down")}
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