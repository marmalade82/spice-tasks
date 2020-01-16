import { appSchema, tableSchema, ColumnSchema, ColumnType, ColumnName, TableSchema } from '@nozbe/watermelondb';
import GoalSchema from "src/Models/Goal/GoalSchema";
import TaskSchema from 'src/Models/Task/TaskSchema';
import RewardSchema from 'src/Models/Reward/RewardSchema';

const Schema = appSchema({
    version: 2,
    tables: [
        generateTableSchema(GoalSchema),
        generateTableSchema(TaskSchema),
        generateTableSchema(RewardSchema),
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

type CustomSchema<T> =  {
    table: string,
    name: T,
    type: Record<keyof T, ColumnType>,
};

function generateTableSchema<T>(schema: CustomSchema<T>): TableSchema {
    return tableSchema({
        name: schema.table,
        columns: convertToColumns(schema.name, schema.type),
    });
}

export {
    Schema,
}