import { StyleSheet } from "react-native";
import { withOrientation } from "react-navigation";

const Style = StyleSheet.create({
    basicLayout: {

    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    topDownSpaced: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-around',

    },

    redBg: {
        backgroundColor: 'pink',
    },

    yellowBg: {
        backgroundColor: 'lightyellow',
    },

    blueBg: {
        backgroundColor: 'lightblue',
    },

    greenBg: {
        backgroundColor: 'lightgreen',
    },

    whiteBg: {
        backgroundColor: 'white',
    },

    maxInputHeight: {
        maxHeight: "100%",
    },

    modalContainer: {
        marginTop: "5%",
        marginBottom: "5%",
        marginLeft: "5%",
        marginRight: "5%",
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Style;