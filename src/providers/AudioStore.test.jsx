import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import AudioProvider, { AudioStore, setAudioData, setAudioProgress, storeVolume } from './AudioStore'

beforeAll(() => {
    Storage.prototype.getItem = vi.fn()
    Storage.prototype.setItem = vi.fn()
})

const TestComponent = () => {
    const { state, dispatch } = useContext(AudioStore)
    return (
        <>
            <div>{state.title}</div>
            <div>{state.file}</div>
            <div>{state.thumb}</div>
            <div data-testid="autoplay">{state.autoplay ? 'yes' : 'no'}</div>
            <div data-testid="volume">{state.volume}</div>

            <button
                onClick={() => dispatch(setAudioData('1290', 'test-file-stub', 'test title', 'test-thumb-stub', true))}
            >
                set data
            </button>
            <button onClick={() => dispatch(setAudioProgress(250, 11.32, 300))}>set offset</button>
            <button onClick={() => dispatch(setAudioProgress(255, 300, 300))}>set finished</button>
            <button onClick={() => dispatch(storeVolume(0.43))}>set volume</button>
        </>
    )
}

test('AudioStore should be able to store and retrieve volume data', () => {
    render(
        <AudioProvider>
            <TestComponent />
        </AudioProvider>,
    )

    expect(screen.getByTestId('volume').textContent).toBe('1')

    userEvent.click(screen.getByText(/set volume/i))
    expect(screen.getByTestId('volume').textContent).toBe('0.43')
    expect(localStorage.setItem).toBeCalledWith(expect.anything(), 0.43)
})

test('AudioStore should be able to set the audio data correctly', () => {
    render(
        <AudioProvider>
            <TestComponent />
        </AudioProvider>,
    )

    expect(screen.queryByText(/test title/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/test-file-stub/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/test-thumb-stub/i)).not.toBeInTheDocument()

    userEvent.click(screen.getByText(/set data/i))
    screen.getByText(/test title/i)
    screen.getByText(/test-file-stub/i)
    screen.getByText(/test-thumb-stub/i)
    expect(screen.getByTestId('autoplay').textContent).toBe('yes')
})

test('AudioStore should be able to store audio progress', () => {
    render(
        <AudioProvider>
            <TestComponent />
        </AudioProvider>,
    )

    userEvent.click(screen.getByText(/set offset/i))
    expect(localStorage.setItem).toBeCalledWith(
        expect.anything(),
        JSON.stringify({ 250: { elapsed: 11.32, duration: 300 } }),
    )
})

test('AudioStore should be able to mark the post as finished', () => {
    render(
        <AudioProvider>
            <TestComponent />
        </AudioProvider>,
    )

    userEvent.click(screen.getByText(/set finished/i))
    expect(localStorage.setItem).toBeCalledWith(expect.anything(), JSON.stringify([255]))
})
