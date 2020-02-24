function choice<T>(label: string, val: T, key?: T) {
    return {
        label: label,
        value: val,
        key: key ? key : val,
    }
}

/**
 * If n < 1, returns @arr.
 * If n >= 1, returns the first n elements of the array, or the entire array if the 
 *  array has fewer than n elements
 * @param arr 
 * @param n 
 */
function take<T>(arr: T[], n: number): T[] {
    let num = Math.floor(n);
    if( num < 1) {
        return arr.concat([]);
    } else {
        let newArr: T[] = [];
        const newLength = Math.min(arr.length, num)
        for(let i = 0; i < newLength; i++) {
            newArr.push(arr[i]);
        }
        return newArr;
    }
}

export {
    choice,
    take,
}