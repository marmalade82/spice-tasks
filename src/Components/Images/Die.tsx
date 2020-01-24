import React from "react";

import { Image } from "src/Components/Basic/Basic";

interface Props {
    number: number;
}

export default class Die extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    imagePath = () => {
        switch(this.props.number) {
            case 1: {
                return require("assets/images/one-die.png");
            } break;
            case 2: {
                return require("assets/images/two-die.png");
            } break;
            case 3: {
                return require("assets/images/three-die.png");
            } break;
            case 4: {
                return require("assets/images/four-die.png");
            } break;
            case 5: {
                return require("assets/images/five-die.png");
            } break;
            case 6: {
                return require("assets/images/six-die.png");
            } break;
            default: {
                return require("assets/images/one-die.png");
            }
        }

    }

    render = () => {
        return (
            <Image
                accessibilityLabel={"die-" + this.props.number.toString()}
                source={this.imagePath()}
            >
            </Image>
        );
    }
}