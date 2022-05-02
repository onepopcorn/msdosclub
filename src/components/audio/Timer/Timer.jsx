import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { secToHMS } from 'utils/time-utils'
import styles from './Timer.module.css'
import { useState } from 'react'
const cx = classNames.bind(styles)

export default function Timer({ elapsed, total }) {
    const [showElapsed, setShowElapsed] = useState(true)
    const elapsedTime = Number.isFinite(elapsed) ? secToHMS(elapsed) : '--:--:--'
    const timeToShow =
        Number.isFinite(elapsed) && Number.isFinite(total) && !showElapsed ? secToHMS(total - elapsed) : elapsedTime
    const changeTimerType = () => setShowElapsed(!showElapsed)

    return (
        <div className={cx('container')}>
            <span className={cx('elapsed', { remaining: !showElapsed })} onClick={changeTimerType}>
                {timeToShow}
            </span>
            <span className={cx('separator')}>/</span>
            <span className={cx('total')}>{Number.isFinite(total) ? secToHMS(total) : '--:--:--'}</span>
        </div>
    )
}

Timer.propTypes = {
    elapsed: PropTypes.number,
    total: PropTypes.number,
}
