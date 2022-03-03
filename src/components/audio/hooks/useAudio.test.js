import { fireEvent } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import useAudio from './useAudio'

const audioStub =
    'data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=='

afterEach(() => {
    jest.restoreAllMocks()
})

test('useAudio should have a correct initial state', () => {
    const audio = new Audio(audioStub)
    const { result } = renderHook(() => useAudio(audio))

    expect(result.current.ready).toBe(false)
    expect(result.current.elapsed).toBe(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.isPlaying).toBe(false)

    // Ready
    fireEvent(audio, new Event('loadedmetadata'))
    expect(result.current.ready).toBe(true)
})

test('useAudio should allow control the audio resource', () => {
    const audio = new Audio(audioStub)
    const pauseSpy = jest.spyOn(audio, 'pause').mockImplementation(() => {})
    const playSpy = jest.spyOn(audio, 'play').mockImplementation(() => {})
    const currentTimeSetSpy = jest.spyOn(audio, 'currentTime', 'set')

    const { result } = renderHook(() => useAudio(audio))

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

    // Seek
    act(() => {
        result.current.seekTo(5)
    })
    expect(result.current.loading).toBe(true)
    expect(currentTimeSetSpy).toBeCalledTimes(1)
    expect(currentTimeSetSpy).toBeCalledWith(5)

    fireEvent(audio, new Event('seeked'))
    expect(result.current.loading).toBe(false)
})
