import React from "react";

import Dropdown from "./ReactDropDown";



interface DropdownProps {
    height: number;
    width: number;
    choices: string[];
    onChange: (thing: string) => void;
}


interface Props extends DropdownProps {
    current: string;
}


export class DropdownInput extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <Dropdown
                height={this.props.height}
                width={this.props.width}
                choices={this.props.choices}
                current={this.current()}
                onChange={(event) => {
                    this.props.onChange(event.nativeEvent.message.toString())
                }}
            >
            </Dropdown>
        )
    }

    current = () => {
        let index = this.props.choices.findIndex((val) => val === this.props.current)
        if(index > -1) {
            console.log("FOUND");
            return index;
        }
        console.log("NOT FOUND");

        return 0;
    }

}
export default DropdownInput;

