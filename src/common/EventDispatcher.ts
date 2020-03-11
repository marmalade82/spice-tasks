import { Observable } from "rxjs";


export interface IEventDispatcher {
    addEventListener: (s: string, handler: Handler) => void;
    removeEventListener: (s: string, handler: Handler) => void;
    fireEvent: (s: string, payload?: any) => void;
}

interface Dispatcher {
    [key: string]: Handlers | undefined;
}

type Handlers = Handler[];
type Handler = (payload?: any) => void


export class EventDispatcher implements IEventDispatcher {
    handlers: Dispatcher;
    constructor() {
        this.handlers = {};
    }

    addEventListener = (s: string, handler: Handler) => {
        let handlers = this.handlers[s];
        if(handlers) {
            handlers.push(handler);
            this.handlers[s] = handlers;
        } else {
            this.handlers[s] = [handler]
        }
    }

    removeEventListener = (s: string, remove: Handler) => {
        const handlers = this.handlers[s];
        if(handlers) {
            const temp = handlers.filter((handler) => {
                return handler !== remove;
            });
            if(temp.length === 0) {
                this.handlers[s] = undefined;
            } else {
                this.handlers[s] = temp;
            }
        }
    }

    fireEvent = (s: string, payload?: any) => {
        const handlers = this.handlers[s];
        if(handlers) {
            handlers.forEach((handler) => {
                setTimeout(() => handler(payload));
            })
        } else {

        }
    }
}

export function fromEvent(dispatcher: IEventDispatcher, event: string): Observable<any> {

    return new Observable<any>((subscriber) => {
        dispatcher.addEventListener(event, (payload) => {
            subscriber.next(payload);
        })
    })
}
