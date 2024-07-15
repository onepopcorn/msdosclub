import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import ThemeProvider, { ThemeStore, THEME_DARK, THEME_LIGHT } from 'providers/ThemeStore'

beforeEach(() => {
    Storage.prototype.getItem = vi.fn()
    Storage.prototype.setItem = vi.fn()
})

const TestComponent = () => {
    const { theme, setTheme } = useContext(ThemeStore)
    return (
        <div>
            <h1>current theme is {theme}</h1>
            <button onClick={() => setTheme(THEME_DARK)}>Dark</button>
            <button onClick={() => setTheme(THEME_LIGHT)}>Light</button>
        </div>
    )
}

const setup = () =>
    render(
        <ThemeProvider>
            <TestComponent />
        </ThemeProvider>,
    )

test('ThemeStore should be able to switch theme', () => {
    setup()

    // Defaults to light theme
    screen.getByText(new RegExp(`current theme is ${THEME_LIGHT}`, 'i'))

    // Switch to dark theme
    const darkBtn = screen.getByRole('button', { name: /dark/i })
    userEvent.click(darkBtn)
    screen.getByText(new RegExp(`current theme is ${THEME_DARK}`, 'i'))

    // Switch to light theme again
    const lightBtn = screen.getByRole('button', { name: /light/i })
    userEvent.click(lightBtn)
    screen.getByText(new RegExp(`current theme is ${THEME_LIGHT}`, 'i'))
})

test('ThemeStore should persist selected theme', () => {
    setup()

    expect(Storage.prototype.getItem).toBeCalled()

    userEvent.click(screen.getByRole('button', { name: /dark/i }))
    expect(Storage.prototype.setItem).toHaveBeenLastCalledWith(expect.anything(), THEME_DARK)
})

test('ThemeStore should use stored theme when component mounted', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(THEME_DARK)
    setup()

    screen.getByText(new RegExp(`current theme is ${THEME_DARK}`, 'i'))
})
