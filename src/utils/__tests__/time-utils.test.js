import { secToHMS, HMSToSec } from '../time-utils'

test('secToHMS should return formatted correct time', () => {
    expect(secToHMS(8936)).toBe('02:28:56')
    expect(secToHMS(3456)).toBe('00:57:36')
    expect(secToHMS(1)).toBe('00:00:01')
})

test('secToHMS should throw if anything but a number is passed to the function', () => {
    expect(() => secToHMS('invalid type')).toThrow('Provided time must be a number')
    expect(() => secToHMS('0')).toThrow('Provided time must be a number')
    expect(() => secToHMS(NaN)).toThrow('Provided time must be a number')
    expect(() => secToHMS(Infinity)).toThrow('Provided time must be a number')
})

test('HMSToSec should return total seconds from a formatted time string', () => {
    expect(HMSToSec('00:00:00')).toBe(0)
    expect(HMSToSec('00:00:01')).toBe(1)
    expect(HMSToSec('00:03:00')).toBe(180)
    expect(HMSToSec('02:00:03')).toBe(7203)
    expect(HMSToSec('23:59:59')).toBe(86399)
})

test('HMSToSec should throw if an invalid time string is passed', () => {
    expect(() => HMSToSec('25:00:00')).toThrow('Provided string is not a valid HMS')
    expect(() => HMSToSec('-01:00:00')).toThrow('Provided string is not a valid HMS')
    expect(() => HMSToSec('00:60:00')).toThrow('Provided string is not a valid HMS')
    expect(() => HMSToSec('00:100:00')).toThrow('Provided string is not a valid HMS')
    expect(() => HMSToSec('00:00:70')).toThrow('Provided string is not a valid HMS')
    expect(() => HMSToSec('24:00:00')).toThrow('Provided string is not a valid HMS')
})
