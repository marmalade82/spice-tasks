import React from "react";

interface ComponentProps<Data> {
    success: string | false;
    failure: string | false;
    onDataChange: (d: Data) => void
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

export function Validate<Data>(
        Child: new (props: ComponentProps<Data>) => React.Component<ComponentProps<Data>>, 
        validator: (d: Data) => boolean ,
        validMessage: (d: Data) => string,
        invalidMessage: (d: Data) => string,
    ) {

    return class Validated extends React.Component<Props<Data>, State<Data>> {
        constructor(props: Props<Data>) {
            super(props);
            this.state = {
                validated: validator(this.props.data)
            };
        }
       
        onDataChange = (d: Data) => {
            if(validator(d)) {
                this.props.onValidDataChange(d);
            } else {
                this.props.onInvalidDataChange(d);
            }
        }

        render = () => {
            return (
                <Child
                    success={this.state.validated ? validMessage(this.props.data) : false}
                    failure={!this.state.validated ? invalidMessage(this.props.data) : false}
                    data={this.props.data}
                    onDataChange={this.onDataChange}
                ></Child>
            )
        }
    }
}