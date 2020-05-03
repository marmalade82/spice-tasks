
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";

export interface Props {
    item: StreakCycle,
    accessibilityLabel: string
    navigation: Navigation<ScreenParams>
    completed: boolean;
}

export interface StreakCycle {
    start: Date,
    end: Date,
    id: string,
}

interface State {
    showMore: boolean;
}


export class StreakCycleListItem extends Item<Props, State, StreakCycle> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const {id, start, end} = this.props.item
        
        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"StreakCycle"}
                accessibilityLabel={this.props.accessibilityLabel}
                text={this.text()}
                subtext={ this.subtext() }
                number={0}
                key={id}
                size={this.size()}
                type={this.type()}
                color={this.color()}
                footerIcons={undefined}
            >
            </ListItem>
        )
    }

    private text = () => {
        const {id, start, end} = this.props.item
        let myStart = new MyDate(start);
        let myEnd = new MyDate(end);
        if(myStart.sameDayAs(myEnd)) {
            return myStart.format("MMMM Do");
        } else {
            return `${myStart.format("MMM Do")} to ${myEnd.format("MMM Do")}`
        }
    }

    private iconOpts = () => {
        const { Class, Common, Custom } = this.context;
        const {id, start, end} = this.props.item
        if(this.props.completed) {
            return {
                subtext: "Complete",
                type: "complete",
                ...Custom.ListItem_Icon2
            } as const;
        } else {
            if(MyDate.WithinInclusive(start, end, MyDate.Now().toDate()) || MyDate.YBeforeX(start, MyDate.Now().toDate()) ) {
                return {
                    subtext: "In progress",
                    type: "in-progress",
                    ...Custom.ListItem_Icon2
                } as const;
            } else {
                return {
                    subtext: "Incomplete",
                    type: "not-complete",
                    ...Custom.ListItem_Icon,
                } as const;
            }
        }
    }

    private subtext = () => {
        return this.iconOpts().subtext;
    }

    private type = () => {
        return this.iconOpts().type
    }

    private color = () => {
        return this.iconOpts().color;
    }

    private size = () => {
        return this.iconOpts().size;
    }
}
export default StreakCycleListItem;