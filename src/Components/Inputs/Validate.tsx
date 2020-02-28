import React from "react";
import TaskQuery from "src/Models/Task/TaskQuery";
import { Observable } from "rxjs";

interface ComponentProps<Data> {
    success?: boolean;
    failure?: string;
    onDataChange: (d: Data) => void
    onBlur?: () => void;
    data: Data;
}

interface Props<Data> {
    onValidDataChange: (d: Data) => void;
    onInvalidDataChange: (d: Data) => void;
    data: Data
    revalidate?: Observable<boolean>
}

interface State<Data> {
    errorMessage?: string;
}

type FullProps<T, Data> = Props<Data> & Omit<T, keyof ComponentProps<Data>>

/**
 * HOC that generates a new component with the correct logic for doing validation
 * according to the provided functions.
*/
export function Validate<Data, T extends ComponentProps<Data>>(
        Child: new (props: T) => React.Component<T>, 
        validateOnInput: (d: Data) => string | undefined ,
        validateOnBlur: (d: Data) => string | undefined,
    ) {

    return class Validated extends React.Component< FullProps<T, Data>, State<Data>> {

        unsub: () => void;
        constructor(props: FullProps<T, Data>) {
            super(props);
            this.state = {
                errorMessage: validateOnInput(this.props.data)
            };
            this.unsub = () => {};
        }

        componentDidMount = () => {
            const revalidate = this.props.revalidate;
            if(revalidate) {
                let sub = revalidate.subscribe((doRevalidate) => {
                    // If we are told to revalidate, we revalidate, since
                    // something external to this component might have changed.
                    if(doRevalidate) {
                        this.onDataChange(this.props.data)
                    }
                });

                this.unsub = () => {
                    sub.unsubscribe();
                }
            }
        }

        componentWillUnmount = () => {
            this.unsub();
        }
       
        onDataChange = (d: Data) => {
            let message = validateOnInput(d);
            if(message !== undefined) {
                this.props.onInvalidDataChange(d);
                this.setState({
                    errorMessage: message
                })
            } else {
                let message = validateOnBlur(d);
                if( message !== undefined ) {
                    this.props.onInvalidDataChange(d);
                    this.setState({
                        errorMessage: message
                    })
                } else {
                    this.props.onValidDataChange(d);
                    this.setState({
                        errorMessage: undefined
                    })
                }
            }
        }
        
        onBlur = () => {
            const d = this.props.data;
            let message = validateOnInput(d);
            if(message !== undefined) {
                this.props.onInvalidDataChange(d);
                this.setState({
                    errorMessage: message
                })
            } else {
                this.props.onValidDataChange(d);
                this.setState({
                    errorMessage: undefined
                })
            }
        }

        render = () => {
            const { onValidDataChange, data, onInvalidDataChange, ...rest} = this.props;
            return (
                <Child
                    success={this.state.errorMessage === undefined }
                    failure={this.state.errorMessage }
                    data={this.props.data}
                    onDataChange={this.onDataChange}
                    onBlur={this.onBlur}

                    {...rest as any}

                ></Child>
            )
        }
    }
}