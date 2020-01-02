
import React from "react";
import { 
    ControllerInstance,
    Child,
    ChildRegistrar,
} from "../controllers/Controller";


interface Props<Data> {
    // takes a function that allows a parent to register the child controller
    registerChild: ChildRegistrar<Data>
    initialData: Data;
}

/**
 * This component is forced to have the controller property
 */
class ControlledComponent<S extends Data, P = {}, Data = {}> extends React.Component<P & Props<Data>, Data> {
    controller: ControllerInstance<Data>;
    unsubscribeController: () => void = () => {};
    unregisterFromParent: () => void = () => {};
    factory: (data: Data) => ControllerInstance<Data>;
    constructor(props: P & Props<Data>, 
                factory: (data: Data) => ControllerInstance<Data>) {
        super(props);
        this.controller = factory(this.props.initialData);
        this.factory = factory;
    }

    componentDidMount = () => {
        this.controller = this.factory(this.props.initialData);
        this.unsubscribeController = this.controller.subscribe(this);
        this.unregisterFromParent = this.props.registerChild(this.controller);
        this.controller.start(); // starts any ongoing subscriptions or calls in the controller 
    }

    componentDidUnmount = () => {
        this.unsubscribeController();
        this.unregisterFromParent();
    }

}

export {
    ControlledComponent,
    Child,
    ChildRegistrar,
}