import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import Progress from '../Progress'

// onChange uses useRef & getBoundingClientRect to calculate results hence the mocking
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(),
}))

// Usually you should never mock React internals but this is a special case
// where whe need get a DOMRect from a ref HTMLElement
beforeEach(() => {
    const ref = { current: {} }
    const DOMRect = { width: 100, x: 20 }
    Object.defineProperty(ref, 'current', {
        set() {},
        get() {
            return {
                getBoundingClientRect: () => DOMRect,
            }
        },
    })

    React.useRef.mockReturnValue(ref)
})

afterEach(() => {
    jest.clearAllMocks()
})

test('Progress should be rendered correctly with passed values', () => {
    const { rerender } = render(<Progress max={100} value={0} />)

    // Check elements are rendered correctly
    screen.getByRole('slider')
    const progressbar = screen.getByRole('progressbar')

    // Initial values
    expect(progressbar).toHaveStyle('transform: translateX(calc(0px - 100%))')

    // Updated values
    rerender(<Progress max={100} value={50} />)
    expect(progressbar).toHaveStyle('transform: translateX(calc(50px - 100%))')

    // Loading
    rerender(<Progress max={100} value={10} loading={true} />)
    expect(progressbar).toHaveClass('loading')
})

test('Progress should trigger change events when interacted without interactive mode', () => {
    const onchange = jest.fn()
    render(<Progress max={100} value={0} onChange={onchange} interactive={false} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toBeCalledWith(50)
})

test('Progress should trigger change events when interacted with interactive mode', () => {
    const onchange = jest.fn()
    render(<Progress max={1} value={1} onChange={onchange} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 10 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    fireEvent.mouseUp(slider, { client: 70 })

    // onChange will be triggered once per mouseMove and once per mouseUp
    expect(onchange).toBeCalledTimes(2)
    expect(onchange).toBeCalledWith(0.5)
})
