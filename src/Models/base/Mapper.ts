
interface IMapper<State> {
    /**
     * This function is responsible for fetching the field from the database. Returns "success" | null on success/failure
     * Maintaining a unique ID as a string is a brilliant way to make all fetch requests generic
     */
    fetch: <T extends keyof State>(field: T[], id: string) => State[T] | null

}

export default abstract class Mapper<State> implements IMapper<State> {
    abstract fetch: <T extends keyof State>(field: T[], id: string) => State[T] | null
}

export {
    IMapper,
    Mapper,
}