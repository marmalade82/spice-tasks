
import React from "react";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { SECONDARY_COLOR, PRIMARY_COLOR } from "src/Components/Styled/Styles";

interface Props {
    item: Task
    accessibilityLabel: string
    navigation: Navigation<ScreenParams>
    onTaskAction: OnTaskAction
    iconIndicates?: "completion"
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
    active: boolean;
}

export default class TaskListItem extends Item<Props, State, Task> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const { id, title, due_date, start_date, active } = this.props.item;

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
                type={this.type()}
                color={this.color()}
                size={this.size()}
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
                                    accessibilityLabel={"complete-" + id}
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
                                    accessibilityLabel={"fail-" + id}
                                ></ModalRow>
                            </ModalIconButton>
                        )
                    }
                ]}
            >

            </ListItem>
        )

    }

    private iconOpts = () => {
        const { id, title, due_date, start_date, active } = this.props.item;
        if(this.props.iconIndicates === "completion") {
            if(active) {
                return {
                    type: "not-complete",
                    color: PRIMARY_COLOR,
                    size: 30,
                }  as const;
            } else {
                return {
                    type: "complete",
                    color: SECONDARY_COLOR,
                    size: 30,
                } as const;
            }
        } else {
            return {
                type: "task",
                color: SECONDARY_COLOR,
            } as const;
        }

    }

    private type = () => {
        return this.iconOpts().type
    }

    private color = () => {
        return this.iconOpts().color
    }

    private size = () => {
        return this.iconOpts().size
    }
}

export {
    TaskListItem,
    Task,
}