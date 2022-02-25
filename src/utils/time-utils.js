export function secToHMS(time) {
    if (!Number.isFinite(time)) throw TypeError('Provided time must be a number')

    const hours = Math.floor(time / 3600)
    const min = Math.floor(time % 3600 / 60)
    const sec = Math.floor(time % 3600 % 60)
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}