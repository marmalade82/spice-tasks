
import { ColumnType } from "@nozbe/watermelondb"
import { Schema } from "src/Models/base/SharedSchema";

const PenaltyName = {
    TITLE: 'title',
    DETAILS: 'details',
    EXPIRES_ON: 'expires_at',
} as const;

const PenaltyType = {
    TITLE: "string",
    DETAILS: "string",
    EXPIRES_ON: "number",
} as const;

const PenaltySchema : Schema<typeof PenaltyName> = {
    name: PenaltyName,
    type: PenaltyType,
    table: "penalties",
}

export {
    PenaltySchema,
}