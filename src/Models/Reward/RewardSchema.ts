
import { ColumnType } from "@nozbe/watermelondb"

const RewardName = {
    TITLE: 'title',
    DETAILS: 'details',
    EXPIRES_ON: 'expires_at',
}

const RewardType: Record<keyof typeof RewardName, ColumnType> = {
    TITLE: 'string',
    DETAILS: 'string',
    EXPIRES_ON: 'number',
}

const RewardSchema = {
    table: 'rewards',
    name: RewardName,
    type: RewardType,
}

export default RewardSchema;