import { useContext } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MenuProvider, { MenuStore } from './MenuStore'

const TestComponent = () => {
    const { menuOpen, setMenuOpen } = useContext(MenuStore)
    return (
        <div>
            <h1>menu is currently {menuOpen ? 'opened' : 'closed'}</h1>
            <button onClick={() => setMenuOpen(true)}>Open menu</button>
            <button onClick={() => setMenuOpen(false)}>Close menu</button>
        </div>
    )
}

const setup = () => {
    render(
        <MenuProvider>
            <TestComponent />
        </MenuProvider>,
    )
}

test('MenuStore should be able to open/close the menu', () => {
    setup()

    // Initial state is always closed
    screen.getByText(/menu is currently closed/)

    userEvent.click(screen.getByRole('button', { name: /open menu/i }))
    screen.getByText(/menu is currently opened/)

    userEvent.click(screen.getByRole('button', { name: /close menu/i }))
    screen.getByText(/menu is currently closed/)
})
