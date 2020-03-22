

import React from "react";
import { assignAll } from "src/common/types";

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
        if(this.props.data) {
            return this.props.data as Data;
        }

        return this.state;
    }
    
    reviseState = <K extends keyof Data>(p: Pick<State, K>, data: Data) => {
        let newData = assignAll([], {}, data) as Data;
        assignAll([], newData, p) as Data;

        return newData;
    }

    reviseData = <K extends keyof Data>(p: Pick<Data, K>) => {
        let newData = assignAll([], {}, this.props.data) as Data;
        assignAll([], newData, p) as Data;

        return newData;
    }

    setData = <K extends keyof Data>(d: Pick<State, K>) => {
        if(!this.props.data) {
            this.props.onDataChange(this.reviseState(d, this.state));
        } else {
            this.props.onDataChange(this.reviseData(d));
        }
        this.setState(d);
    }
}

type DataFn<S, P, D> = <K extends keyof D>(s: S, p: P & DataProps<D>) => Pick<D, K>;

export {
    DataComponent,
    DataProps,
}