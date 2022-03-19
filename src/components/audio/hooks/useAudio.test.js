import { fireEvent } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import AudioProvider from '../../state/AudioStore'
import useAudio from './useAudio'

let audio
beforeEach(() => {
    audio = new Audio(
        'data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==',
    )
})

afterEach(() => {
    jest.restoreAllMocks()
})

test('useAudio should have a correct initial state', () => {
    const { result } = renderHook(() => useAudio(audio), { wrapper: AudioProvider })

    expect(result.current.ready).toBe(false)
    expect(result.current.elapsed).toBe(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.isPlaying).toBe(false)

    // Ready
    fireEvent(audio, new Event('loadedmetadata'))
    expect(result.current.ready).toBe(true)
})

test('useAudio should allow control the audio reproduction', () => {
    const pauseSpy = jest.spyOn(audio, 'pause').mockImplementation(() => {})
    const playSpy = jest.spyOn(audio, 'play').mockImplementation(() => {})

    const { result } = renderHook(() => useAudio(audio), { wrapper: AudioProvider })

    // Play
    act(() => {
        result.current.play()
    })
    expect(result.current.isPlaying).toBe(true)
    expect(playSpy).toBeCalledTimes(1)

    // Pause
    act(() => {
        result.current.pause()
    })
    expect(result.current.isPlaying).toBe(false)
    expect(pauseSpy).toBeCalledTimes(1)

    // Toggle
    act(() => {
        result.current.toggle()
    })
    expect(result.current.isPlaying).toBe(true)
    expect(playSpy).toBeCalledTimes(2)

    act(() => {
        result.current.toggle()
    })
    expect(result.current.isPlaying).toBe(false)
    expect(pauseSpy).toBeCalledTimes(2)
})

test('useAudio should allow to seek to specific audio position', () => {
    const currentTimeSetSpy = jest.spyOn(audio, 'currentTime', 'set')

    const { result } = renderHook(() => useAudio(audio), { wrapper: AudioProvider })

    act(() => {
        result.current.seekTo(5.6)
    })
    expect(result.current.loading).toBe(true)
    expect(currentTimeSetSpy).toBeCalledTimes(1)
    expect(currentTimeSetSpy).toBeCalledWith(5.6)

    fireEvent(audio, new Event('seeked'))
    expect(result.current.loading).toBe(false)
})

test('useAudio should allow to adjust the volume of the audio resource', () => {
    const { result } = renderHook(() => useAudio(audio), { wrapper: AudioProvider })

    act(() => {
        result.current.setVolume(0.25)
    })
    expect(audio.volume).toBe(0.25)
})

test('useAudio should persist volume between rerenders', () => {
    const { result, rerender } = renderHook(() => useAudio(audio), { wrapper: AudioProvider })

    // Default value case
    expect(audio.volume).toBe(1)

    // Persistence between renders
    act(() => {
        result.current.setVolume(0.4)
    })

    rerender(() => useAudio(audio), { wrapper: AudioProvider })
    expect(result.current.volume).toBe(0.4)
})
