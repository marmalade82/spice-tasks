
import moment from "moment";
import { Moment } from "moment";


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

    nextMidnight = (): this => {
        this.m = this.m.endOf('day');

        return this;
    }

    prevMidnight = (): this => {
        this.m = this.m.startOf('day');

        return this;
    }
}