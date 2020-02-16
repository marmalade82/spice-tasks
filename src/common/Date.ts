
import moment from "moment";
import { Moment } from "moment";
import { TouchableHighlightBase } from "react-native";


type timeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks";

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

    minutes = () => {
        return this.m.minutes();
    }

    hours = () => {
        return this.m.hours();
    }

    seconds = () => {
        return this.m.seconds();
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
                input
            } break;
            case "monthly": {
                input
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
                input
            } break;
            case "monthly": {
                input
            } break;
        }
        return this;

    };

    isTodayInFuture = () => {
        return this.m.isAfter( MyDate.Now().toDate() ) && this.m.isSameOrBefore( new MyDate().nextMidnight().toDate())
    }

    isTodayInPast = () => {
        return this.m.isSameOrAfter( new MyDate().prevMidnight().toDate()) && this.m.isBefore(MyDate.Now().toDate());
    }

    inNext = ( unit: timeUnit, duration: number) => {
        let difference = this.m.diff(MyDate.Now().toDate(), unit) 
        return difference >= 0 && difference <= duration;
    }
}

type TimeCycle<T> = T extends "daily" ? 
            Date : T extends "weekly" ? string : number;