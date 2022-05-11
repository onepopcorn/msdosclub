import userEvent from '@testing-library/user-event'
import { screen, render } from 'utils/test-utils'
import TagButton from './TagButton'

test('TagButton should print passed text', () => {
    render(<TagButton>tag name stub</TagButton>)

    screen.getByText(/tag name stub/i)
})

test('TagButton should trigger passed callback when x button clicked', () => {
    const cb = jest.fn()
    render(<TagButton onClick={cb}>tag name stub</TagButton>)

    userEvent.click(screen.getByRole('button'))
    expect(cb).toBeCalledTimes(1)
})
