
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const GlobalName = {
    CURRENT: "current_at",
    COUNT: "count",
    LAST_NOTIFIED: "last_notified_at",
} as const;

const GlobalType = {
    CURRENT: "number",
    COUNT: "number",
    LAST_NOTIFIED: "number",
} as const;


export const GlobalSchema: Schema<typeof GlobalName> = {
    name: GlobalName,
    type: GlobalType,
    table: "global",
}