
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const TimeName = {
    CURRENT: "current_at",
    COUNT: "count",
} as const;

const TimeType = {
    CURRENT: "number",
    COUNT: "number",
} as const;


export const TimeSchema: Schema<typeof TimeName> = {
    name: TimeName,
    type: TimeType,
    table: "timing",
}