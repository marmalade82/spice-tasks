import MyDate from "src/common/Date";

export function dueDate(d: Date) {
    return new MyDate(d).asDueDate().toDate();
}

export function startDate(d: Date) {
    return new MyDate(d).asStartDate().toDate();
}