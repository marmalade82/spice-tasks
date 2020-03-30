import React from "react";
import { FlatList, View } from "react-native";
import { TAB_GREY, PLACEHOLDER_GREY, BACKGROUND_GREY, BORDER_GREY, LEFT_FIRST_MARGIN, RIGHT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, TEXT_HORIZONTAL_MARGIN, MODAL_ROW_HEIGHT, TEXT_GREY } from "./Styles";
import { BodyText, TouchableView, RowView, HeaderText } from "../Basic/Basic";
import { Icon } from "./Icon";
import { ModalIconButton } from "./Styled";
import ModalRow from "./ModalRow";


export interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

interface Props<Filters, Sorters> {
    filters: LabelValue<Filters>[]
    onPickFilter: (choice: Filters) => void;
    currentFilter: Filters;
    sorters: LabelValue<Sorters>[]
    onPickSorter: (choice: Sorters) => void;
    currentSorter: Sorters;
    currentDirection: "up" | "down";
    onPickDirection: (d: "up" | "down") => void;
    accessibilityLabel: string;
}

interface State {
    showSorting: boolean;
}

const marginHorizontal = 13;
const spacer = 10;

export class SidescrollPicker<Filters, Sorters> extends React.Component<Props<Filters, Sorters>, State> {
    constructor(props: Props<Filters, Sorters>) {
        super(props);
        this.state = {
            showSorting: false
        }
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
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        marginLeft: LEFT_FIRST_MARGIN,
                                    }}
                                >
                                    {this.renderArrows()}
                                </RowView>
                                <RowView
                                    style={{
                                        flex: 0,
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        marginLeft: LEFT_FIRST_MARGIN,
                                        marginRight: RIGHT_FIRST_MARGIN,
                                        flexWrap: "wrap"
                                    }}
                                >
                                { this.renderSorters() }
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
                    style={{}}
                    onPress={() => {
                        this.props.onPickDirection(type === "ascending" ? "up" : "down");
                    }}
                    accessibilityLabel={
                        `dir-${type === "ascending" ? "up" : "down"}-` + this.props.accessibilityLabel
                    }
                >
                    <Icon
                        type={type}
                        {...colorStyles(this.props.currentDirection, type === "ascending" ? "up" : "down")}
                    >
                    </Icon>
                </TouchableView>
            )
        })

        function colorStyles(current: "up" | "down", actual: "up" | "down") {
            const styles = {
                marginBottom: spacer,
                marginRight: spacer,
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
                    this.props.onPickFilter(item.value);
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
                        ...colorStyles(this.props.currentFilter, item.value),
                    }}
                >
                    <BodyText
                        style={{
                            marginHorizontal: marginHorizontal,
                            fontSize: 14,
                            ...textStyles(this.props.currentFilter, item.value),
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

    private renderSorters = () => {
        let choices = this.props.sorters;
        return choices.map((item: LabelValue<Sorters>) => {
            return (

                <TouchableView
                    style={{
                        flex: 0,
                    }}
                    onPress={() => {
                        this.props.onPickSorter(item.value);
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
                            marginBottom: spacer,
                            ...colorStyles(this.props.currentSorter, item.value),
                        }}
                    >
                        <BodyText
                            style={{
                                marginHorizontal: marginHorizontal,
                                fontSize: 14,
                                ...textStyles(this.props.currentSorter, item.value),
                            }}
                        >
                            {item.label}
                        </BodyText> 
                    </View>
                </TouchableView>
            )
        })

        function colorStyles(current: Sorters, actual: Sorters) {
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

        function textStyles(current: Sorters, actual: Sorters) {
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

}


export default SidescrollPicker;