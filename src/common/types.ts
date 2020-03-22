type Exact<T> = T

type LabelValue = {
    label: string;
    value: string;
    key: string;
}

export {
    Exact,
    LabelValue,
}

export function assignAll <Source>(exclude: (keyof Source)[], target: any, source: Source) {
    Object.keys(source).forEach((key: string) => {
        if( exclude.includes(key as any) ) {
            // Then we exclude it.
        } else {
            target[key] = source[key];
        }
    })

    return target as unknown;
}

export function assignOnly <Source> (include: (keyof Source)[], target: any, source: Source) {
    Object.keys(source).forEach((key: string) => {
        if( include.includes(key as any) ) {
            // Then we include it.
            target[key] = source[key];
        } else {
        }
    })

    return target as unknown;
}