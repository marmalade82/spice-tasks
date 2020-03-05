import React from "react";


import Swipeable from "react-native-gesture-handler/Swipeable";
import {Animated} from "react-native";

interface Props {
    onSwipeLeftOpen?: () => void;
    onSwipeRightOpen?: () => void;
    onSwipeClose?: () => void;
    onSwipeOpen?: () => void;
    renderSwipeRight?: () => JSX.Element;
    renderSwipeLeft?: () => JSX.Element;
}

export default class SwipeRow extends React.Component<Props> {
    swipeRef: React.RefObject<Swipeable>
    constructor(props: Props) {
        super(props);
        this.swipeRef = React.createRef();
    }

    close = () => {
        this.swipeRef.current && this.swipeRef.current.close ? this.swipeRef.current.close() : null
    }

    swipeRight = () => {
        this.swipeRef.current && this.swipeRef.current.openLeft ? this.swipeRef.current.openLeft() : null
    }

    swipeLeft = () => {
        this.swipeRef.current && this.swipeRef.current.openRight ? this.swipeRef.current.openRight() : null
    }

    render = () => {
        return (
            <Swipeable
                friction={1}
                leftThreshold={60}
                rightThreshold={60}
                onSwipeableLeftOpen={this.props.onSwipeRightOpen}
                onSwipeableRightOpen={this.props.onSwipeLeftOpen}
                onSwipeableClose={this.props.onSwipeClose}
                onSwipeableOpen={this.props.onSwipeOpen}
                renderLeftActions={(progress, dragX) => {
                    if(this.props.renderSwipeRight) {

                        return (
                            this.props.renderSwipeRight()
                        )
                    }
                    return null;
                }}
                renderRightActions={this.props.renderSwipeLeft}
                ref={this.swipeRef}
            >
                {this.props.children}
            </Swipeable>
        );
    }
}