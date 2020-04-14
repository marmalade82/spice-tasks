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

export type Valid = ["ok", string] | ["warning", string] | ["error", string];

export type Show = "always" | "never";


interface FormProps {
    data: ILocalState<any>  // map from names to values
    validators: any // object of validation functions
    valid: ILocalState<any> // map from names to booleans
    show: ILocalState<any> // map from names to "always" | "never"
    choices: IReadLocalState<any>
}

interface FormState {
    initialValues: any;
}

interface Spec {
    type: Input;
    name: string;
    label: string;
    placeholder: any;
    emptyType: any;
    onEmptyPress: any;
    required: boolean;
    validate: string[];
}


export function makeForm (name: string, specs: Spec[]) {
    let validators = makeValidatorState(specs);
    let show = makeShowState(specs);
    let data = makeDataState(specs);
    let valid = makeValidState(specs);
    let choices = makeChoiceState(specs);

    const component = class Form extends React.Component<FormProps, FormState > {
        constructor(props: FormProps) {
            super(props);

            this.state = {
                initialValues: undefined,
            }

            specs.forEach((spec) => {
                this.state[spec.name] = this.props.data.get(spec.name);
            })
        }

        componentDidMount = () => {
            specs.forEach((spec) => {
                // Really we would like this to force a rerender at some point...lol
                this.props.valid.subscribe(spec.name, (val) => {
                    this.setState((prev) => {
                        return {
                            initialValues: prev.initialValues,
                            [spec.name]: val,
                        }
                    }); // we want this to be asynchronous (not forceUpdate) in case multiple valid updates come.
                })

                this.props.show.subscribe(spec.name, (val) => {
                    this.setState(prev => prev);
                })

                this.props.data.subscribe(spec.name, (val) => {
                    this.setState(prev => prev);
                })

                if(this.props.choices) {
                    this.props.choices.subscribe((spec.name), (val) => {
                        this.setState(prev => prev);
                    })
                }
            })
        }


        confirmInitialValues = async (any) => {
            // This is confirmed asynchronously for safety.
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
                                {...this.validate(spec)}
                                {...this.indicators(spec.name)}
                            ></StringInput>
                        )
                    } break;
                    case "number": {
                        return (
                            <NumberInput
                                {...this.basicInfo(spec)}
                                type={"integer"}
                                {...this.validate(spec)}
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
                                {...this.validate(spec)}
                                {...this.indicators(spec.name)}
                            ></StringInput>
                        )
                    } break;
                    case "date": {
                        return (
                            <DateTimeInput
                                type={"date"}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec)}
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
                                choices={this.props.choices ? this.props.choices.get(spec.name) : []}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec)}
                                {...this.indicators(spec.name)}
                            ></DynamicChoiceInput>
                        )
                    } break;
                    case "choice": {
                        return (
                            <ChoiceInput
                                choices={this.props.choices ? this.props.choices.get(spec.name): []}
                                {...this.basicInfo(spec)}
                                {...this.validate(spec)}
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

        private validate = (spec: Spec) => {
            const name = spec.name;
            return {
                onDataChange: (val: any) => {
                    this.props.data.push(name, val);
                    this.setState((prev) => {
                        return {
                            initialValues: prev.initialValues,
                            [name]: val,
                        }
                    })
                    let validators = spec.validateOnInput;
                    if(this.state.initialValues !== undefined) {
                        validators.forEach((v) => {
                            const validator = this.props.validators[v];
                            const result = validator(val, val === this.state.initialValues[name]);

                            /** We don't need these lines...? The caller should do this push, when it has time to get to it, since
                             * the validation might even be asynchronous*/
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
                        })

                    }

                },
                onBlur: () => {
                    let val = this.props.data.get(name);
                    let validators = spec.validateOnBlur;
                    if(this.state.initialValues !== undefined ) {
                        validators.forEach((v) => {
                            const validator = this.props.validators[v];
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
                        })
                    }
                }
            }
        }

        private indicators = (name: any) => {
            let result = this.props.valid.get(name);
            return {
                success: result[0] === "ok" ? true : undefined,
                failure: result[0] === "error" ? result[1] as string : undefined,
            }
        }

        private basicInfo = (spec: any) => {
            return {
                title: spec.label,
                accessibilityLabel: name + "-" + spec.name,
                data: this.state[spec.name],
            }
        }
    }

}



function makeValidatorState(specs: Spec[]) {
    //initialize all validator, besides "required", to do nothing. The caller will decide the validation functions.
    let state = new LocalState({} as Record<string, (value: any, dirty: boolean, label: string) => Valid> );
    let validators = specs.reduce((acc: string[], spec: Spec) => {
        return acc.concat(spec.validate);
    }, [])

    validators.forEach((validator) => {
        state.push(validator, (value: any, dirty: boolean, label: string) => {
            return ["ok", ""];
        })
    })

    state.push("required", (value: any, dirty: boolean, label: string) => {
        if(typeof value === "string") {
            return required(value.length > 0, label);
        }

        if(typeof value === "number") {
            return required( !isNaN(value), label)
        }

        if(value instanceof Date) {
            return required( !isNaN(value.valueOf()), label );
        }

        return ["error", "Unsupported data type"];
    });

    return state;

    function required(valid: boolean, label: string): Valid {
        return valid ? ["ok", ""] : ["error", label + " is required"];
    }
}

function makeShowState(specs: Spec[]) {
    // by default, we show all fields
    let state = new LocalState({} as Record<string, Show>);
    specs.forEach((spec) => {
        state.push(spec.name, "always");
    })
}

function makeDataState(specs: Spec[]) {
    let state = new LocalState({} as Record<string, any>);
    //we default all fields by the input type
    specs.forEach((spec) => {
        let val: any;
        switch(spec.type) {
            case "choice": {
                val = "";
            } break;
            case "date": {
                val = new Date(NaN);
            } break;
            case "dynamic-choice": {
                val = "";
            } break;
            case "multi-text": {
                val = "";
            } break;
            case "number": {
                val = NaN;
            } break;
            case "text": {
                val = "";
            }
        }

        state.push(spec.name, val);
    })

    return state;
}

function makeValidState(specs: Spec[]) {
    let state = new LocalState({} as Record<string, Valid>)
    specs.forEach((spec) => {
        state.push(spec.name, ["ok", ""]);
    })
    return state;
}

function makeChoiceState(specs: Spec[]) {
    let state = new LocalState({} as Record<string, LabelValue[]>);
    specs.forEach((spec) => {
        state.push(spec.name, []);
    })

    return state;
}