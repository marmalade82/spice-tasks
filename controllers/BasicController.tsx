import { Controller } from "./Controller";

interface State {
    name: string;
    favorite_drink: string;
}

class BasicController<State> extends Controller<State> {
    constructor(d: State) {
        super(d);
    }

    /**
     *  NEXT QUESTION TO SOLVE IS HOW TO GET PARENT CONTROLLERS TO 
     *  SEE CHILD CONTROLLERS, and GET CHILD CONTROLLER DATA.
     * 
     *  because really, components don't get care about state. They only
     *  care about showing data.
     * 
     *  in the parent component, say of a Form with Five <TextInput>,
     *  how do you allow the parent to successfully know about the states
     *  of the five TextInputs? The parent COMPONENT doesn't need to know 
     *  about the Child states, but the parent CONTROLLER does -- at certain
     *  points, the parent controller will need to ask the children for 
     *  their states in order to DO a particular thing.
     */
}

export {
    BasicController,
    State,
}