function choice<T>(label: string, val: T, key?: T) {
    return {
        label: label,
        value: val,
        key: key ? key : val,
    }
}

export {
    choice
}