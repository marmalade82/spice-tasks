

import React from "react";

interface DataProps<Data> {
    data: Data | false;
    onDataChange: (d: Readonly<Data>) => void;
}

/** Classes that extend this component are responsible for containing data. They may manage it internally with state,
 *  but they must expose their data to be observed or managed by wrapper components.
 * 
 *  onDataChange must be provided - the parent must decide what to do with the data that changes.
 *  data is an optional prop. Providing it means that the parent is going to be the source of the data for the component,
 *      as an answer to the question of State Management.
*/
export default abstract class DataComponent<Props, State extends Data, Data> 
                                            extends React.Component<Props & DataProps<Data>, State> {
    constructor(props: Props & DataProps<Data>) {
        super(props);
    }

    data = (): Data => {
        if(this.props.data !== undefined) {
            return this.props.data as Data;
        }

        return this.state;
    }
    
    reviseState = <K extends keyof Data>(p: Pick<State, K>, data: Data) => {
        let newData = Object.assign({}, data) as Data;
        Object.assign(newData, p) as Data;

        return newData;
    }

    reviseData = <K extends keyof Data>(p: Pick<Data, K>) => {
        let newData = Object.assign({}, this.props.data) as Data;
        Object.assign(newData, p) as Data;

        return newData;
    }

    setData = <K extends keyof Data>(d: Pick<State, K>) => {
        this.setState(d);
        if(!this.props.data) {
            this.props.onDataChange(this.reviseState(d, this.state));
        } else {
            this.props.onDataChange(this.reviseData(d));
        }

    }
}

export {
    DataComponent,
    DataProps,
}