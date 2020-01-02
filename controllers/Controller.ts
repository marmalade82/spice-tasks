

/*  This base class has the default implementation of functions
    for receiving state and forwarding it to any listeners.


    API: 
        subscribe(s: Subscriber). This function takes a subscriber, which
            must have a handle(d: Data) function, and calls the handle function
            whenever the Controller function calls its own "publish" function

        publish(d: Data). This functioin publishes the Data to all 
            subscribers, and lets them handle the function


    Usage.


*/


abstract class Controller<Data> implements ControllerInstance<Data>, Child<Data> {
    subs: Subscriber<Data>[]
    data: Data
    constructor(d: Data) {
        this.subs = [];
        this.data = d
    }

    abstract start(): void

    subscribe = (sub: Subscriber<Data>) => {
        sub.controller = this;
        this.subs.push(sub)

        return () => {
            const index = this.subs.indexOf(sub);
            if(index > -1) {
                this.subs.splice(index, 1);
            }
        };
    }

    commit = (d: Partial<Data>) => {
        this.data = Object.assign(this.data, d);
        this._updateAll(this.data);
    }

    _updateAll = (d: Data) => {
        for(let i = 0; i < this.subs.length; i++) {
            this._update(this.subs[i], d);
        }
    }

    _update = (sub: Subscriber<Data>, d: Data) => {
        sub.setState(d);
    }

    /**
     * Returns a copy of the controller's data at a given moment
    */
    getData: () => Data = () => {
        return Object.assign({}, this.data);
    }
}

interface Child<Data> {
    getData: () => Data
}

interface ControllerInstance<Data> extends Child<Data> {
    subscribe(sub: Subscriber<Data>): () => void
    commit(d: Partial<Data>): void
    start(): void
}

interface Subscriber<Data> {
    controller: ControllerInstance<Data>
    setState: (d: Data) => void;
}


type ChildRegistrar<Data> = (c: Child<Data>) => () => void;


export {
    Controller,
    Subscriber,
    ControllerInstance,
    Child,
    ChildRegistrar,
}