import { useEffect, useState } from 'react'

export default function useAudio(audio) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [ready, setReady] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [loading, setLoading] = useState(false)

    const toggle = () => {
        if (loading) return

        if (isPlaying) audio.pause()
        if (!isPlaying) audio.play()

        setIsPlaying(!isPlaying)
    }

    const seekTo = (val) => {
        setLoading(true)
        audio.currentTime = Math.round(val)
    }

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
            Math.round(audio.currentTime) !== elapsed
                ? setElapsed(Math.floor(audio.currentTime))
                : null
        audio.addEventListener('timeupdate', onelapsed)
        return () => audio.removeEventListener('timeupdate', onelapsed)
    }, [audio, elapsed])

    return { ready, elapsed, loading, isPlaying, toggle, seekTo }
}
