import { secToHMS } from '../time-utils'

it('secToHMS should return formatted correct time', () => {
    expect(secToHMS(8936)).toBe('02:28:56')
    expect(secToHMS(3456)).toBe('00:57:36')
    expect(secToHMS(1)).toBe('00:00:01')
})

it('secToHMS should throw if anything but a number is passed to the function', () => {
    expect(() => secToHMS('invalid type')).toThrow('Provided time must be a number')
    expect(() => secToHMS('0')).toThrow('Provided time must be a number')
    expect(() => secToHMS(NaN)).toThrow('Provided time must be a number')
    expect(() => secToHMS(Infinity)).toThrow('Provided time must be a number')
})