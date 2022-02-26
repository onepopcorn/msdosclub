import { screen, render } from '@testing-library/react'
import Timer from '../Timer'

test('Time should render default values when no time or invalid time data is passed', () => {
    const { rerender } = render(<Timer />)
    expect(screen.getAllByText(/--:--:--/i).length).toBe(2)

    rerender(<Timer elapsed={Infinity} total={NaN} />)
    expect(screen.getAllByText(/--:--:--/i).length).toBe(2)
})

test('Time should format passed time correctly', () => {
    render(<Timer elapsed={10} total={56703} />)
    screen.getByText(/00:00:10/i)
    screen.getByText(/15:45:03/i)
})