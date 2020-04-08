
export interface FilterBarProps<Filter, Sorter> {
    showFilterBar: /*undefined |*/ FilterBarProps_<Filter, Sorter>;
}

export interface FilterBarProps_<Filter, Sorter> {
    label?: string;
    withFilters: Filter[];
    withSorters: Sorter[];
}
