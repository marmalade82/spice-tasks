import { EventDispatcher } from "src/common/EventDispatcher";


/**
 * Utility types and classes for creating locally shared state that can be passed in to components to 
 * read from and write to without burdening a parent container node with managing each of those values.
*/

export interface ILocalState<State> {
    push: <T extends keyof State>(name: T, value: State[T]) => void;
    subscribe: <T extends keyof State>(name: T, callback: (value: State[T]) => void) => void;
}

export class LocalState<State> implements ILocalState<State>{
    state: State;
    dispatcher: EventDispatcher;
    constructor(initial: State)  {
        this.state = initial;
        this.dispatcher = new EventDispatcher();
    }

    push = <T extends keyof State>(name: T, value: State[T]) => {
        this.state[name] = value;
        this.dispatcher.fireEvent("name", this.state[name])
    }

    subscribe = <T extends keyof State>(name: T, callback: (value: State[T]) => void) => {
        this.dispatcher.addEventListener(name as string, callback);
        this.dispatcher.fireEvent("name", this.state[name])
    }
}

export function adapt<State, Target>(state: ILocalState<State>, mapping: Record<keyof Target, keyof State> ): ILocalState<Target> {
    let obj: ILocalState<Target> = {
        push: <T extends keyof Target, V>(name: T, value: V extends ((typeof mapping)[T]) ? any : never) => {
            return state.push(mapping[name], value)
        },
        subscribe: <T extends keyof Target, V>(name: T, callback: (value: V extends ((typeof mapping)[T]) ? any : never) => void) => {
            return state.subscribe(mapping[name], callback)
        }
    };

    return obj;
}
