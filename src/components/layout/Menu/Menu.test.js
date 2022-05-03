import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Menu from './Menu'

test('Menu should not be rendered if screen is smaller than 600px', () => {
    window.matchMedia.mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })
    const { container } = render(<Menu menuItems={[{ label: 'item-stub', value: 1 }]} onItemClick={jest.fn()} />)

    expect(container).toBeEmptyDOMElement()
})

test('Menu should render passed menu items', () => {
    window.matchMedia.mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() })
    const items = [
        { label: 'item-stub-one', value: 4 },
        { label: 'item-stub-two', value: [2, 5] },
    ]
    const callback = jest.fn()
    render(<Menu menuItems={items} onItemClick={callback} />)

    userEvent.click(screen.getByRole('button', { name: /item-stub-one/i }))
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith(4)

    userEvent.click(screen.getByRole('button', { name: /item-stub-two/i }))
    expect(callback).toBeCalledTimes(2)
    expect(callback).toBeCalledWith([2, 5])
})

test('Menu should not complain when an empty array of elements is passed', () => {
    window.matchMedia.mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() })
    render(<Menu menuItems={[]} onItemClick={jest.fn()} />)
    expect(screen.getByRole('navigation')).toBeEmptyDOMElement()
})
