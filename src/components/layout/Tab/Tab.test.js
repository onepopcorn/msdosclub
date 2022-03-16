import { render, screen, waitFor } from '@testing-library/react'
import Tab from './Tab'

test('Tab should render passed children', () => {
    render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
            <div>third tab</div>
        </Tab>,
    )

    screen.getByText(/first tab/i)
    screen.getByText(/second tab/i)
    screen.getByText(/third tab/i)
})

test('Tab should have only one tab visible at a time', () => {
    render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )

    expect(screen.getByText(/second tab/i)).not.toBeVisible()
})

test('Tab should transition between tabs', async () => {
    jest.useFakeTimers()

    const { rerender } = render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )

    const firstTab = screen.getByText(/first tab/i)
    const secondTab = screen.getByText(/second tab/i)

    expect(secondTab).not.toBeVisible()

    rerender(
        <Tab active={1}>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )

    await waitFor(() => expect(firstTab).not.toBeVisible())
    await waitFor(() => expect(secondTab).toBeVisible())
})
