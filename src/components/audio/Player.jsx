import { useContext, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import { SlIconButton, SlSpinner } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'

import useAudio from 'hooks/useAudio'
import { AudioStore, setAudioProgress, storeVolume } from 'providers/AudioStore'

import styles from './Player.module.css'
const cx = classNames.bind(styles)

// Lazy loaded components
const Progress = lazy(() => import(/* webpackPrefetch: true */ 'components/audio/Progress/Progress'))
const Timer = lazy(() => import(/* webpackPrefetch: true */ 'components/audio/Timer'))
const Info = lazy(() => import(/* webpackPrefetch: true */ 'components/audio/Info/Info'))

const PROGRESS_SAVING_INTERVAL = 5

export default function Player() {
    const {
        state: { id, title, file, thumb, autoplay, offset },
        dispatch,
    } = useContext(AudioStore)
    const lastTimeStamp = useRef(0)
    const audio = useRef(new Audio())
    useMemo(() => { audio.current.src = file }, [file])

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
        if (!duration || Math.abs(elapsed - lastTimeStamp.current) < PROGRESS_SAVING_INTERVAL) return

        lastTimeStamp.current = elapsed
        dispatch(setAudioProgress(id, elapsed, duration))
    }, [dispatch, elapsed, id, duration])

    // Keyboard controls
    // useEffect(() => {
    //     if (!ready) return

    //     const onkeydown = e => {
    //         console.log(e)
    //     }

    //     window.addEventListener('keydown', onkeydown)

    //     return () => window.removeEventListener('keydown', onkeydown)
    // }, [ready])

    if (!file) return null

    const btnText = isPlaying ? 'pause-fill' : 'play-fill'
    return (
        <div className={cx('container')}>
            <Suspense fallback={null}>
                <div className={cx('progressContainer')}>
                    <Progress
                        max={Math.round(duration)}
                        value={elapsed}
                        onRelease={seekTo}
                        loading={loading}
                        disabled={!ready}
                        tooltip={true}
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
                        <Progress
                            max={1}
                            value={volume}
                            onChange={setVolume}
                            label="volume"
                            onRelease={(e) => dispatch(storeVolume(e))}
                        />
                    </div>
                    <Timer elapsed={elapsed} total={duration} />
                </div>
            </Suspense>
        </div>
    )
}
