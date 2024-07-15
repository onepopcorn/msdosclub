import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import Progress from './Progress'

// vi.useFakeTimers()


// Usually you should never mock React internals but this is a special case
// where whe need get a DOMRect from a ref HTMLElement
beforeEach(() => {
    // onChange uses useRef & getBoundingClientRect to calculate results hence the mocking
    vi.mock('react', async () => {
        const ref = { current: {} }
        const DOMRect = { width: 100, x: 20 }
        Object.defineProperty(ref, 'current', {
            set() { },
            get() {
                return {
                    getBoundingClientRect: () => DOMRect,
                }
            },
        })

        const actual = await vi.importActual('react')
        return { ...actual, useRef: vi.fn().mockReturnValue(ref) }
    })
})

afterEach(() => {
    vi.clearAllMocks()
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
    expect(progressbar.classList.toString().includes('loading')).toBeTruthy()
})

test('Progress should not be interacted with while disabled', () => {
    const onchange = vi.fn()
    render(<Progress max={100} value={0} disabled onChange={onchange} />)

    fireEvent.mouseDown(screen.getByRole('slider'), { clientX: 100 })
    expect(onchange).not.toHaveBeenCalled()
})

test('Progress should include label when provided', () => {
    render(<Progress max={100} value={0} label="label-stub" />)
    screen.getByLabelText(/label-stub/i)
})

test('Progress should trigger change events', () => {
    const onchange = vi.fn()
    render(<Progress max={100} value={0} onChange={onchange} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    // one event on mouseDown and another one on mouseUp
    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toBeCalledWith(50)
})

test('Progress should trigger change events while dragging', () => {
    const onchange = vi.fn()
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
    const onrelease = vi.fn()
    render(<Progress max={100} value={0} onRelease={onrelease} />)

    const slider = screen.getByRole('slider')
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    fireEvent.mouseUp(slider, { clientX: 70 })

    // one event on mouseDown and another one on mouseUp
    expect(onrelease).toBeCalledTimes(1)
    expect(onrelease).toBeCalledWith(50)
})

test('Progress should show a tooltip with the audio timming while dragging', () => {
    render(<Progress max={100} value={0} tooltip />)

    const slider = screen.getByRole('slider')

    // Mouse Events
    fireEvent.mouseDown(slider, { clientX: 50 })
    fireEvent.mouseMove(slider, { clientX: 70 })
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip.textContent).toBe('00:00:50')

    // Touch Events
    fireEvent.touchStart(slider, { touches: [{ clientX: 0 }] })
    fireEvent.touchMove(slider, { touches: [{ clientX: 80 }] })

    expect(tooltip.textContent).toBe('00:01:00')
})

test('Progress should me controllable with left/right keyboard keys when focused', () => {
    const onrelease = vi.fn()
    const onchange = vi.fn()
    const { rerender } = render(<Progress max={100} value={0} onChange={onchange} onRelease={onrelease} />)

    const slider = screen.getByRole('slider')
    fireEvent.focus(slider)

    // Test onChange correct values
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toHaveBeenLastCalledWith(1)
    onchange.mockReset()

    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toHaveBeenLastCalledWith(0)
    onchange.mockReset()

    // Test onRelease correct values
    fireEvent.keyUp(slider, { key: 'ArrowRight' })
    expect(onrelease).toBeCalledTimes(1)
    expect(onrelease).toHaveBeenLastCalledWith(1)
    onrelease.mockReset()

    fireEvent.keyUp(slider, { key: 'ArrowLeft' })
    expect(onrelease).toBeCalledTimes(1)
    expect(onrelease).toHaveBeenLastCalledWith(0)
    onrelease.mockReset()

    // Test min limits
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onchange).toBeCalledTimes(1)
    expect(onchange).toHaveBeenLastCalledWith(0)
    onchange.mockReset()

    fireEvent.keyUp(slider, { key: 'ArrowLeft' })
    expect(onrelease).toBeCalledTimes(1)
    expect(onrelease).toHaveBeenLastCalledWith(0)
    onrelease.mockReset()

    // Test max limits
    rerender(<Progress max={100} value={99} onChange={onchange} onRelease={onrelease} />)

    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onchange).toBeCalledTimes(2)
    expect(onchange).toHaveBeenLastCalledWith(100)
    onchange.mockReset()

    fireEvent.keyUp(slider, { key: 'ArrowRight' })
    fireEvent.keyUp(slider, { key: 'ArrowRight' })
    expect(onrelease).toBeCalledTimes(2)
    expect(onrelease).toHaveBeenLastCalledWith(100)
})
