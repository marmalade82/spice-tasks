import React from "react";
import TaskQuery from "src/Models/Task/TaskQuery";

interface ComponentProps<Data> {
    success?: string;
    failure?: string;
    onDataChange: (d: Data) => void
    onBlur?: () => void;
    data: Data;
}

interface Props<Data> {
    onValidDataChange: (d: Data) => void;
    onInvalidDataChange: (d: Data) => void;
    data: Data
}

interface State<Data> {
    validated: boolean;
}

type FullProps<T, Data> = Props<Data> & Omit<T, keyof ComponentProps<Data>>

export function Validate<Data, T extends ComponentProps<Data>>(
        Child: new (props: T) => React.Component<T>, 
        validateOnInput: (d: Data) => boolean ,
        validateOnBlur: (d: Data) => boolean,
        validMessage: (d: Data) => string,
        invalidMessage: (d: Data) => string,
    ) {

    return class Validated extends React.Component< FullProps<T, Data>, State<Data>> {
        constructor(props: FullProps<T, Data>) {
            super(props);
            this.state = {
                validated: validateOnInput(this.props.data)
            };
        }
       
        onDataChange = (d: Data) => {
            if(!validateOnInput(d)) {
                this.props.onInvalidDataChange(d);
                this.setState({
                    validated: false
                })
            } else {
                if(!validateOnBlur(d)) {
                    this.props.onInvalidDataChange(d);
                } else {
                    this.props.onValidDataChange(d);
                    this.setState({
                        validated: true
                    })
                }
            }
        }
        
        onBlur = () => {
            const d = this.props.data;
            if(validateOnBlur(d)) {
                this.props.onValidDataChange(d);
                this.setState({
                    validated: true
                })
            } else {
                this.props.onInvalidDataChange(d);
                this.setState({
                    validated: false
                })
            }
        }

        render = () => {
            const { onValidDataChange, data, onInvalidDataChange, ...rest} = this.props;
            return (
                <Child
                    success={this.state.validated ? validMessage(this.props.data) : undefined}
                    failure={!this.state.validated ? invalidMessage(this.props.data) : undefined}
                    data={this.props.data}
                    onDataChange={this.onDataChange}

                    {...rest as any}

                    onBlur={this.onBlur}
                ></Child>
            )
        }
    }
}