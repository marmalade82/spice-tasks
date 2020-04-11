import React from "react";
import { ILocalState, LocalState, IReadLocalState } from "src/Screens/common/StateProvider";
import { string } from "prop-types";
import { View } from "react-native";
import {
    ChoiceInput,
    StringInput,
    createSaveModalInput,
    ModalInput,
    DateTimeInput,
    MultipleInput,
    NumberInput,
    DynamicChoiceInput,
} from "src/Components/Inputs";
import { DateInput } from "../Styled/Styled";
import { LabelValue } from "src/common/types";
import { Observable } from "rxjs";

export type Input = "text" | "multi-text" | "number" | "choice" | "date" | "dynamic-choice"


interface FormProps {
    data: ILocalState<any>  // map from names to values
    validators: any // object of validation functions
    valid: ILocalState<any> // map from names to booleans
    validateOn: any,  // map from names to "input" | "blur" | "both"
    show: ILocalState<any> // map from names to "always" | "never"
}

interface FormState {
    initialValues: any;
}

type ValidateOn = "input" | "blur" | "both";

interface Spec {
    type: Input;
    name: string;
    static_choices: LabelValue[];
    dynamic_choices: Observable<LabelValue[]>;
    placeholder: any;
    emptyType: any;
    onEmptyPress: any;
    validate: string[];
    validateOn: ValidateOn;

}


export function form (name: string, specs: Spec[]) {

    return class Form extends React.Component<FormProps, FormState > {
        constructor(props: FormProps) {
            super(props);

            this.state = {
                initialValues: undefined,
            }
        }

        componentDidMount = () => {
            specs.forEach((spec) => {
                // Really we would like this to force a rerender at some point...lol
                this.props.valid.subscribe(spec.name, (val) => {
                    this.setState(prev => prev); // we want this to be asynchronous (not forceUpdate) in case multiple valid updates come.
                })

                this.props.show.subscribe(spec.name, (val) => {
                    this.setState(prev => prev);
                })

                this.props.data.subscribe(spec.name, (val) => {
                    this.setState(prev => prev);
                })
            })
        }


        confirmInitialValues = (any) => {
            this.state = {
                initialValues: this.props.data.getAll(),
            }
        }

        render = () => {
            return (
                <View
                >
                    {this.renderInputs()}
                </View>
            )
        }

        private renderInputs = () => {
            return specs.map((spec) => {
                switch(spec.type) {
                    case "text": {
                        return (
                            <StringInput
                                placeholder={spec.placeholder}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            ></StringInput>
                        )
                    } break;
                    case "number": {
                        return (
                            <NumberInput
                                {...this.basicInfo(spec)}
                                type={"integer"}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            ></NumberInput>
                        )
                    } break;
                    case "multi-text": {
                        return (
                            <StringInput
                                multiline
                                placeholder={spec.placeholder}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            ></StringInput>
                        )
                    } break;
                    case "date": {
                        return (
                            <DateTimeInput
                                type={"date"}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            >
                            </DateTimeInput>
                        )
                    } break;
                    case "dynamic-choice": {
                        return (
                            <DynamicChoiceInput
                                emptyType={spec.emptyType}
                                onEmptyPress={spec.onEmptyPress}
                                choices={spec.choices}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            ></DynamicChoiceInput>
                        )
                    } break;
                    case "choice": {
                        return (
                            <ChoiceInput
                                {...this.basicInfo(spec)}
                                {...this.validate(spec.name)}
                                {...this.indicators(spec.name)}
                            ></ChoiceInput>
                        )
                    } break;
                    default: {
                        throw new Error("Unsupported or unknown input type: " + JSON.stringify(spec));
                    }

                }
            })
        }

        private validate = (name: any) => {
            return {
                onDataChange: (val: any) => {
                    this.props.data.push(name, val);
                    let mode = this.props.validateOn[name];
                    if(this.state.initialValues !== undefined && (mode === "input" || mode === "both")) {
                        const validator = this.props.validators[name];
                        const result = validator(val, val === this.state.initialValues[name]);

                        switch(result[0]) {
                            case "ok": {
                                this.props.valid.push(name, result);
                            } break;
                            case "warning": {
                                this.props.valid.push(name, result);
                            } break;
                            case "error": {
                                this.props.valid.push(name, result);
                            } break;
                            default: {
                                throw new Error("validation provided unknown result: " + result.toString())
                            }
                        }
                    }

                },
                onBlur: () => {
                    let val = this.props.data.get(name);
                    let mode = this.props.validateOn[name];
                    if(this.state.initialValues !== undefined && (mode === "blur" || mode === "both")) {
                        const validator = this.props.validators[name];
                        const result = validator(val, val === this.state.initialValues[name])

                        switch(result[0]) {
                            case "ok": {
                                this.props.valid.push(name, result);
                            } break;
                            case "warning": {
                                this.props.valid.push(name, result);
                            } break;
                            case "error": {
                                this.props.valid.push(name, result);
                            } break;
                            default: {
                                throw new Error("validation provided unknown result: " + result.toString())
                            }
                        }
                    }
                }
            }
        }

        private indicators = (name: any) => {
            let result = this.props.valid.get(name);
            return {
                success: result[0] === "ok" ? result[1] : undefined,
                failure: result[0] === "error" ? result[1] : undefined,
            }
        }

        private basicInfo = (spec: any) => {
            return {
                title: spec.label,
                accessibilityLabel: name + "-" + spec.name,
                data: this.props.data.get(spec.name),
            }
        }
    }

}

