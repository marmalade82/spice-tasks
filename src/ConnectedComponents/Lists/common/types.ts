import { IReadLocalState, LocalState } from "src/Screens/common/StateProvider";

export interface FilterBarProps<Filter, Sorter> {
    showFilterBar: /*undefined |*/ FilterBarProps_<Filter, Sorter>;
}

export interface FilterBarProps_<Filter, Sorter> {
    label?: string;
    withFilters: Filter[];
    withSorters: Sorter[];
}

export function getProviderData<Data, T extends keyof Data>(provider: undefined | IReadLocalState<Data>, name: T, fallback: Data[T]): Data[T] {
    if(provider === undefined) {
        return fallback;
    }

    const data = provider.get(name);
    return data;
}

export type Range = [Date, Date] | undefined
export type Direction = "up" | "down";

export type FilterData<Filters, Sorters> = {
    filter: Filters,
    sorter: Sorters,
    range: Range;
    direction: Direction;
}

export function makeFilterState<Filters, Sorters>(filter: Filters, sorter: Sorters, range: Range, direction: Direction) {
    return new LocalState({
        filter,
        sorter,
        range,
        direction
    }) as LocalState<FilterData<Filters, Sorters>>;
}

export function compare<T extends Date | string | number>(a: T, b: T, direction: "up" | "down") {
    let multiplier: number = 1
    switch(direction) {
        case "up": {
            multiplier = 1;
        } break;
        case "down": {
            multiplier = -1;
        }
    }

    if(a instanceof Date) {
        return multiplier * ((a as Date).valueOf() - (b as Date).valueOf());
    }

    if(typeof a === "string") {
        let diff = 0
        if(a < b) {
            diff = -1
        } else if (a > b) {
            diff = 1
        } else {
            diff = 0;
        }
        return multiplier * diff;
    }

    if(typeof a === "number") {
        return multiplier * ((a as number) - (b as number));
    }

    throw new Error("sort used on unsupported args")
}