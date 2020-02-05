
import React from "react";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface Props {
    item: Task
    accessibilityLabel: string
    navigation: any
}

interface State {

}

interface Task {
    id: string;
    title: string;
    due_date: Date;
    start_date: Date;
}

export default class TaskListItem extends Item<Props, State, Task> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const item = this.props.item
        const { id, title, due_date, start_date } = this.props.item;

        return (
            <ListItem
                text={title}
                subtext={new MyDate(due_date).format("MMM Do")}
                navigation={this.props.navigation}
                destination={'Task'}
                params={{id: id}}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
            >

            </ListItem>
        )
    }
}

export {
    TaskListItem,
    Task,
}