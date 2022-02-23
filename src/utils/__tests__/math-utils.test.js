import { clamp, percentToValue, valueToPercent } from '../math-utils'

describe('Clamp', () => {
    it('Should return given value when between the limits', () => expect(clamp(0, 10, 30)).toBe(10))
    it('Should return min when value is lower than min given value', () => expect(clamp(0, -5, 30)).toBe(0))
    it('Should return max when value is higher than max given value', () => expect(clamp(0, 50, 30)).toBe(30))
})

describe('PercentToValue', () => {
    it('Should throw if passed percent is negative', () => {
        expect(() => {
            percentToValue(-5, 250)
        }).toThrow('Passed values must be positive numbers')
    })

    it('Should throw if passed total is negative', () => {
        expect(() => {
            percentToValue(10, -600)
        }).toThrow('Passed values must be positive numbers')
    })

    it('Should return correct percentage value for given values', () => {
        expect(percentToValue(50, 10)).toBe(5)
        expect(percentToValue(25, 640)).toBe(160)
        expect(percentToValue(33, 1200)).toBe(396)
    })
})

describe('ValueToPercent', () => {
    it('Should throw if passed value is negative', () => {
        expect(() => {
            valueToPercent(-100, 250)
        }).toThrow('Passed values must be positive numbers')
    })

    it('Should throw if passed total is negative', () => {
        expect(() => {
            valueToPercent(200, -250)
        }).toThrow('Passed values must be positive numbers')
    })

    it('Should return correct value for given values', () => {
        expect(valueToPercent(25, 100)).toBe(25)
        expect(valueToPercent(180, 360)).toBe(50)
        expect(valueToPercent(36, 1200)).toBe(3)
    })
})
