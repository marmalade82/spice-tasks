
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const RecurName = {
    TYPE: "recur_type",
    DATE: "date_at",
    TIME: "time_at",
    WEEK_DAY: "week_day",
    MONTH_DAY: "month_day",
    ACTIVE: 'is_active',
} as const;

const RecurType = {
    TYPE: "string",
    DATE: "number",
    TIME: "number",
    WEEK_DAY: "string",
    MONTH_DAY: "number",
    ACTIVE: "boolean",
} as const;


export const RecurSchema: ActiveSchema & Schema<typeof RecurName> = {
    name: RecurName,
    type: RecurType,
    table: "recurrences",
}