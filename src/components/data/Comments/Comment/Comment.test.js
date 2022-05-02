import { render, screen } from '@testing-library/react'

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

    expect(screen.getByRole('listitem')).toHaveClass('connected')
})

test.skip('Comment should trigger callback when response button is clicked', () => {
    // When comment has a parent, parent ID must be passed to callback
    // When comment has not a parent
})
