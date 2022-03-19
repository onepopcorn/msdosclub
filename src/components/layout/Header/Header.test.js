import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'
import ThemeProvider from '../../state/ThemeStore'

/**
 * NOTE: using test-id here for the buttons because React Testing Library seems
 * not to recognize custom components interal elements like <button> and its
 * properties.
 */

const customRender = () =>
    render(
        <ThemeProvider>
            <Header />
        </ThemeProvider>,
    )

test('Header should show the logo', () => {
    customRender()
    screen.getByRole('img', { name: /ms-dos club/i })
})

test('Header should have a button to switch theme', () => {
    Storage.prototype.setItem = jest.fn()
    customRender()
    userEvent.click(screen.getByTestId('theme-btn'))
    expect(localStorage.setItem).toBeCalledTimes(1)
})

test('Header should show open menu burguer button', () => {
    customRender()
    screen.getByTestId('menu-btn')
})
