import MyDate from "src/common/Date";

export function dueDate(d: Date) {
    return new MyDate(d).nextMidnight().subtract(1, "minutes").toDate();
}

export function startDate(d: Date) {
    return new MyDate(d).prevMidnight().toDate();
}