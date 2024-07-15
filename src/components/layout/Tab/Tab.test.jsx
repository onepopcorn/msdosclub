import { render, screen, act } from '@testing-library/react'
import Tab from './Tab'
import { afterEach, beforeEach, expect } from 'vitest'

beforeEach(() => {
    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})

test('Tab should render passed children', () => {
    vi.useFakeTimers()
    act(() => render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
            <div>third tab</div>
        </Tab>,
    ))

    act(() => {
        vi.runAllTimers()
        vi.clearAllTimers()
    })

    screen.getByText(/first tab/i)
    screen.getByText(/second tab/i)
    screen.getByText(/third tab/i)
})

test('Tab should have only one tab visible at a time', async () => {
    vi.useFakeTimers()

    render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )


    act(() => {
        vi.runAllTimers()
        vi.clearAllTimers()
    })

    expect(screen.getByText(/first tab/i)).toBeVisible()
    expect(screen.getByText(/second tab/i)).not.toBeVisible()
})

test('Tab should transition between tabs', async () => {
    const { rerender } = render(
        <Tab>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )

    const firstTab = screen.getByText(/first tab/i)
    const secondTab = screen.getByText(/second tab/i)

    act(() => {
        vi.runAllTimers()
        vi.clearAllTimers()
    })

    expect(firstTab).toBeVisible()
    expect(secondTab).not.toBeVisible()

    rerender(
        <Tab active={1}>
            <div>first tab</div>
            <div>second tab</div>
        </Tab>,
    )

    act(() => {
        vi.runAllTimers()
        vi.clearAllTimers()
    })

    expect(firstTab).not.toBeVisible()
    expect(secondTab).toBeVisible()
})
