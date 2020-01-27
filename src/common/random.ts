
/**
 * Returns a random integer in the inclusive range [start, end]
 * @param upper 
 * @param lower 
 */
function random(lower: number, upper: number): number {
    const range = (1 + lower) - upper;
    return (Math.floor(Math.random() * 100) % range) + lower;
}

export {
    random
}