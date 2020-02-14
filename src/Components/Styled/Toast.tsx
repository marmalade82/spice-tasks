import React from "react";
import { ToastAndroid, View } from "react-native";

interface Props {
    visible: boolean;
    message: string;
    onToastDisplay: () => void;
}

export default class Toast extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        if(this.props.visible) {
            ToastAndroid.showWithGravity(this.props.message, ToastAndroid.LONG, ToastAndroid.CENTER)
            this.props.onToastDisplay();
        }

        if(this.props.message) {
            return <View style={{
                flex: 0,
                height: 0,
                width: 0,
                
            }}
                accessibilityLabel="toast"
            ></View>
        }
        return null;
    }
}