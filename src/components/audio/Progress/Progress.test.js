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

test('Progress should not be interacted with while disabled', () => {
    const onchange = jest.fn()
    render(<Progress max={100} value={0} disabled onChange={onchange} />)

    fireEvent.mouseDown(screen.getByRole('slider'), { clientX: 100 })
    expect(onchange).not.toHaveBeenCalled()
})

test('Progress should include label when provided', () => {
    render(<Progress max={100} value={0} label="label-stub" />)
    screen.getByLabelText(/label-stub/i)
})

test('Progress should trigger change events', () => {
    const onchange = jest.fn()
    render(<Progress max={100} value={0} onChange={onchange} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    // one event on mouseDown and another one on mouseUp
    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toBeCalledWith(50)
})

test('Progress should trigger change events while dragging', () => {
    const onchange = jest.fn()
    render(<Progress max={100} value={0} onChange={onchange} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    // one event on mouseDown and another one on mouseUp
    expect(onchange).toBeCalledTimes(2)
    expect(onchange).toBeCalledWith(50)
})

test('Progress should trigger onRelease event when stop dragging', () => {
    const onrelease = jest.fn()
    render(<Progress max={100} value={0} onRelease={onrelease} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    // one event on mouseDown and another one on mouseUp
    expect(onrelease).toBeCalledTimes(1)
    expect(onrelease).toBeCalledWith(50)
})
