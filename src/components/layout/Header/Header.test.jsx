import { render, screen } from 'test-utils'
import userEvent from '@testing-library/user-event'
import Header from './Header'

/**
 * NOTE: using test-id here for the buttons because React Testing Library seems
 * not to recognize custom components interal elements like <button> and its
 * properties.
 */
test('Header should show the logo', () => {
    render(<Header />)
    screen.getByRole('img', { name: /ms-dos club/i })
})

test('Header should have a button to switch theme', () => {
    Storage.prototype.setItem = vi.fn()
    render(<Header />)
    userEvent.click(screen.getByTestId('theme-btn'))
    expect(localStorage.setItem).toBeCalledTimes(1)
})

test('Header should show open menu burguer button', () => {
    render(<Header />)
    screen.getByTestId('menu-btn')
})
