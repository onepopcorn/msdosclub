import { getByRole, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Comment from './Comment'

const testdata = {
    author: 'user stub',
    date: '2022-04-13',
    avatar: 'avatar-url-stub',
    content: '<p>test comment content</p>',
}

test('Comment should show author & comment content data', () => {
    render(<Comment {...testdata} />)

    const date = new Date('2022-04-13')

    expect(screen.getByRole('img').src).toContain('avatar-url-stub')
    screen.getByText(/user stub/i)
    screen.getByText(date.toLocaleDateString())
    screen.getByText(/test comment content/i)
})

test('Comment should be marked as connected needed', () => {
    render(<Comment {...testdata} isConnected />)

    // That's an implementation detail that shouldn't be
    // tested but there's no other way I can think to test this.
    expect(screen.getByRole('listitem')).toHaveClass('connected')
})

test('Comment should trigger callback when response button is clicked', () => {
    const responseMock = jest.fn()
    const { rerender } = render(<Comment {...testdata} onResponse={responseMock} parent={42} />)

    // When comment has a parent, parent ID must be passed to callback
    userEvent.click(screen.getByRole('button'))
    expect(responseMock).toBeCalledTimes(1)
    expect(responseMock).toBeCalledWith(42)
    responseMock.mockReset()

    // When comment has no a parent
    rerender(<Comment {...testdata} onResponse={responseMock} />)
    userEvent.click(screen.getByRole('button'))
    expect(responseMock).toBeCalledTimes(1)
    expect(responseMock).toBeCalledWith(null)
})
