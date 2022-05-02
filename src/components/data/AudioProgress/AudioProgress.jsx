import { useContext } from 'react'
import PropTypes from 'prop-types'
import soundwave from 'assets/soundwave.gif'

import { AudioStore } from 'providers/AudioStore'

// Styles
import classNames from 'classnames/bind'
import styles from './AudioProgress.module.css'
const cx = classNames.bind(styles)

export default function AudioProgress({ id }) {
    const {
        state: { id: playingId, progress },
    } = useContext(AudioStore)
    if (!progress) return null
    const elapsed = progress[id]?.elapsed || 0
    const duration = progress[id]?.duration || 1
    const percent = ((elapsed * 100) / duration).toFixed(2)

    return (
        <div className={cx('container')}>
            {playingId !== id ? (
                <>
                    <span className={cx('percent')}>{Math.round(percent)}%</span>
                    <div className={cx('progress')} role="progressbar" aria-valuemax={duration} aria-valuenow={elapsed}>
                        <div
                            className={cx('progressTrack', { empty: percent <= 0 })}
                            style={{ clipPath: `inset(0% ${100 - percent}% 0% 0%)` }}
                        ></div>
                    </div>
                </>
            ) : (
                <div className={cx('analyzer')}>
                    <img className={cx('waveform')} src={soundwave} alt="reproduciendo" />
                </div>
            )}
        </div>
    )
}

AudioProgress.propTypes = {
    id: PropTypes.number.isRequired,
}
