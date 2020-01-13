
import { ColumnType } from "@nozbe/watermelondb"

interface ChildName {
    PARENT: 'parent_id';
}

interface ChildType {
    PARENT: string;
}


export interface ChildSchema {
    name: ChildName,
    type: ChildType,
}

export interface Schema<T extends ChildName, Table extends string> {
    name: T,
    type: Record<keyof T, ColumnType>,
    table: Table,
}