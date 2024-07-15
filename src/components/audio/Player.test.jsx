import { renderWithAudio as render, screen, fireEvent } from 'test-utils'
import userEvent from '@testing-library/user-event'

import Player from './Player'
import thumbnail from '../../../public/default_thumbnail.jpg'
import audioStub from 'test-utils/audiostub.mp3'

const originalAudio = window.Audio
afterEach(() => {
    vi.restoreAllMocks()
    window.Audio = originalAudio
})

const baseState = {
    id: 42,
    title: 'test title',
    file: audioStub,
    volume: 1,
}

test('Player should show passed data', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => { })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => { })

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })
    // Wait for lazy loaded components
    await screen.findByText(/test title/i)

    // With optional thumbnail
    render(<Player />, null, { state: { ...baseState, thumb: thumbnail }, dispatch: vi.fn() })
    screen.getByAltText(/test title/i)
    expect(screen.getByRole('img').src).toContain(thumbnail)
})

test('Player should play automatically when autoplay is enable', () => {
    const playMock = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => { })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => { })

    render(<Player />, null, { state: { ...baseState, autoplay: true }, dispatch: vi.fn() })
    expect(playMock).toBeCalledTimes(1)
})

test('Player should move play head to offset position when provided', () => {
    const seekMock = vi.spyOn(HTMLMediaElement.prototype, 'currentTime', 'set').mockImplementation(() => { })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => { })

    render(<Player />, null, { state: { ...baseState, offset: 5.6 }, dispatch: vi.fn() })
    expect(seekMock).toBeCalledTimes(1)
    expect(seekMock).toBeCalledWith(5.6)
})

test('Player should show a spinner while audio is not ready', () => {
    const audioMock = new Audio()
    window.Audio = vi.fn().mockImplementation(() => audioMock)

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })
    const spinner = screen.getByTestId('spinner')

    fireEvent.loadedMetadata(audioMock)
    expect(spinner).not.toBeInTheDocument()
})

test('Player should be able to play/pause the audio', async () => {
    const audioMock = new Audio()
    audioMock.play = vi.fn()
    audioMock.pause = vi.fn()
    window.Audio = vi.fn().mockImplementation(() => audioMock)

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })
    screen.getByTestId('spinner')
    fireEvent.loadedMetadata(audioMock)

    const playBtn = await screen.findByTestId('play-btn')

    // Play
    userEvent.click(playBtn)
    expect(audioMock.play).toBeCalledTimes(1)

    // Pause
    userEvent.click(playBtn)
    expect(audioMock.pause).toBeCalledTimes(1)
})

test('Player should be able to change audio volume', () => {
    const audioMock = new Audio()
    window.Audio = vi.fn().mockImplementation(() => audioMock)

    const volumeMock = vi.fn()
    vi.spyOn(audioMock, 'volume', 'set').mockImplementation(volumeMock)

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })
    userEvent.click(screen.getByLabelText('volume'))
    expect(volumeMock).toBeCalled()
})

test('Player should be able to seek to a position with the progress bar', () => {
    const audioMock = new Audio()
    window.Audio = vi.fn().mockImplementation(() => audioMock)

    const seekMock = vi.fn()
    vi.spyOn(audioMock, 'currentTime', 'set').mockImplementation(seekMock)

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })

    // Enable seek controls
    fireEvent.loadedMetadata(audioMock)
    userEvent.click(screen.getByLabelText('seek'))
    expect(seekMock).toBeCalled()
})

test('Player should show total time, elapsed time & timeleft', () => {
    const audioMock = new Audio()
    window.Audio = vi.fn().mockImplementation(() => audioMock)

    vi.spyOn(audioMock, 'duration', 'get').mockReturnValue(120)
    vi.spyOn(audioMock, 'currentTime', 'get').mockReturnValue(10)

    render(<Player />, null, { state: baseState, dispatch: vi.fn() })

    // total time
    screen.getByText('00:02:00')

    // elapsed time
    fireEvent.timeUpdate(audioMock)
    const elapsed = screen.getByText('00:00:10')

    // remaining
    userEvent.click(elapsed)
    screen.getByText('00:01:50')
})
