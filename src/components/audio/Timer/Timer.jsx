import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { secToHMS } from '../../../utils/time-utils'
import styles from './Timer.module.css'
const cx = classNames.bind(styles)

export default function Timer({ elapsed, total }) {
    const elapsedTime = Number.isFinite(elapsed) ? secToHMS(elapsed) : '--:--:--'
    const totalTime = Number.isFinite(total) ? secToHMS(total) : '--:--:--'
    return (
        <div className={cx('container')}>
            <span className={cx('elapsed')}>{elapsedTime}</span>
            <span className={cx('separator')}>/</span>
            <span className={cx('total')}>{totalTime}</span>
        </div>
    )
}

Timer.propTypes = {
    elapsed: PropTypes.number,
    total: PropTypes.number,
}
