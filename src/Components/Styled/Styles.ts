import { StyleSheet } from "react-native";

export const TEXT_VERTICAL_MARGIN = 15;

export const TEXT_HORIZONTAL_MARGIN = 9;

export const ROW_CONTAINER_HEIGHT = 62;

export const ROW_HEIGHT = ROW_CONTAINER_HEIGHT - 2;

export const PRIMARY_COLOR = "rgb(191,38,0)";

export const PRIMARY_COLOR_LIGHT = "rgb(237,223,220)";

export const LEFT_FIRST_MARGIN = 15;

export const RIGHT_FIRST_MARGIN = 15;

export const ICON_CONTAINER_WIDTH = 37;

export const LEFT_SECOND_MARGIN = LEFT_FIRST_MARGIN + ICON_CONTAINER_WIDTH + TEXT_HORIZONTAL_MARGIN;

export const RIGHT_SECOND_MARGIN = 25 + RIGHT_FIRST_MARGIN;

export const CONTAINER_VERTICAL_MARGIN = 10;

export const CONTAINER_ELEVATION = 5;

export const SECONDARY_COLOR = "rgb(7,99,5)";

export const MODAL_ROW_HEIGHT = 50;

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
    }
})