import { renderWithAudio as render, screen } from 'test-utils'
import userEvent from '@testing-library/user-event'
import AudioSources from './AudioSources'

afterEach(() => jest.resetAllMocks())
const setup = (props) => render(<AudioSources {...props} />, null, { state: { id: 24 } })
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
    screen.getByRole('link', { name: /descargar/i })

    // Sources
    screen.getByRole('link', { name: /itunes/i })
    screen.getByRole('link', { name: /ivoox/i })
    screen.getByRole('link', { name: /spotify/i })
    screen.getByRole('link', { name: /google podcasts/i })
    screen.getByRole('link', { name: /podimo/i })
})

test("AudiosSources should allow to play the audio resources when it's not already playing", () => {
    setup(commonProps)

    userEvent.click(screen.getByRole('button', { name: /reproducir/i }))
    expect(commonProps.onPlayClick).toBeCalledTimes(1)
})

test('AudiosSources should not allow to play an audio source that is already playing', () => {
    setup({ ...commonProps, id: 24 })

    screen.getByRole('button', { name: /reproduciendo/i })
    expect(screen.queryByRole('button', { name: /reproducir/i })).not.toBeInTheDocument()
})
