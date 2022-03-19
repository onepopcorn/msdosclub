import { useContext, useEffect, useState } from 'react'
import { AudioStore, storeVolume } from '../../state/AudioStore'

export default function useAudio(audio) {
    const {
        state: { volume },
        dispatch,
    } = useContext(AudioStore)
    const [isPlaying, setIsPlaying] = useState(false)
    const [ready, setReady] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [loading, setLoading] = useState(false)

    // Audio controls
    const play = () => {
        if (loading) return
        audio.play()
        setIsPlaying(true)
    }

    const pause = () => {
        if (loading) return
        audio.pause()
        setIsPlaying(false)
    }

    const toggle = () => (isPlaying ? pause() : play())

    const seekTo = (val) => {
        setLoading(true)
        audio.currentTime = val
    }

    const setVolume = (val) => {
        dispatch(storeVolume(val))
        audio.volume = val
    }

    // Reset
    useEffect(() => {
        setIsPlaying(false)
        setElapsed(0)
        setReady(false)
        setLoading(false)
        setVolume(volume)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audio.src])

    // Handle seeking
    useEffect(() => {
        if (!audio) return

        const onseekingended = () => setLoading(false)
        const onfinished = () => setIsPlaying(false)

        audio.addEventListener('seeked', onseekingended)
        audio.addEventListener('ended', onfinished)

        return () => {
            audio.removeEventListener('seeked', onseekingended)
            audio.removeEventListener('ended', onfinished)
        }
    }, [audio, ready])

    // Handle ready state & buffering
    useEffect(() => {
        if (!audio) return

        const onmetadata = () => setReady(true)
        audio.addEventListener('loadedmetadata', onmetadata)

        const onloading = () => setLoading(true)
        audio.addEventListener('waiting', onloading)

        const onloaded = () => setLoading(false)
        audio.addEventListener('canplay', onloaded)

        return () => {
            audio.removeEventListener('loadedmetadata', onmetadata)
            audio.removeEventListener('waiting', onloading)
            audio.removeEventListener('canplay', onloaded)
        }
    }, [audio])

    // Handle time update/elapsed time
    useEffect(() => {
        if (!audio) return

        const onelapsed = () =>
            Math.round(audio.currentTime) !== elapsed ? setElapsed(Math.floor(audio.currentTime)) : null
        audio.addEventListener('timeupdate', onelapsed)
        return () => audio.removeEventListener('timeupdate', onelapsed)
    }, [audio, elapsed])

    return {
        ready,
        elapsed,
        loading,
        isPlaying,
        play,
        pause,
        toggle,
        seekTo,
        duration: audio.duration,
        setVolume,
        volume: audio.volume,
    }
}
