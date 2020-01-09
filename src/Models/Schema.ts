import { appSchema, tableSchema, ColumnSchema, ColumnType, ColumnName } from '@nozbe/watermelondb';
import GoalSchema from "src/Models/Goal/GoalSchema";

const Schema = appSchema({
    version: 9,
    tables: [
        tableSchema({
            name: GoalSchema.table,
            columns: convertToColumns(GoalSchema.name, GoalSchema.type)
        }),
    ]
});

function column(name: ColumnName, type: ColumnType ): ColumnSchema {
    return {
        name: name,
        type: type,
    };
}

function convertToColumns<T>(names: T, types: Record<keyof T, ColumnType> ) {
    const columns = Object.keys(types).map((prop) => {
        return (
            column(names[prop], types[prop])
        );
    });
    return columns;
}

export {
    Schema,
}