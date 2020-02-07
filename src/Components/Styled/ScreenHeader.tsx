import React from "react";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView } from "src/Components/Basic/Basic";
import { 
    PRIMARY_COLOR, ROW_CONTAINER_HEIGHT, CONTAINER_ELEVATION, 
    Styles, TEXT_VERTICAL_MARGIN, LEFT_FIRST_MARGIN, 
    RIGHT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN 
} from "./Styles";
import { Icon } from "react-native-elements";
import { View, StyleProp, ViewStyle } from "react-native";

interface Props {
    style?: StyleProp<ViewStyle>
}

export default class ScreenHeader extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView style={[{
                flex: 0,
                height: ROW_CONTAINER_HEIGHT,
                backgroundColor: PRIMARY_COLOR,
                elevation: CONTAINER_ELEVATION,
                paddingRight: RIGHT_FIRST_MARGIN,
            }, Styles.CENTERED_SECONDARY, this.props.style]}>
                <HeaderText level={1} style={{
                        marginTop: TEXT_VERTICAL_MARGIN,
                        marginLeft: LEFT_SECOND_MARGIN,
                        marginRight: RIGHT_SECOND_MARGIN,
                        marginBottom: TEXT_VERTICAL_MARGIN,
                        color: "white",
                    }}
                    numberOfLines={1}
                    ellipsizeMode={"middle"}
                >
                    { this.props.children }
                </HeaderText>
                <RowReverseView style={{
                    justifyContent: "flex-start",
                    backgroundColor: PRIMARY_COLOR,
                }}>
                    <View
                        style={{
                            width: 37,
                            height: 37,
                            justifyContent: "center",
                            alignItems: "center",
                        }} 
                    >
                    </View>
                    
                </RowReverseView>
            </RowView>
        )
    }
}