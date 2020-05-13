import { AStringInput, AMultiStringInput } from "src/Components/Inputs/StringInput";
import { ADateInput, ATimeInput } from "src/Components/Inputs/DateTimeInput";
import { AChoiceInput } from "src/Components/Inputs/ChoiceInput";
import { ANumberInput } from "src/Components/Inputs/NumberInput";
import Form from "@marmalade82/ts-react-forms";  
import * as R from "ramda";
import MyDate from "src/common/Date";

export const makeForm = Form.install({
    text: AStringInput,   
    multi_text: AMultiStringInput,
    date: ADateInput,
    time: ATimeInput,
    choice: AChoiceInput,
    number: ANumberInput
})


export const thread = <Data extends unknown>(data: Data | Either<Data>, ...errorArgs: ((data: Either<Data>) => Either<Data>)[] ) => {

    const pipeline: (val: Either<Data>) => Either<Data> = (R.pipe as any)(...(errorArgs))

    if(data[0] === "ok") {
        return pipeline(["ok", data[1]]);
    } else if ( data[0] === "error") {
        return data as Either<Data>;
    } else {
        return pipeline(["ok", data as Data]);
    }

}

export function wrap<Data>(f: (d: Data) => Promise<Either<Data>>) {
    return ([code, data]: Either<Data>) => {
        if(code === "ok") {
            return f(data as Data);
        } else {
            return new Promise<Either<Data>>((resolve, reject) => {
                resolve(
                    [code, data] as Either<Data>
                );
            });
        }

    }
}


export type Either<Data> = ["ok", Data] | ["error", string]

export function required<Data>(field: string, label: string): (val: Either<Data>) => Either<Data> {
    return ([code, data]: ["ok", any] | ["error", string]) => {
        console.log(`required ${`${label}, ${field}`} with data ${JSON.stringify(data)}`)
        if(code === "error") {
            return [code, data] as ["ok", any] | ["error", string]
        }

        const val = data[field]
        if(val === undefined) {
            return ["error", `Field ${field} does not exist`];
        }

        if(typeof val === "string") {
            return val.length > 0 ? ["ok", data] : ["error", label + " is required"]
        } else if (val instanceof Date) {
            let result: Either<Data> = !isNaN(val.valueOf()) ? ["ok", data] : ["error", label + " is required"]
            return result;
        }

        return ["ok", data]
    }
}


export function startsWithinRange<Data>(start: Date, end: Date, field: string, label: string) {
    return ([code, data]: Either<Data>) => {
        if(code === "error") {
            return [code, data] as ["ok", any] | ["error", string]
        }

        const val = (data as Data)[field] as Date;

        const start_ = new MyDate(start).asStartDate()
        const end_ = new MyDate(end).asDueDate()

        if(val < start_.toDate()) {
            return ["error", `${label} cannot be before ${start_.format("MM/DD/YYYY")}`] as Either<Data>
        } else if (val > end_.toDate()) {
            return ["error", `${label} cannot be after ${end_.format("MM/DD/YYYY")}`]  as Either<Data>
        }

        return ["ok", data as Data] as Either<Data>;
    }
}

/**
 * This function validates that a piece of data satisfies the constraints specified by the example object,
 * and then returns the object as the Target type if it does. Otherwise it throws an error.
 * 
 * Success examples:
 * 
 * flatSchema({ }, { 
 *      apple: ["I", undefined]; 
 * })
 * 
 * 
 * Failure examples:
 * 
 * flatSchema({ apple: 3 }, { 
 *      apple: ["I", undefined]; 
 * })
 */

export type SchemaExample <Source> = {
     [P in keyof Source]: (Source[P])[]
}

export function flatSchema<Target>(data: any, example: SchemaExample<Target> ): Target   {
    let valid = true;
    const errors = [] as string[];
    Object.keys(example).forEach((key) => {
        const found = (example[key] as any[]).findIndex((val) => {
            if(typeof val === typeof data[key]) {
                return true;
            }

            return false;
        })

        if(found < 0) {
            const fieldTypes: string = (example[key] as any[]).map((val) => {
                return typeof val;
            }).join(" | ");
            errors.push(`Field '${key}' is not ${fieldTypes}`)
        }
    })

    if(valid) {
        return data as Target;
    }

    const errorMessages = errors.join("\n");
    throw new Error("Invalid schema for data " + JSON.stringify(data) + ":\n" + errorMessages);
}


export function unsafeSanitize<Data, K extends keyof Data, L extends Exclude<keyof Data, K>>(data: Data, required: K[], permitted: L[]):
    { [P in K]-?: Exclude<Data[P], undefined>;
    } & 
    { [Q in L]: Data[Q]
    }
{
    const sanitized = {};

    required.forEach((req) => {
        if(data[req] === undefined) {
            throw new Error(req.toString() + " was required");
        } else {
            sanitized[req as any] = data[req];
        }
    })

    permitted.forEach((permit) => {
        sanitized[permit as any] = data[permit];
    })

    return sanitized as any;

}