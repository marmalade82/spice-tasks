
import { StyleSheet } from "react-native";
import React from "react";

import Default from "./Styles";

export const spacer = 10;

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
        marginTop: Default.CONTAINER_VERTICAL_MARGIN,
    },
    ContainerMarginBottom: {
        marginBottom: 2 * Default.CONTAINER_VERTICAL_MARGIN,
    },
    TextInputSpacing: {
        marginBottom: 3,
    }, 
    Invisible: {
        display: "none"
    },
    Left_First_Margin: {
        marginLeft: Default.LEFT_FIRST_MARGIN
    },
    Left_Second_Margin: {
        marginLeft: Default.LEFT_SECOND_MARGIN
    },
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

const Common = makeCommon(Default);
export type CommonType = typeof Common;

export function makeCommon(S) {
    const Common = StyleSheet.create({
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
            paddingLeft: S.LEFT_FIRST_MARGIN,
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
        },
        StandardIconContainer: {
            flex: 0,
            height: S.ICON_CONTAINER_WIDTH,
            width: S.ICON_CONTAINER_WIDTH,
            borderRadius: S.ICON_CONTAINER_WIDTH/2,
            backgroundColor: "transparent",
        },
    })
    return Common;
}

const Class = makeClass(Default);
export type ClassType = typeof Class;

export function makeClass (S) {
    const Class = StyleSheet.create({
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
        },
        InlineDateInput_Container: {
            flex: 0,
            backgroundColor: "transparent",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 0,
        },
        InlineDateInput_InputContainer: {
            flex: 0,
            justifyContent: "space-between",
            backgroundColor: "transparent",
            alignItems: "flex-end",
            paddingLeft: 3,
            paddingRight: 7,
            borderColor: S.TEXT_GREY,
            borderBottomWidth: 1,
        },
        Label_Container: {
            flex: 0,
            paddingLeft: S.LEFT_SECOND_MARGIN,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "transparent",
            height: 30,
        },
        ListItem_Container: {
            borderBottomWidth: 1,
            borderBottomColor: "lightgrey",
            backgroundColor: "white",
        },
        ListItem_DisplayContainer: {
            justifyContent: "flex-start",
            paddingLeft: 15,
            paddingRight: S.RIGHT_FIRST_MARGIN,
            backgroundColor: "white",
            alignItems: "stretch",
        },
        ListItem_Main: {
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "white"
        },
        ListItem_IconContainer: {
            flex: 0,
            justifyContent: "flex-start",
            minWidth: 60,
            backgroundColor: "white",
            alignItems: "center",
        },
        ListItem_TextContainer: {
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "stretch",
            backgroundColor: "white"
        },
        ListItem_MainText: {
            backgroundColor: "white",
            marginTop: 15,
            marginLeft: 9,
        },
        ListItem_SubTextContainer: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
        },
        ListItem_Subtext: {
            marginTop: 2,
            marginLeft: 9,
            marginBottom: 15,
            backgroundColor: "white",
        },
        ListPicker_Container: {
            justifyContent: "flex-start",
            backgroundColor: "transparent",
        },
        ListPicker_TopSelectors: {
            flex: 0,
            justifyContent: "flex-start",
            marginBottom: S.CONTAINER_VERTICAL_MARGIN,
            backgroundColor: "white",
            elevation: S.CONTAINER_ELEVATION,
        },
        ListPicker_TopLists: {
            flex: 1,
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            marginBottom: S.CONTAINER_VERTICAL_MARGIN,
        },
        ListPicker_BottomSelectors: {
            flex: 0,
            justifyContent: "flex-start",
            marginTop: S.CONTAINER_VERTICAL_MARGIN,
            backgroundColor: "white",
            elevation: S.CONTAINER_ELEVATION,
        },
        ListPicker_BottomLists: {
            flex: 1,
            justifyContent: "flex-start",
            backgroundColor: "transparent",
        },
        ListPicker_Selector: {
            borderColor: "lightgrey",
        },
        ListPicker_IconContainer: {
            position: "relative",
            backgroundColor: 'transparent',
            flexDirection: "row-reverse",
            justifyContent: "flex-start"
        },
        Modal_Overlay: {
            flex: 1,
            backgroundColor: S.OVERLAY,
            paddingLeft: S.RIGHT_SECOND_MARGIN,
            paddingRight: S.RIGHT_SECOND_MARGIN,
        },
        Modal_Content: {
            flex: 0,
            maxHeight: "80%",
            justifyContent: "flex-start",
            alignItems: "stretch",
            backgroundColor: "white",
            width: "100%",
            paddingTop: S.MODAL_VERTICAL_PADDING,
            paddingBottom: S.MODAL_VERTICAL_PADDING,
            borderRadius: 5,
            overflow: "visible"
        },
        ModalRow_Container: {
            flex: 0,
            height: S.MODAL_ROW_HEIGHT,
            justifyContent: "flex-start",
            alignItems: "stretch",
            paddingLeft: S.LEFT_FIRST_MARGIN,
        },
        ModalRow_Content: {
            flex: 1,
            width: "100%",
            backgroundColor: "white",
        },
        MultilineInput_Container: {
            ...Common.InputContainer,
        },
        MultilineInput_Decorator: {
            ...Common.InputDecorator
        },
        MultilineInput_Text: {
            width: "100%",
            padding: 0,
            marginBottom: 3,
            color: S.TEXT_GREY,
        },
        NavigationGroup_Container: { 
            flex: 0,
            backgroundColor: "white",
            marginBottom: S.CONTAINER_VERTICAL_MARGIN,
            elevation: 5
        },
        NavigationGroup_Row: {
            marginBottom: 0,
            elevation: 0,
            borderBottomWidth: 1,
            borderColor: "lightgrey",
        },
        NavigationGroup_LastRow: {
            marginBottom: 0,
        },
        NavigationRow_Container: {
            flex: 0,
            justifyContent: "space-evenly",
            width: "100%",
            height: S.ROW_CONTAINER_HEIGHT,
            marginBottom: S.CONTAINER_VERTICAL_MARGIN,
            backgroundColor: "white",
            elevation: S.CONTAINER_ELEVATION,
        },
        NavigationRow_RowContainer: {
            flex: 0,
            height: S.ROW_HEIGHT,
            paddingLeft: S.LEFT_FIRST_MARGIN,
        },
        NavigationRow_RowText: {
            margin: S.TEXT_VERTICAL_MARGIN,
            marginLeft: S.TEXT_HORIZONTAL_MARGIN,
            marginRight: S.TEXT_HORIZONTAL_MARGIN,
        },
        NavigationRow_IconContainer: {
            ...Common.StandardIconContainer,
            backgroundColor: S.PRIMARY_COLOR,
        },
        NavigationRow_IconText: {
            color: "white",
        },
        PagedList_Container: {
            elevation: S.CONTAINER_ELEVATION,
            flex: 0,
            backgroundColor: "white",
        },
        PagedList_FooterContainer: {
            flex: 0, 
            height: S.ROW_CONTAINER_HEIGHT, 
            justifyContent: "center"
        },
        SidescrollPicker_HeaderContainer: { 
            flex: 0,
            justifyContent: "flex-start",
            alignItems: "center",
            marginRight: S.TEXT_HORIZONTAL_MARGIN,
        },
        SidescrollPicker_LabelContainer: {
            flex: 0,
            height: 50,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: S.PRIMARY_COLOR_LIGHT,
            paddingLeft: S.LEFT_SECOND_MARGIN,
            paddingRight: S.RIGHT_FIRST_MARGIN,
        },
        SidescrollPicker_LabelHeader: {
            color: S.TEXT_GREY,
        },
        SidescrollPicker_FilterModal: {
            position: "absolute",
            right: S.RIGHT_FIRST_MARGIN,
        },
        ActiveContainer: {
            backgroundColor: S.TAB_GREY,
            borderColor: S.TAB_GREY,
            borderWidth: 1,
            borderRadius: 20,
        },
        InactiveContainer: {
            backgroundColor: S.BACKGROUND_GREY,
            borderColor: S.BORDER_GREY,
            borderWidth: 1,
            borderRadius: 20,
        },
        ActiveText: {
            color: "white"
        },
        InactiveText: {
            color: "black"
        },
        FilterModal_Icon: {
            marginLeft: S.LEFT_FIRST_MARGIN,
            borderColor: S.BORDER_GREY,
        },
        FilterModal_FilterSection: {
            flex: 0,
            height: S.MODAL_ROW_HEIGHT,
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: S.LEFT_FIRST_MARGIN,
            marginRight: S.RIGHT_FIRST_MARGIN,
        },
        FilterModal_FilterList: {
            flex: 0,
            flexDirection: "row",
            justifyContent: "flex-start",
        },
        FilterModal_Filter: {
            flex: 0,
            paddingLeft: S.LEFT_FIRST_MARGIN,
        },
        FilterModal_SorterSection: {
            flex: 0,
            height: S.MODAL_ROW_HEIGHT,
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: S.LEFT_FIRST_MARGIN,
            marginRight: S.RIGHT_FIRST_MARGIN,
        },
        FilterModal_SorterContainer: {
            flex: 0,
            height: S.MODAL_ROW_HEIGHT,
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "stretch",
            marginLeft: S.LEFT_FIRST_MARGIN,
            marginRight: S.RIGHT_FIRST_MARGIN,
        },
        FilterModal_SorterContent: {
            flex: 1,
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
        },
        FilterModal_RangeSection: {
            flex: 0,
            height: S.MODAL_ROW_HEIGHT,
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: S.LEFT_FIRST_MARGIN,
            marginRight: S.RIGHT_FIRST_MARGIN,
        },
        FilterModal_CloseContainer: {
            justifyContent: "flex-end",
            marginRight: S.RIGHT_SECOND_MARGIN / 2,
        },
        FilterModal_CloseCancelContainer: {
            flex: 0,
            marginLeft: spacer,
            justifyContent: "center",
            alignItems: "center",
        },
        FilterModal_CloseCancel: {
            fontSize: 14,
            marginVertical: S.TEXT_VERTICAL_MARGIN,
            marginHorizontal: S.TEXT_HORIZONTAL_MARGIN,
        },
        FilterModal_EmptyRangeContainer: {
            flex: 0,
            width: "100%",
            height: S.MODAL_ROW_HEIGHT,
        },
        FilterModal_RangeContainer: {
            height: S.MODAL_ROW_HEIGHT,
            flex: 0,
            justifyContent: "flex-start",
            alignItems: "stretch",
            marginLeft: S.LEFT_FIRST_MARGIN,
            marginRight: S.RIGHT_FIRST_MARGIN,
        },
        FilterModal_RangeContent: {
            flex: 1,
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
        },
        FilterModal_ActiveArrow: {
            borderColor: S.TAB_GREY,
            borderWidth: 1,
        },
        FilterModal_InactiveArrow: {
            borderColor: S.BORDER_GREY,
            borderWidth: 1,
        },
        Summary_Container: {
            backgroundColor: "white",
            justifyContent: "flex-start",
            paddingBottom: 30,
            marginBottom: S.CONTAINER_VERTICAL_MARGIN,
            flex: 0,
            overflow: "hidden",
            elevation: S.CONTAINER_ELEVATION,
        },
        Summary_HeaderContainer: {
            flex: 0,
            paddingLeft: S.LEFT_SECOND_MARGIN,
            paddingRight: S.RIGHT_FIRST_MARGIN,
        },
        Summary_HeaderText: {
            marginTop: S.TEXT_VERTICAL_MARGIN,
            marginBottom: S.TEXT_VERTICAL_MARGIN,
        },
        Summary_HeaderIconContainer: {
            flex: 0,
            justifyContent: "flex-end",
            alignItems: "center",
            height: S.ROW_HEIGHT,
            marginTop: 5,
            backgroundColor: "white",
        },
        Summary_HeaderIcon: {
            flex: 0,
            marginLeft: S.RIGHT_SECOND_MARGIN / 2,
        },
        Summary_BodyContainer: {
            flex: 0,
            justifyContent: "flex-start",
            paddingLeft: S.LEFT_SECOND_MARGIN,
            paddingRight: S.RIGHT_SECOND_MARGIN,
            alignItems: "stretch",
        },
        TextInput_Container: {
            ...Common.InputContainer
        },
        TextInput_Decorator: {
            ...Common.InputDecorator
        },
        TimeInput_Container: {
            ...Common.InputContainer,
        },
        TimeInput_Decorator: {
            ...Common.InputDecorator,
        },
        Card_Container: {
            backgroundColor: "white",
            margin: 15,
            elevation: 10,
            padding: 10,
        },
        Card_LabelContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
            height: 40,
            marginTop: 10,
        },
        Card_Label: {
            padding: 3,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginRight: 3,
            justifyContent: "center",
            alignItems: "center",
        },
        Card_LabelText: {
            fontSize: 15,
        },
        Card_ActiveLabelText: {
            color: "white",
        },
        Card_InactiveLabelText: {
            color: S.TAB_GREY,
        },
        Card_ActiveLabelContainer: {
            backgroundColor: S.TAB_GREY
        },
        Card_InactiveLabelContainer: {
            backgroundColor: "white"
        },
        FootSpacer_Container: {
            flex: 0, marginBottom: S.ROW_CONTAINER_HEIGHT
        },
        Panel_Header: {
            marginVertical: 10,
            marginHorizontal: 10,
        },
        Panel_Container: {
            marginHorizontal: 20,
            marginVertical: 10,
            borderRadius: 15,
            backgroundColor: "white",
        },
        SettingsColorInput_Container: {
            backgroundColor: "transparent",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 3,
            marginHorizontal: 10,
            borderColor: "lightgrey",
            borderWidth: 0,
            borderTopWidth: 1,
            borderBottomWidth: 0,
        },
        SettingsColorInput_Color: {
            height: 20,
            width: 20,
            marginRight: 10,
            borderRadius: 50,
            borderColor: "black",
            
            borderBottomWidth: 1,
            borderRightWidth: 1,
        },
        ConfirmActionInput_Container: {
            backgroundColor: "transparent",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 3,
            marginHorizontal: 10,
            borderColor: "lightgrey",
            borderWidth: 0,
            borderTopWidth: 1,
            borderBottomWidth: 0,
        },
        SettingsChoiceInput_Container: {
            backgroundColor: "transparent",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 3,
            marginHorizontal: 10,
            borderColor: "lightgrey",
            borderWidth: 0,
            borderTopWidth: 1,
            borderBottomWidth: 0,
        },
        SettingsChoiceInput_ChoiceContainer: {
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignItems: "center",
            borderColor: "lightgrey",
        },
        SettingsChoiceInput_ChoiceIndicator: {
            width: 10,
            height: 10,
            backgroundColor: S.PRIMARY_COLOR,
            borderRadius: 100,
            marginLeft: 0,
        }
    })
    return Class;
}


export function makeCustom(S) {
    const Custom = {
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
        },
        ModalRow_Icon: {
            color: S.PRIMARY_COLOR,
            size: 25,
            backgroundColor: "white"
        },
        MultilineInput_TextInput: {
            placeholderTextColor: S.PLACEHOLDER_GREY
        },
        NavigationRow_Icon: {
            backgroundColor: "white",
            color: S.SECONDARY_COLOR, 
        },
        SidescrollPicker_FilterModal: {
            backgroundColor: S.PRIMARY_COLOR_LIGHT
        },
        FilterModal_Icon: {
            color: S.TAB_GREY,
            size: 23,
        },
        FilterModal_ActiveArrow: {
            backgroundColor: S.TAB_GREY,
            color: "white",
        },
        FilterModal_InactiveArrow: {
            backgroundColor: S.BACKGROUND_GREY,
            color: "black",
        },
        ListPicker_Icon: {
            color: 'green',
            size: 37,
        }
    }
    return Custom;
}

const Custom = makeCustom(Default);
export type CustomType = typeof Custom;

export const StyleSheetContext = React.createContext({
    Class: Class,
    Custom: Custom,
    Common: Common,
})