
import { IMapper } from "src/Models/base/Mapper";

interface IModel<State> {
    get: <T extends keyof State>(field: T, index: number) => State[T]
}


type RefArray<S> = [string | S];

/**
 * A model captures and exposes some state, abstracting over the database and the existence of tables
 */
export default abstract class Model<State> {

    /**
     * cachedState represents the caching of any values within the model. If the value isn't present, the value will have to be fetched from the database.
     */
    cachedState: Partial<State> 
    mapper: IMapper<State>

    constructor(mapper: IMapper<State>){
        this.cachedState = {}
        this.mapper = mapper;
    }

    /**
     * get attempts to fetch the direct value of some field in the state. The type signature prevents fetching of reference list fields.
     */
    get = <K extends keyof State, P extends Exclude<State[K], RefArray<S>>, S>(field: P, index?: number) => {
        if(this.cachedState[field] !== undefined) {
            const value = this.mapper.fetch([field], "");
            if(value !== null) {
                this.cachedState[field] = value;
                return this.cachedState[field];
            } else {
                return this.default()[field];
            }
        } else {
            // If the field is defined and the field is not a RefArray, then we can go ahead and return the value
        }

    }

    /**
     * Specifies default values to return if the database lookups fail
     */
    abstract default: () => State

}

export {
    IModel,
    Model,
}