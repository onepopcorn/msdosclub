// Clamp given value between min and max given values
export const clamp = (min, value, max) => Math.max(min, Math.min(value, max))

// Calculate % value for a given value & total
export const percentToValue = (percent, total) => {
    if (percent < 0 || total < 0) throw TypeError('Passed values must be positive numbers')
    return percent / 100 * total
}

// Calculate value for given percent & total
export const valueToPercent = (value, total) => {
    if (value < 0 || total < 0) throw TypeError('Passed values must be positive numbers')
    return value * 100 / total
}
