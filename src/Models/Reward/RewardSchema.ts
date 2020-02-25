
import { ColumnType } from "@nozbe/watermelondb"

const RewardName = {
    TITLE: 'title',
    DETAILS: 'details',
    EXPIRES_ON: 'expires_at',
    TYPE: 'class_type',
}

const RewardType: Record<keyof typeof RewardName, ColumnType> = {
    TITLE: 'string',
    DETAILS: 'string',
    EXPIRES_ON: 'number',
    TYPE: 'string',
}

const RewardSchema = {
    table: 'rewards',
    name: RewardName,
    type: RewardType,
}

export default RewardSchema;