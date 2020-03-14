
import moment from "moment";
import { Moment } from "moment";
import { TouchableHighlightBase } from "react-native";


type timeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";

export default class MyDate {
    m: Moment;
    constructor(date?: Date) {
        if(date) {
            this.m = moment(date);
        } else {
            this.m = moment() // initialize moment to now
        }
    }

    static Zero = () => {
        return new MyDate(new Date(0))
    }

    static Now = () => {
        return new MyDate();
    }

    timeToNow = () => {
        return this.m.toNow();
    }

    timeFromNow = () => {
        return this.m.fromNow();
    }

    format = (format: string) => {
        return this.m.format(format);
    }

    subtract = (n: number, val: timeUnit): this => {
        this.m = this.m.subtract(n, val);

        return this;
    }

    add = (n: number, val: timeUnit): this => {
        this.m = this.m.add(n, val);

        return this;
    }

    isSomeTimeToday = () => {
        const start = new MyDate().prevMidnight().toDate();
        const end = new MyDate().nextMidnight().toDate();
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
                let nextCycleDate = new MyDate().setTime(oldTime);
                if(nextCycleDate.isTodayInPast()) {
                   nextCycleDate.add(1, "days");
                }
                this.m = moment(nextCycleDate.toDate());
            } break;
            case "weekly": {
                let nextCycleDate = new MyDate().setDay(input as TimeCycle<typeof type>).prevMidnight();
                if (nextCycleDate.isWithinWeekInPast()) {
                    nextCycleDate.add(1, "weeks")
                }
                this.m = moment(nextCycleDate.toDate())
            } break;
            case "monthly": {
                let nextCycleDate = new MyDate().setDayOfMonth(input as TimeCycle<typeof type>).prevMidnight();
                if (nextCycleDate.isWithinMonthInPast()) {
                    nextCycleDate.add(1, "months")
                }
                this.m = moment(nextCycleDate.toDate())
            } break;
        }
        return this;
    }

    diff =  (d: Date, timeUnit) => {
        return this.m.diff(d, timeUnit);
    }

    lastCycleStart = (type: "daily" | "weekly" | "monthly", 
            input: TimeCycle<typeof type>) => {

        switch(type) {
            case "daily": {
                // if daily, then the cycle is the most recent occurrence of the time.
                let oldTime = new MyDate(input as TimeCycle<typeof type>);
                let lastCycleDate = new MyDate().setTime(oldTime);
                if(lastCycleDate.isTodayInFuture()) {
                   lastCycleDate.subtract(1, "days");
                }
                this.m = moment(lastCycleDate.toDate());
            } break;
            case "weekly": {
                // cycle is most recent occurence, midnight.
                let lastCycleDate = new MyDate().setDay(input as TimeCycle<typeof type>).prevMidnight();
                if (lastCycleDate.isWithinWeekInFuture()) {
                    lastCycleDate.subtract(1, "weeks")
                }
                this.m = moment(lastCycleDate.toDate())
            } break;
            case "monthly": {
                let lastCycleDate = new MyDate().setDayOfMonth(input as TimeCycle<typeof type>).prevMidnight();
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
        return this.m.isAfter( MyDate.Now().toDate() ) && this.m.isSameOrBefore( new MyDate().nextMidnight().toDate())
    }

    isWithinWeekInFuture = () => {
        return this.m.isAfter(MyDate.Now().toDate() ) && this.m.isSameOrBefore( new MyDate().add(1, "weeks").toDate());
    }

    isWithinMonthInFuture = () => {
        return this.m.isAfter(MyDate.Now().toDate()) && this.m.isSameOrBefore( new MyDate().add(1, "months").toDate())
    }

    isTodayInPast = () => {
        return this.m.isSameOrAfter( new MyDate().prevMidnight().toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    isWithinWeekInPast = () => {
        return this.m.isSameOrAfter( new MyDate().subtract(1, "weeks").toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    isWithinMonthInPast = () => {
        return this.m.isSameOrAfter( new MyDate().subtract(1, "months").toDate()) && this.m.isBefore(MyDate.Now().toDate());
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