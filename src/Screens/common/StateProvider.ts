import { EventDispatcher } from "src/common/EventDispatcher";
import { ObjectUnsubscribedError } from "rxjs";


/**
 * Utility types and classes for creating locally shared state that can be passed in to components to 
 * read from and write to without burdening a parent container node with managing each of those values.
*/

export interface IReadLocalState<State> {
    get: <T extends keyof State>(name: T) => State[T];
    getAll: () => State;
    subscribe: <T extends keyof State>(name: T, callback: (value: State[T]) => void) => (() => void);
    unsubscribeAll: () => void;
}


export interface ILocalState<State> extends IReadLocalState<State> {
    pushAll: (values: Partial<State>) => void;
    push: <T extends keyof State>(name: T, value: State[T]) => void;
    get: <T extends keyof State>(name: T) => State[T];
    subscribe: <T extends keyof State>(name: T, callback: (value: State[T]) => void) => (() => void);
    unsubscribeAll: () => void;
}

export class LocalState<State> implements ILocalState<State>{
    state: State;
    dispatcher: EventDispatcher;
    unsubscriptions: (() => void)[]
    constructor(initial: State)  {
        this.state = initial;
        this.dispatcher = new EventDispatcher();
        this.unsubscriptions = [];
    }

    pushAll = (values: Partial<State>) => {
        Object.keys(values).forEach((name) => {
            this.push(name as keyof Partial<State>, values[name])
        })
    }

    push = <T extends keyof State>(name: T, value: State[T]) => {
        this.state[name] = value;
        this.dispatcher.fireEvent(name as string, this.state[name])
    }

    subscribe = <T extends keyof State>(name: T, callback: (value: State[T]) => void) => {
        let unsub = this.dispatcher.addEventListener(name as string, callback);
        this.unsubscriptions.push(unsub);
        this.dispatcher.fireEvent(name as string, this.state[name])
        return unsub;
    }

    unsubscribeAll = () => {
        this.unsubscriptions.forEach((unsub) => {
            unsub();
        })
    }
    
    get = <T extends keyof State>(name: T) => {
        let val = this.state[name]
        return val;
    }

    getAll = () => {
        let obj = Object.assign({}, this.state)
        return obj;
    }
}

export function adapt<State, Target>(state: ILocalState<State>, mapping: Record<keyof Target, keyof State> ): ILocalState<Target> {

    return (function() {
        let unsubscriptions: (() => void)[] = [];
        let obj = {
            pushAll: (values: Partial<Target>) => {
                Object.keys(values).forEach((name) => {
                    obj.push(name as keyof Partial<Target>, values[name])
                })
            },
            push: <T extends keyof Target, V>(name: T, value: V extends ((typeof mapping)[T]) ? any : never) => {
                return state.push(mapping[name], value)
            },
            subscribe: <T extends keyof Target, V>(name: T, callback: (value: V extends ((typeof mapping)[T]) ? any : never) => void) => {
                let unsub = state.subscribe(mapping[name], callback)
                unsubscriptions.push(unsub);

                return unsub;
            },
            unsubscribeAll: () => {
                unsubscriptions.forEach((unsub) => {
                    unsub();
                })
            },
            get: <T extends keyof Target, V>(name: T): Target[T] => {
                let value = state.get(mapping[name])
                return (value as unknown as Target[T])
            },
            getAll: (): Target => {
                let oldState = state.getAll();
                let obj = {};
                Object.keys(mapping).forEach((newKey) => {
                    obj[newKey] = oldState[mapping[newKey]];
                })

                return obj as Target;
            }
        };
        return obj;
    })();

}
