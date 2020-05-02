import React from "react";
import { FlatList, View, Button, StyleProp, ViewStyle } from "react-native";
import { BodyText, TouchableView, RowView, HeaderText } from "../Basic/Basic";
import { Icon } from "./Icon";
import { ModalIconButton, DateInput } from "./Styled";
import { DropdownInput } from "./DropdownInput";
import ModalRow from "./ModalRow";
import InlineDateInput from "./InlineDateInput";
import MyDate from "src/common/Date";
import { ILocalState } from "src/Screens/common/StateProvider";
import * as v from "voca";
import { Class, Custom, spacer } from "./StyleSheets";

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
        if(this.props.label === undefined) {
            this.props.localState.subscribe("filter", (filter) => {
                this.setState({
                    filter: filter
                });
            })
            this.resetState();
        }
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
                    ...Class.SidescrollPicker_HeaderContainer,
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
                <RowView style={Class.SidescrollPicker_LabelContainer }
                >
                    <HeaderText style={Class.SidescrollPicker_LabelHeader} level={2}>{label}</HeaderText>
                    <FilterModal
                        {...Custom.SidescrollPicker_FilterModal}
                        {...rest}
                        style={Class.SidescrollPicker_FilterModal}
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
                ...Class.ActiveContainer
            } as const
        } else {
            return {
                ...Class.InactiveContainer
            } as const;
        }

    }

    function textStyles(current: Thing, actual: Thing) {
        if(current === actual) {
            return {
                ...Class.ActiveText
            } as const;
        } else {
            return {
                ...Class.InactiveText
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
    label?: string
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
                {...Custom.FilterModal_Icon}
                style={[Class.FilterModal_Icon, {
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
                        style={Class.FilterModal_FilterSection}>
                        <HeaderText
                            level={2}
                            style={{}}
                        >
                            Filter By
                        </HeaderText>
                    </RowView>
                    <View
                        style={{
                            ...Class.FilterModal_FilterList,
                            backgroundColor: backgroundColor(),
                        }}
                    >
                        <View
                            style={{
                                paddingVertical: 10,
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
                    ...Class.FilterModal_Filter,
                    ...(index !== 0 && { paddingLeft: 0 })
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
                        style={Class.FilterModal_SorterSection}
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
                        style={Class.FilterModal_SorterContainer}
                    >
                        <View
                            style={Class.FilterModal_SorterContent}
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
                    style={Class.FilterModal_RangeSection }
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
                    style={Class.FilterModal_CloseContainer}
                >
                    <TouchableView
                        style={Class.FilterModal_CloseCancelContainer}
                        onPress={() => {
                            this.setState({
                                showSorting: false,
                            })
                            this.resetState();
                        }}
                    >
                        <HeaderText style={Class.FilterModal_CloseCancel} level={3}>CANCEL</HeaderText>
                    </TouchableView>
                    <TouchableView
                        style={Class.FilterModal_CloseCancelContainer}
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
                        <HeaderText style={Class.FilterModal_CloseCancel}  level={3}>OK</HeaderText>
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
                style={Class.FilterModal_EmptyRangeContainer}

            ></RowView>
        )
    } else {
        return (
            <RowView
                style={Class.FilterModal_RangeContainer}
            >
                <View
                    style={Class.FilterModal_RangeContent }
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
            marginLeft: spacer,
        }
        if(current === actual) {
            return {
                ...Custom.FilterModal_ActiveArrow,
                style: {
                    ...Class.FilterModal_ActiveArrow,
                    ...styles
                }
            }
        } else {
            return {
                ...Custom.FilterModal_InactiveArrow,
                style: {
                    ...Class.FilterModal_InactiveArrow,
                    ...styles
                }
            }
        }
    }
}