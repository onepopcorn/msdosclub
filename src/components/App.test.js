import { render, screen } from 'utils/test-utils'
import App from './App'

test('App can me mounted without issues', () => {
    render(<App />)
    const text = screen.getByText(/ms-dos/i)
    expect(text).toBeInTheDocument()
})
