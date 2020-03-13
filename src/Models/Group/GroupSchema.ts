
import { ChildSchema, StateSchema, DueSchema, ActiveSchema, Schema, ProcessedSchema } from "src/Models/base/SharedSchema"

const GroupName = {
    TYPE: "type",
    PARENT: "parent_id",
    PARENT_TABLE: "parent_table",
    STARTS_ON: "starts_at",
    DUE_ON: "due_at",
} as const;

const GroupType = {
    TYPE: "string",
    PARENT: "string",
    PARENT_TABLE: "string",
    STARTS_ON: "number",
    DUE_ON: "number",
} as const;

export const GroupSchema: DueSchema & ChildSchema & Schema<typeof GroupName> = {
    name: GroupName,
    type: GroupType,
    table: "my_group",
}