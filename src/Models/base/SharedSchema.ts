
import { ColumnType } from "@nozbe/watermelondb"

interface ChildName {
    PARENT: 'parent_id';
}

interface ChildType {
    PARENT: 'string';
}


export interface ChildSchema {
    name: ChildName,
    type: ChildType,
}

export interface Schema<S> {
    name: S,
    type: Record<keyof S, ColumnType>,
    table: string,
}

interface ActiveName {
    ACTIVE: 'is_active';
}

interface ActiveType {
    ACTIVE: 'boolean';
}

export interface ActiveSchema {
    name: ActiveName,
    type: ActiveType,
}

interface StateName {
    STATE: 'state'
}

interface StateType {
    STATE: 'string'
}

export interface StateSchema {
    name: StateName,
    type: StateType,
}