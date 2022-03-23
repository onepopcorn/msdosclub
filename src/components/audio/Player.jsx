import { useContext, useEffect, useMemo, useRef } from 'react'
import { SlIconButton, SlSpinner } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'

import Progress from './Progress/Progress'
import Timer from './Timer'
import Info from './Info/Info'
import useAudio from './hooks/useAudio'
import { AudioStore, setAudioProgress } from '../state/AudioStore'

import styles from './Player.module.css'
const cx = classNames.bind(styles)

export default function Player() {
    const {
        state: { id, title, file, thumb, autoplay, offset },
        dispatch,
    } = useContext(AudioStore)
    const lastTimeStamp = useRef(0)
    const audio = useRef(new Audio())
    useMemo(() => (audio.current.src = file), [file])

    const { ready, elapsed, loading, isPlaying, play, toggle, seekTo, duration, setVolume, volume } = useAudio(
        audio.current,
    )

    useEffect(() => {
        if (autoplay) play()
        if (offset > 0) seekTo(offset)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoplay, offset, ready])

    // Store elapsed time every 5 seconds
    useEffect(() => {
        if (Math.abs(elapsed - lastTimeStamp.current) < 5) return

        lastTimeStamp.current = elapsed
        dispatch(setAudioProgress(id, elapsed))
    }, [dispatch, elapsed, id])

    if (!file) return null

    const btnText = isPlaying ? 'pause-fill' : 'play-fill'
    return (
        <div className={cx('container')}>
            <div className={cx('progressContainer')}>
                <Progress
                    max={Math.round(duration)}
                    value={elapsed}
                    onChange={seekTo}
                    loading={loading}
                    disabled={!ready}
                    interactive={false}
                    label="seek"
                />
            </div>

            <div className={cx('controls')}>
                {ready && !loading ? (
                    <SlIconButton
                        data-testid="play-btn"
                        className={cx('button')}
                        name={btnText}
                        label={btnText}
                        onClick={toggle}
                    />
                ) : (
                    <SlSpinner data-testid="spinner" className={cx('spinner')} />
                )}

                {thumb && <img className={cx('thumbnail')} src={thumb} alt={title} height="32px" width="32px" />}
                <Info title={title} />
                <div className={cx('volume')}>
                    <Progress max={1} value={volume} onChange={setVolume} label="volume" />
                </div>
                <Timer elapsed={elapsed} total={duration} />
            </div>
        </div>
    )
}
