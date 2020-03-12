import { StyleSheet } from "react-native";

export const TEXT_VERTICAL_MARGIN = 15;

export const TEXT_HORIZONTAL_MARGIN = 9;

export const ROW_CONTAINER_HEIGHT = 65;

export const ROW_HEIGHT = ROW_CONTAINER_HEIGHT - 5;

export const PRIMARY_COLOR = "rgb(191,38,0)";

export const PRIMARY_COLOR_LIGHT = "rgb(237,223,220)";

export const LEFT_FIRST_MARGIN = 15;

export const RIGHT_FIRST_MARGIN = 15;

export const ICON_CONTAINER_WIDTH = 37;

export const LEFT_SECOND_MARGIN = LEFT_FIRST_MARGIN + ICON_CONTAINER_WIDTH + TEXT_HORIZONTAL_MARGIN;

export const RIGHT_SECOND_MARGIN = 25 + RIGHT_FIRST_MARGIN;

export const CONTAINER_VERTICAL_MARGIN = 15;

export const CONTAINER_ELEVATION = 5;

export const SECONDARY_COLOR = "rgb(7,99,5)";

export const MODAL_ROW_HEIGHT = 50;

export const OVERLAY = "rgba(15,15,15,0.6)";

export const MODAL_VERTICAL_PADDING = 10;

export const TEXT_GREY = "rgb(70,70,70)";

export const TAB_GREY = TEXT_GREY;

export const PLACEHOLDER_GREY = "rgb(150, 150, 150)";

export const Styles = StyleSheet.create({
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