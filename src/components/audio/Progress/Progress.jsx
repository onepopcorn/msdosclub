import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { clamp, valueToPercent, percentToValue } from '../../../utils/math-utils'
import { secToHMS } from 'utils/time-utils'
import style from './Progress.module.css'
let cx = classNames.bind(style)

// Utility function to calculate internal thumb position from event
const eventToValue = (e, ref) => {
    const { width: total, x: offsetX } = ref.current.getBoundingClientRect()

    // Get clientX depdending on the event type. Defaults to click event type
    let { clientX: value } = e
    if ('touches' in e && e.touches.length > 0) value = e.touches[0].clientX
    if ('changedTouches' in e && e.changedTouches.length > 0) value = e.changedTouches[0].clientX

    return clamp(0, value - offsetX, total)
}

// Utility function to calculate value to be passed to onChange
const calculateChangeValue = (e, ref, total) => {
    const xPos = eventToValue(e, ref)
    const newPercent = valueToPercent(xPos, ref.current.getBoundingClientRect().width)
    return percentToValue(newPercent, total)
}

export default function Progress({
    value = 0,
    max,
    label = '',
    onChange,
    onRelease,
    tooltip = false,
    loading = false,
    disabled = false,
}) {
    const [dragging, setDragging] = useState(false)
    const [position, setPosition] = useState(0)
    const [internalValue, setInternalValue] = useState(0)
    const trackRef = useRef(null)
    const percent = disabled ? 0 : valueToPercent(value, max)
    const touchDelay = useRef()

    // Handle drag event
    const onStartDragging = (e) => {
        if (disabled) return

        // Prevent drag outside bug
        e.type === 'mousedown' && e.cancelable && e.preventDefault()

        if (e.type === 'mousedown') {
            setDragging(true)
            setPosition(eventToValue(e, trackRef))
            return
        }

        clearTimeout(touchDelay.current)
        touchDelay.current = setTimeout(() => {
            setDragging(true)
            setPosition(eventToValue(e, trackRef))
        }, 110)

        return () => clearTimeout(touchDelay.current)
    }

    // Set thumb at initial position & handle resize
    useEffect(() => {
        if (dragging) return

        const calculatePosition = () => {
            const value = percentToValue(percent, trackRef.current.getBoundingClientRect().width)
            setPosition(value)
        }
        calculatePosition()
        window.addEventListener('resize', calculatePosition)

        return () => {
            window.removeEventListener('resize', calculatePosition)
        }
        // Skip dragging as dependency to prevent update of position until the next rerender
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [percent])

    // Handle window attached events
    useEffect(() => {
        const ondrag = (e) => {
            if (!dragging) return
            const value = calculateChangeValue(e, trackRef, max)
            setPosition(eventToValue(e, trackRef))
            if (tooltip) setInternalValue(value)
            if (typeof onChange === 'function') onChange(value)
        }

        const stopdrag = (e) => {
            clearTimeout(touchDelay.current)

            if (!dragging) return
            // Prevent mouseEvent to be triggered after touchEvent
            e.cancelable && e.preventDefault()

            const value = calculateChangeValue(e, trackRef, max)
            if (typeof onRelease === 'function') onRelease(value)
            if (typeof onChange === 'function') onChange(value)
            setDragging(false)
        }

        window.addEventListener('mousemove', ondrag)
        window.addEventListener('touchmove', ondrag)
        window.addEventListener('mouseup', stopdrag)
        window.addEventListener('touchend', stopdrag)

        // Remove listeners on unmount
        return () => {
            window.removeEventListener('mousemove', ondrag)
            window.removeEventListener('touchmove', ondrag)
            window.removeEventListener('mouseup', stopdrag)
            window.removeEventListener('touchend', stopdrag)
        }
    }, [dragging, onChange, max, onRelease, tooltip])

    return (
        <div className={cx('container')} disabled={disabled}>
            <div
                ref={trackRef}
                role="slider"
                aria-valuenow={value}
                aria-label={label}
                className={cx('track')}
                onMouseDown={onStartDragging}
                onTouchStart={onStartDragging}
                onTouchEnd={(e) => e.preventDefault()}
            >
                <div className={cx('trackMask')}>
                    <div
                        role="progressbar"
                        aria-valuenow={value}
                        className={cx('trackInner', { loading })}
                        style={{ transform: `translateX(calc(${position}px - 100%))` }}
                    ></div>
                </div>
                {tooltip && (
                    <span
                        role="tooltip"
                        className={cx('tooltip', { visible: dragging })}
                        style={{
                            transform: `translateX(calc(${Math.min(
                                window.innerWidth - 50,
                                Math.max(position, 25),
                            )}px - 50%))`,
                        }}
                    >
                        {secToHMS(internalValue)}
                    </span>
                )}
                <div
                    className={cx('handler', { dragging, loading })}
                    style={{
                        transform: `translateX(calc(${position}px - 50%))`,
                    }}
                ></div>
            </div>
        </div>
    )
}

Progress.propTypes = {
    /**
     * Max progress number
     */
    max: PropTypes.number.isRequired,
    /**
     * Current progress value
     */
    value: PropTypes.number.isRequired,
    /**
     * Calback for when progress is changed manually by the user
     */
    onChange: PropTypes.func,
    /**
     * Calback for when progress is finished changing manually by the user
     */
    onRelease: PropTypes.func,
    /**
     * Show tooltip when sliding if true
     */
    tooltip: PropTypes.bool,
    /**
     * Set or disable loading animation
     */
    loading: PropTypes.bool,
    /**
     * Disable progress interactivity when set
     */
    disabled: PropTypes.bool,
    interactive: PropTypes.bool,
}
