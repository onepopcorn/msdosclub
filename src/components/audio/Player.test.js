import { renderWithAudio as render, screen, fireEvent } from 'utils/test-utils'
import userEvent from '@testing-library/user-event'

import Player from './Player'
import thumbnail from '../../../public/default_thumbnail.jpg'
import audioStub from 'utils/test-utils/audiostub.mp3'

const originalAudio = window.Audio
afterEach(() => {
    jest.restoreAllMocks()
    window.Audio = originalAudio
})

const baseState = {
    id: 42,
    title: 'test title',
    file: audioStub,
    volume: 1,
}

test('Player should show passed data', async () => {
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })
    // Wait for lazy loaded components
    await screen.findByText(/test title/i)

    // With optional thumbnail
    render(<Player />, null, { state: { ...baseState, thumb: thumbnail }, dispatch: jest.fn() })
    screen.getByAltText(/test title/i)
    expect(screen.getByRole('img').src).toContain(thumbnail)
})

test('Player should play automatically when autoplay is enable', () => {
    const playMock = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})

    render(<Player />, null, { state: { ...baseState, autoplay: true }, dispatch: jest.fn() })
    expect(playMock).toBeCalledTimes(1)
})

test('Player should move play head to offset position when provided', () => {
    const seekMock = jest.spyOn(HTMLMediaElement.prototype, 'currentTime', 'set').mockImplementation(() => {})
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => {})

    render(<Player />, null, { state: { ...baseState, offset: 5.6 }, dispatch: jest.fn() })
    expect(seekMock).toBeCalledTimes(1)
    expect(seekMock).toBeCalledWith(5.6)
})

test('Player should show a spinner while audio is not ready', () => {
    const audioMock = new Audio()
    window.Audio = jest.fn().mockImplementation(() => audioMock)

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })
    const spinner = screen.getByTestId('spinner')

    fireEvent.loadedMetadata(audioMock)
    expect(spinner).not.toBeInTheDocument()
})

test('Player should be able to play/pause the audio', async () => {
    const audioMock = new Audio()
    audioMock.play = jest.fn()
    audioMock.pause = jest.fn()
    window.Audio = jest.fn().mockImplementation(() => audioMock)

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })
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
    window.Audio = jest.fn().mockImplementation(() => audioMock)

    const volumeMock = jest.fn()
    jest.spyOn(audioMock, 'volume', 'set').mockImplementation(volumeMock)

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })
    userEvent.click(screen.getByLabelText('volume'))
    expect(volumeMock).toBeCalled()
})

test('Player should be able to seek to a position with the progress bar', () => {
    const audioMock = new Audio()
    window.Audio = jest.fn().mockImplementation(() => audioMock)

    const seekMock = jest.fn()
    jest.spyOn(audioMock, 'currentTime', 'set').mockImplementation(seekMock)

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })

    // Enable seek controls
    fireEvent.loadedMetadata(audioMock)
    userEvent.click(screen.getByLabelText('seek'))
    expect(seekMock).toBeCalled()
})

test('Player should show total time, elapsed time & timeleft', () => {
    const audioMock = new Audio()
    window.Audio = jest.fn().mockImplementation(() => audioMock)

    jest.spyOn(audioMock, 'duration', 'get').mockReturnValue(120)
    jest.spyOn(audioMock, 'currentTime', 'get').mockReturnValue(10)

    render(<Player />, null, { state: baseState, dispatch: jest.fn() })

    // total time
    screen.getByText('00:02:00')

    // elapsed time
    fireEvent.timeUpdate(audioMock)
    const elapsed = screen.getByText('00:00:10')

    // remaining
    userEvent.click(elapsed)
    screen.getByText('00:01:50')
})
