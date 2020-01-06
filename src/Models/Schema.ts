import { appSchema, tableSchema } from '@nozbe/watermelondb';

const Schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'goals',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'starts_at', type: 'number' },
                { name: 'due_at', type: 'number' },
            ],
        }),
    ]
});

export {
    Schema,
}