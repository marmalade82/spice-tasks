
enum RecurType {
    Once = 0,
    Daily,
    Weekly,
    Monthly,
}

enum DayOfWeek {
    Sunday = 0,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

interface Recurrence {
    recur_type: RecurType
    last_date: Date
    days_of_week: DayOfWeek[]
    days_of_month: number[]
}

function nextDate(recur: Recurrence): Date {
    return new Date();
}

export {
    RecurType as Type,
    DayOfWeek,
    Recurrence,
    nextDate,
}