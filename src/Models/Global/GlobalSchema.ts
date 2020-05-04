
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"

const GlobalName = {
    CURRENT: "current_at",
    COUNT: "count",
    LAST_NOTIFIED: "last_notified_at",
    PRIMARY_COLOR: 'primary_color',
    PRIMARY_LIGHT_COLOR: 'primarylight_color',
    SECONDARY_COLOR: 'secondary_color',
} as const;

const GlobalType = {
    CURRENT: "number",
    COUNT: "number",
    LAST_NOTIFIED: "number",
    PRIMARY_COLOR: 'string',
    PRIMARY_LIGHT_COLOR: 'string',
    SECONDARY_COLOR: 'string',
} as const;


export const GlobalSchema: Schema<typeof GlobalName> = {
    name: GlobalName,
    type: GlobalType,
    table: "global",
}