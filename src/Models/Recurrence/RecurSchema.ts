
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const RecurName = {
    TYPE: "recur_type",
    DATE: "date",
    TIME: "time",
    WEEK_DAY: "week_day",
    MONTH_DAY: "month_day",
} as const;

const RecurType = {
    TYPE: "string",
    DATE: "number",
    TIME: "number",
    WEEK_DAY: "string",
    MONTH_DAY: "number",
} as const;


export const RecurSchema: Schema<typeof RecurName> = {
    name: RecurName,
    type: RecurType,
    table: "recurrences",
}