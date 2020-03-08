import React from "react";
import { ConnectedTaskList } from "./Task/TaskList";

interface Props {
    id: string;
    table: "task" | "goal";
    navigation: any;
}

export default class ConnectedSingleList extends React.Component<Props> {


    render = () => {
        return this.renderList();
    }

    renderList = () => {
        switch(this.props.table) {
            case "task": {
                return (
                    <ConnectedTaskList
                        type={"single"}
                        id={this.props.id}
                        navigation={this.props.navigation}
                        paginate={4}
                        onTaskAction={() => {}}
                        parentId={""}
                    ></ConnectedTaskList>
                )
            } break;
            case "goal": {
                
            } break;
        }
    }
}