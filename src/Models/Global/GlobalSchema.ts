
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const GlobalName = {
    CURRENT: "current_at",
    COUNT: "count",
} as const;

const GlobalType = {
    CURRENT: "number",
    COUNT: "number",
} as const;


export const GlobalSchema: Schema<typeof GlobalName> = {
    name: GlobalName,
    type: GlobalType,
    table: "global",
}