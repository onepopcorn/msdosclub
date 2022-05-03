export function secToHMS(time: number): string {
    if (!Number.isFinite(time)) throw TypeError('Provided time must be a number')

    const hours = Math.floor(time / 3600)
    const min = Math.floor((time % 3600) / 60)
    const sec = Math.floor((time % 3600) % 60)
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export function HMSToSec(hms: string): number {
    if (!hms.match(/^[0-2][0-3]:[0-5][0-9]:[0-5][0-9]$/gi)) throw TypeError('Provided string is not a valid HMS')

    const [hours, minutes, seconds] = hms.split(':')
    return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)
}
