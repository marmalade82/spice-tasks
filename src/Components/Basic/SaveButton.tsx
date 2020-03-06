import React from "react";
import { View } from "react-native";
import { IconButton } from "../Styled/Styled";

interface Props {
    onSave : () => void;
}

export default class SaveButton extends React.Component<Props> {

    render = () => {
        return (
                <View
                    style={{
                        flex: 0,
                        position: "absolute",
                        right: 50,
                        bottom: 20,
                    }}
                >
                    <IconButton
                        type={"save"}
                        accessibilityLabel={"save-button"}
                        onPress={this.props.onSave}
                        size={30}
                        overlaySize={50}
                    ></IconButton>
                </View>
        )
    }
}