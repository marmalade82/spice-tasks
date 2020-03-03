
import React from "react";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface Props {
    item: Task
    accessibilityLabel: string
    navigation: any
    onTaskAction: OnTaskAction
}

export type OnTaskAction = (id: string, action: "complete" | "fail") => void;

interface State {
    showMore: boolean;
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

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
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
                type={"task"}
                footerIcons={[
                    () => {
                        return (
                            <ModalIconButton
                                type={"more"}
                                data={{
                                    showModal: this.state.showMore,
                                }}
                                onDataChange={({showModal}) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Mark complete"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onTaskAction(id, "complete");
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Mark failed"}
                                    iconType={"fail"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onTaskAction(id, "fail");
                                    }}
                                ></ModalRow>
                            </ModalIconButton>
                        )
                    }
                ]}
            >

            </ListItem>
        )
    }
}

export {
    TaskListItem,
    Task,
}