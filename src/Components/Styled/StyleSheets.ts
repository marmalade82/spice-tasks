
import { StyleSheet } from "react-native";

import * as S from "./Styles";

export const Layout = StyleSheet.create({
    CENTERED: {
        justifyContent: "center",
        alignItems: "center"
    },
    CENTERED_SECONDARY: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
    CENTERED_PRIMARY: {
        justifyContent: "center",
        alignItems: "stretch",
    },
    SHRINK_WRAP: {
        flex: 0,
    },
    ContainerMarginTop: {
        marginTop: S.CONTAINER_VERTICAL_MARGIN,
    },
    ContainerMarginBottom: {
        marginBottom: 2 * S.CONTAINER_VERTICAL_MARGIN,
    },
    TextInputSpacing: {
        marginBottom: 3,
    }, 
    Invisible: {
        display: "none"
    }

})

export const Type = StyleSheet.create({
    HEADER_DEFAULT: {
        fontFamily: "OpenSans-Regular",
        color: "black",
        fontSize: 16,
    },
    HEADER_1: {
        fontSize: 22,
        fontFamily: "OpenSans-SemiBold",
    },
    HEADER_2: {
        fontSize: 20,
        fontFamily: "OpenSans-SemiBold",
    },
    HEADER_3: {
        fontSize: 17, 
        fontFamily: "OpenSans-SemiBold",
    },
    HEADER_4: {
        fontSize: 17,
        fontFamily: "OpenSans-Italic",
    },
    HEADER_5: {
        fontSize: 17,
        fontFamily: "OpenSans-Regular",
    },
})

export const Common = StyleSheet.create({
    RowContainer: {
        flex: 0,
        height: S.ROW_CONTAINER_HEIGHT,
        width: "100%",
    },
    PageBackground: {
        backgroundColor: "white",
    },
    PrimaryBackground: {
        backgroundColor: S.PRIMARY_COLOR,
    },
    PrimaryLightBackground: {
        backgroundColor: S.PRIMARY_COLOR_LIGHT,
    },
    TransparentBackground: {
        backgroundColor: "transparent",
    },
    InputContainer: {
        flex: 0,
        backgroundColor: "transparent",
        paddingLeft: S.LEFT_SECOND_MARGIN,
        paddingRight: S.RIGHT_SECOND_MARGIN,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: 0,
    },
    InputSubContainer: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "transparent",
        alignItems: "center",
    },
    InputDecorator: {
        flex: 1,
        backgroundColor: "transparent",
        borderColor: S.TEXT_GREY, 
        borderBottomWidth: 1,
        marginLeft: S.TEXT_HORIZONTAL_MARGIN,
    }
})


export const Class = StyleSheet.create({
    SwipeContainer: {
        backgroundColor: S.PRIMARY_COLOR,
        flex: 0,
        height: "100%",
        width: "100%",
        elevation: S.CONTAINER_ELEVATION,
    },
    InputContainer: {
        backgroundColor: "transparent",
        flex: 0,
        ...Layout.ContainerMarginBottom,
    },
    EmptyList_Container: {
        flex: 0,
        width: "100%",
        height: 1.2 * S.ROW_CONTAINER_HEIGHT,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: S.LEFT_FIRST_MARGIN,
        paddingRight: S.RIGHT_SECOND_MARGIN,
    },
    EmptyList_Header: {
        marginLeft: S.TEXT_HORIZONTAL_MARGIN,
        color: S.TEXT_GREY,
    },
    RowContainer: {
        flex: 0,
        height: S.ROW_CONTAINER_HEIGHT,
        width: "100%",
    },
    BackgroundTitle_Container: {
        flex: 0,
        height: 50,
        backgroundColor: S.PRIMARY_COLOR_LIGHT,
        paddingLeft: S.LEFT_SECOND_MARGIN,
        marginTop: S.CONTAINER_VERTICAL_MARGIN,
    },
    BackgroundTitle_Text: {
        color: S.TEXT_GREY,
    },
    ChoiceInput_Container: {
        ...Common.InputContainer,
    },
    ChoiceInput_InputDecorator: {
        ...Common.InputDecorator,
    },
    ChoiceInput_InputContainer: {
        ...Common.InputSubContainer,
    },
    TextInputType: {
        ...Layout.TextInputSpacing,
        color: S.TEXT_GREY,
    },
    ClickRow_Container: {
        flexDirection: "column",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "stretch",
        ...Common.RowContainer,
    },
    ClickRow_Touchable: {
        ...Common.RowContainer,
        backgroundColor: "white",
        flexDirection: "row",
    },
    ClickRow_Row: {
        ...Common.RowContainer,
        flex: 1,
        paddingLeft: S.LEFT_FIRST_MARGIN,
        paddingRight: S.RIGHT_FIRST_MARGIN,
    },
    ClickRow_NumberText: {
        color: "white",
    },
    ClickRow_Text: {
        color: "white",
        marginTop: S.TEXT_VERTICAL_MARGIN,
        marginBottom: S.TEXT_VERTICAL_MARGIN,
        marginLeft: S.TEXT_HORIZONTAL_MARGIN,
    },
    ClickRow_RightContainer: { 
        ...Layout.SHRINK_WRAP,
        backgroundColor: "white",
    },
    StandardIconContainer: {
        flex: 0,
        height: S.ICON_CONTAINER_WIDTH,
        width: S.ICON_CONTAINER_WIDTH,
        borderRadius: S.ICON_CONTAINER_WIDTH/2,
        backgroundColor: "transparent",
    },
    DateInput_Container: {
        ...Common.InputContainer,
    },
    DateInput_Decorator: {
        ...Common.InputDecorator,
    },
    DateInput_InputContainer: {
        ...Common.InputSubContainer,
    },
    DocumentView_Container: {
        justifyContent: "flex-start",
        backgroundColor: S.PRIMARY_COLOR_LIGHT,
    },
    DropdownInput_Container: {
        ...Common.InputContainer,
    },
    DynamicChoiceInput_Container: {
        ...Common.InputContainer,
    },
    DynamicChoiceInput_Decorator: {
        ...Common.InputDecorator
    },
    ScreenHeader_Container: {
        flex: 0,
        height: S.ROW_CONTAINER_HEIGHT,
        backgroundColor: S.PRIMARY_COLOR,
        elevation: S.CONTAINER_ELEVATION,
        paddingLeft: S.LEFT_FIRST_MARGIN,
        paddingRight: S.RIGHT_SECOND_MARGIN,
    },
    ScreenHeader_Header: {
        marginTop: S.TEXT_VERTICAL_MARGIN,
        marginLeft: S.TEXT_HORIZONTAL_MARGIN,
        marginRight: S.RIGHT_SECOND_MARGIN,
        marginBottom: S.TEXT_VERTICAL_MARGIN,
        color: "white",
    },
    ScreenHeader_RightContainer: {
        justifyContent: "flex-start",
        backgroundColor: S.PRIMARY_COLOR,
    }
})

export const Custom = {
    EmptyList_Icon: {
        color: "green",
        backgroundColor: "transparent",
        size: 30,
    },
    ListItem_Icon2: {
        color: S.SECONDARY_COLOR,
        size: 30,
    },
    ListItem_Icon: {
        color: S.PRIMARY_COLOR,
        size: 30,
    },
    ChoiceInput_Icon: {
        color: S.TEXT_GREY,
        size: 20
    },
    AlertIcon: {
        backgroundColor: "transparent",
        color: S.PRIMARY_COLOR,
    },
    DropdownInput_Dropdown: {
        height : S.MODAL_ROW_HEIGHT - 8,
        width : 120,
    },
    Icon_Transparent: {
        color: "white",
        size: 20
    },
    Icon_Grey: {
        color: "grey",
        size: 20
    },
    Icon_Primary: {
        color: S.PRIMARY_COLOR,
        size: 20
    },
    Icon_Secondary: {
        color: S.SECONDARY_COLOR,
        size: 20
    },
    IconButton_Icon: {
        color: S.PRIMARY_COLOR,
        size: 29,
        backgroundColor: "white",
    }
}