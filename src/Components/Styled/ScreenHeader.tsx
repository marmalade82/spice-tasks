import React from "react";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView, TouchableView } from "src/Components/Basic/Basic";
import { 
    PRIMARY_COLOR, ROW_CONTAINER_HEIGHT, CONTAINER_ELEVATION, 
    Styles, TEXT_VERTICAL_MARGIN, LEFT_FIRST_MARGIN, 
    RIGHT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN 
} from "./Styles";
import { Icon } from "src/Components/Styled/Styled";
import { View, StyleProp, ViewStyle } from "react-native";

interface Props {
    style?: StyleProp<ViewStyle>;
    navigation: any;
    showBack: boolean;
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
                paddingLeft: LEFT_FIRST_MARGIN,
                paddingRight: RIGHT_FIRST_MARGIN,
            }, Styles.CENTERED_SECONDARY, this.props.style]}>
                {this.renderBack()}
                <HeaderText level={1} style={{
                        marginTop: TEXT_VERTICAL_MARGIN,
                        marginLeft: TEXT_HORIZONTAL_MARGIN,
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

    renderBack = () => {
        if(this.props.showBack) {
            return (
                <TouchableView style={{}}
                    onPress={() => {
                        console.log("going back")
                        console.log(JSON.stringify(this.props.navigation))
                        this.props.navigation.goBack(null);
                    }}
                >
                    <Icon type= {"arrow-left"}
                        color={"white"}
                        backgroundColor={"transparent"}
                        size={23}
                    ></Icon>
                </TouchableView>
            )
        } else {
            return (
                    <Icon type={"none"}
                        color={"white"}
                        backgroundColor={"transparent"}
                    ></Icon>
            );
        }
    }
}