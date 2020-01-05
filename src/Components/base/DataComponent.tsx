

import React from "react";

interface DataProps<Data> {
    data?: Data
    onDataChange: (d: Data) => void;
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

    
    reviseState = <K extends keyof Data>(p: Pick<State, K>) => {
        let state = Object.assign({}, this.state) as Data;
        Object.assign(state, p) as Data;

        return state;
    }

    setData = <K extends keyof Data>(d: Pick<State, K>) => {
        if(this.props.data === undefined) {
            this.setState(d);
        }

        this.props.onDataChange(this.reviseState(d));
    }
}