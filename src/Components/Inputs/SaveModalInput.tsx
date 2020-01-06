import React from "react";
import ModalInput from "src/Components/Inputs/ModalInput";
import { View, StyleSheet, Button, Text } from "react-native";
import Style from "src/Style/Style";
import { DataComponent, DataProps } from "../base/DataComponent";


interface Props<FormProps, FormData> {
    title: string
    animationType: "none" | "slide" | "fade"
    screenType: "grey" | "transparent" | "full"
    onSave: (data: Readonly<FormData>) => void // detects whether the user clicked the "save" button
    formProps: FormProps & DataProps<FormData>
    renderData: (data: Readonly<FormData>) => string
}

interface State<FormData> {
    formData: FormData
}

const localStyle = StyleSheet.create({
    modalContainer: {
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    saveContainer: {
        flex: 1,
    },
    children: {
        flex: 1,
    },

});

/**
 * This function allows you to create a component that enhances a data-returning component
 * with modal functionality that includes a 'save' button that, when clicked, passes the
 * data of the form to the parent component's callback.
 * @param DataComponent - constructor for the data-returning component.
 */
export default function createSaveModalInput
        < T extends DataComponent<FormProps, FormState, FormData>
        , FormProps
        , FormState extends FormData
        , FormData
        > (DataComponent: new (props: FormProps & DataProps<FormData>) => T) {

    return (
        class SaveModalInput
                                 extends React.Component<Props<FormProps, FormData>, State<FormData>> {
            constructor(props: Props<FormProps, FormData>) {
                super(props);
            }

            onPress = () => {
                this.props.onSave(this.state.formData);
            }

            render = () => {
                // Extract the onDataChange function, since it must be overwritten.
                const { onDataChange, ...props } = this.props.formProps;

                return (
                    <ModalInput
                        title={this.props.title}
                        animationType={this.props.animationType}
                        screenType={this.props.screenType}
                        value={this.props.renderData(this.state.formData)}
                    >
                        <View style={[Style.modalContainer, Style.whiteBg, localStyle.modalContainer]}>
                            <View style={[Style.maxInputHeight, Style.yellowBg, localStyle.saveContainer]}>
                                <Button 
                                    title="Save"
                                    onPress={this.onPress}
                                >
                                </Button>
                            </View>
                            <View style={[localStyle.children]}>
                                { <DataComponent
                                        onDataChange={(d: Readonly<FormData>) => { 
                                            this.setState({
                                                formData: d
                                            });
                                        }}
                                        { ...props as FormProps & DataProps<FormData> }
                                  /> 
                                }
                            </View>
                        </View>
                    </ModalInput>
                );
            }
        }
    )
}