
import moment from "moment";
import { Moment } from "moment";
import { TouchableHighlightBase } from "react-native";
import { dueDate } from "src/Components/Forms/common/utils";


type timeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";

export default class MyDate {
    m: Moment;
    constructor(date: Date) {
        this.m = moment(date);
    }

    static Zero = () => {
        return new MyDate(new Date())
    }

    private static NowMoment: undefined | MyDate = undefined;

    static TEST_ONLY_SetNow = (date: MyDate) => {
        MyDate.NowMoment = new MyDate(date.toDate());
    }

    static TEST_ONLY_NowAdd = (n: number, timeUnit: timeUnit) => {
        MyDate.NowMoment = MyDate.Now().add(n, timeUnit);
    }

    static TEST_ONLY_NowSubtract = (n: number, timeUnit: timeUnit) => {
        MyDate.NowMoment = MyDate.Now().subtract(n, timeUnit);
    }

    static Now = () => {
        if(MyDate.NowMoment === undefined) {
            return new MyDate(new Date(Date.now()));
        } else {
            return new MyDate(MyDate.NowMoment.toDate());
        }
    }

    static WithinInclusive = (start: Date, end: Date, actual: Date) => {
        return start <= actual && actual <= end
    }

    static YBeforeX = (start: Date, actual: Date) => {
        return actual < start;
    }

    static YAfterX = (due: Date, actual: Date) => {
        return actual > due;
    }

    asStartDate = () => {
        this.prevMidnight();
        return this;
    }

    asDueDate = () => {
        this.nextMidnight().subtract(1, "minutes");
        return this;
    }

    timeToNow = () => {
        return this.m.to(MyDate.Now().toDate());
    }

    clone = () => {
        return new MyDate(this.toDate());
    }

    assertEquals = (other: MyDate, tag: string) => {
        if (Math.abs(this.diff(other.toDate(), "minutes")) <= 1) {
            return true;
        } else {
            throw new Error("Unequal " + tag + "~\nthis: " + this.toDate().toString() + "\nexpected: " + other.toDate().toString())
        }
    }

    equals = (other: MyDate) => {
        return Math.abs(this.diff(other.toDate(), "minutes")) <= 1
    }

    timeFromNow = () => {
        return this.m.from(MyDate.Now().toDate());
    }

    format = (format: string) => {
        return this.m.format(format);
    }

    subtract = (n: number, val: timeUnit): this => {
        this.m = this.m.subtract(n, val);

        return this;
    }

    sameDayAs = (other: MyDate) => {
        return this.clone().prevMidnight().equals(other.clone().prevMidnight());
    }

    add = (n: number, val: timeUnit): this => {
        this.m = this.m.add(n, val);

        return this;
    }

    isSomeTimeToday = () => {
        const start = MyDate.Now().prevMidnight().toDate();
        const end = MyDate.Now().nextMidnight().toDate();
        return this.m.isSameOrAfter(start) && this.m.isBefore(end);
    }

    toDate = (): Date => {
        return this.m.toDate();
    }

    setTime = (d: MyDate) => {
        this.m = this.m.set({
            'hours': d.hours(),
            'minutes': d.minutes(),
            'seconds': d.seconds(),
        })

        return this;
    }

    setDay = (d: string) => {
        this.m = this.m.day(d);
        return this;
    }

    setDayOfMonth = (n : number) => {
        if(n > this.m.daysInMonth()) {
            this.m.date(this.m.daysInMonth())
        } else if (n < 1) {
            this.m.date(1);
        } else {
            this.m.date(n);
        }
        return this;
    }

    set = (n: number, unit: timeUnit) => {
        this.m.set(unit, n)
        return this;
    }

    minutes = () => {
        return this.m.minutes();
    }

    hours = () => {
        return this.m.hours();
    }

    seconds = () => {
        return this.m.seconds();
    }

    dayName = () => {
        return this.m.format("dddd").toLowerCase();
    }

    nextMidnight = (): this => {
        this.m = this.m.endOf('day');

        return this;
    }

    prevMidnight = (): this => {
        this.m = this.m.startOf('day');

        return this;
    }

    nextCycleStart = (type: "daily" | "weekly" | "monthly", 
            input: TimeCycle<typeof type>) => {
        switch(type) {
            case "daily": {
                // if daily, then the next cycle is the most recent occurrence of the time.
                let oldTime = new MyDate(input as TimeCycle<typeof type>);
                let nextCycleDate = MyDate.Now().setTime(oldTime);
                if(nextCycleDate.isTodayInPast()) {
                   nextCycleDate.add(1, "days");
                }
                this.m = moment(nextCycleDate.toDate());
            } break;
            case "weekly": {
                let nextCycleDate = MyDate.Now().setDay(input as TimeCycle<typeof type>).prevMidnight();
                if (nextCycleDate.isWithinWeekInPast()) {
                    nextCycleDate.add(1, "weeks")
                }
                this.m = moment(nextCycleDate.toDate())
            } break;
            case "monthly": {
                let nextCycleDate = MyDate.Now().setDayOfMonth(input as TimeCycle<typeof type>).prevMidnight();
                if (nextCycleDate.isWithinMonthInPast()) {
                    nextCycleDate.add(1, "months")
                }
                this.m = moment(nextCycleDate.toDate())
            } break;
        }
        return this;
    }

    diff =  (d: Date, timeUnit: timeUnit) => {
        return this.m.diff(d, timeUnit);
    }

    thisCycleStart = (type: "daily" | "weekly" | "monthly", originalStart: Date): this => {
        switch(type) {
            case "daily": {
                // no need to do anything
            } break;
            case "weekly": {
                const weekName = new MyDate(originalStart).dayName();
                this.setDay(weekName).asStartDate();
                if(this.toDate() > MyDate.Now().toDate()) {
                    this.subtract(1, "weeks").setDay(weekName);
                }
            } break;
            case "monthly": {
                const date = new MyDate(originalStart).dayOfMonth();
                this.setDayOfMonth(date);
                if(this.toDate() > MyDate.Now().toDate()) {
                    this.subtract(1, "months").setDayOfMonth(date);
                }
            } break;
            default: {

            }
        }
        return this.asStartDate();
    }

    thisCycleEnd = (type: "daily" | "weekly" | "monthly", originalStart: Date): this => {
        this.thisCycleStart(type, originalStart);

        switch(type) {
            case "daily": {
                // No need to do anything
            } break;
            case "weekly": {
                this.add(1, "weeks").subtract(1, "days");
            } break;
            case "monthly": {
                this.add(1, "months").subtract(1, "days");
            } break;
            default: {

            }
        }

        return this.asDueDate();
    }

    lastCycleStart = (type: "daily" | "weekly" | "monthly", 
            input: TimeCycle<typeof type>) => {

        switch(type) {
            case "daily": {
                // if daily, then the cycle is the most recent occurrence of the time.
                let oldTime = new MyDate(input as TimeCycle<typeof type>);
                let lastCycleDate = MyDate.Now().setTime(oldTime);
                if(lastCycleDate.isTodayInFuture()) {
                   lastCycleDate.subtract(1, "days");
                }
                this.m = moment(lastCycleDate.toDate());
            } break;
            case "weekly": {
                // cycle is most recent occurence, midnight.
                let lastCycleDate = MyDate.Now().setDay(input as TimeCycle<typeof type>).prevMidnight();
                if (lastCycleDate.isWithinWeekInFuture()) {
                    lastCycleDate.subtract(1, "weeks")
                }
                this.m = moment(lastCycleDate.toDate())
            } break;
            case "monthly": {
                let lastCycleDate = MyDate.Now().setDayOfMonth(input as TimeCycle<typeof type>).prevMidnight();
                if (lastCycleDate.isWithinMonthInFuture()) {
                    lastCycleDate.subtract(1, "months")
                }
                this.m = moment(lastCycleDate.toDate())
            } break;
        }
        return this;

    };

    /**
     * Adds a cycle and then rounds to start
     */
    addCycle = (unit : "days" | "weeks" | "months") => {
        this.add(1, unit).prevMidnight();
        return this;
    }

    addIncompleteCycle = (unit: "days" | "weeks" | "months") => {
        this.add(1, unit).prevMidnight().subtract(1, "minutes");
        return this;
    }

    isInNextCycleAfterDate = (d: Date, unit: timeUnit) => {
        const start = new MyDate(d).add(1, unit).prevMidnight();
        const end = new MyDate(d).add(2, unit).prevMidnight();
        return this.m.isSameOrAfter(start.toDate()) && this.m.isBefore(end.toDate());
    }

    isAfterNextCycleAfterDate = (d: Date, unit: timeUnit) => {
        const nextCycleEnd = new MyDate(d).add(2, unit).prevMidnight();
        return this.m.isSameOrAfter(nextCycleEnd.toDate());
    }

    isInOrAfterNextCycleAfterDate = (d: Date, unit: timeUnit) => {
        return this.isInNextCycleAfterDate(d, unit) || this.isAfterNextCycleAfterDate(d, unit);
    }

    isTodayInFuture = () => {
        return this.m.isAfter( MyDate.Now().toDate() ) && this.m.isSameOrBefore( MyDate.Now().nextMidnight().toDate())
    }

    isWithinWeekInFuture = () => {
        return this.m.isAfter(MyDate.Now().toDate() ) && this.m.isSameOrBefore( MyDate.Now().add(1, "weeks").toDate());
    }

    isWithinMonthInFuture = () => {
        return this.m.isAfter(MyDate.Now().toDate()) && this.m.isSameOrBefore( MyDate.Now().add(1, "months").toDate())
    }

    isTodayInPast = () => {
        return this.m.isSameOrAfter( MyDate.Now().prevMidnight().toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    isWithinWeekInPast = () => {
        return this.m.isSameOrAfter( MyDate.Now().subtract(1, "weeks").toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    isWithinMonthInPast = () => {
        return this.m.isSameOrAfter( MyDate.Now().subtract(1, "months").toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    inNext = ( unit: timeUnit, duration: number) => {
        let difference = this.m.diff(MyDate.Now().toDate(), unit) 
        return difference >= 0 && difference <= duration;
    }

    dayOfMonth = () => {
        return this.m.date();
    }
}

type TimeCycle<T> = T extends "daily" ? 
            Date : T extends "weekly" ? string : number;