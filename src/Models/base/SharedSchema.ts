
import { ColumnType } from "@nozbe/watermelondb"

interface ChildName {
    PARENT: 'parent_id';
    PARENT_TABLE: 'parent_table';
}

interface ChildType {
    PARENT: 'string';
    PARENT_TABLE: 'string';
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

interface ProcessedName {
    LAST_REFRESHED: "last_refreshed_at",
}

interface ProcessedType {
    LAST_REFRESHED: "number",
}

export interface ProcessedSchema {
    name: ProcessedName,
    type: ProcessedType,
}

interface DueName {
    STARTS_ON: "starts_at"
    DUE_ON: "due_at"
}

interface DueType {
    STARTS_ON: "number",
    DUE_ON: "number",
}

export interface DueSchema {
    name: DueName,
    type: DueType,
}