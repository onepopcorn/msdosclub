import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioStore } from '../../../state/AudioStore'
import AudioSources from './AudioSources'

afterEach(() => jest.resetAllMocks())
const setup = (props) =>
    render(
        <AudioStore.Provider value={{ state: { id: 24 } }}>
            <AudioSources {...props} />
        </AudioStore.Provider>,
    )
const commonProps = {
    id: 42,
    file: 'file-stub',
    onPlayClick: jest.fn(),
}

test('AudiosSources should render the list of allowed external sources when provided & a download link', () => {
    setup({
        ...commonProps,
        sources: [
            { name: 'iTunes', url: 'url-stub' },
            { name: 'iVoox', url: 'url-stub' },
            { name: 'Spotify', url: 'url-stub' },
            { name: 'Google Podcasts', url: 'url-stub' },
            { name: 'Podimo', url: 'url-stub' },
        ],
    })

    // Download
    screen.getByTestId('download-btn')

    // Sources
    screen.getByTestId('source-msdos-apple-podcast')
    screen.getByTestId('source-msdos-ivoox')
    screen.getByTestId('source-msdos-spotify')
    screen.getByTestId('source-msdos-google-podcast')
    screen.getByTestId('source-msdos-podimo')
})

test("AudiosSources should allow to play the audio resources when it's not already playing", () => {
    setup(commonProps)

    userEvent.click(screen.getByTestId('play-btn'))
    expect(commonProps.onPlayClick).toBeCalledTimes(1)
})

test('AudiosSources should not allow to play an audio source that is already playing', () => {
    setup({ ...commonProps, id: 24 })

    screen.getByTestId('is-playing')
    expect(screen.queryByTestId('play-btn')).not.toBeInTheDocument()
})
