
import { StyleSheet } from "react-native";

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


export const Class = StyleSheet.create({

})