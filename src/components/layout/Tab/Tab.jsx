import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import styles from './Tab.module.css'
const cx = classNames.bind(styles)

export default function Tab({ children, active = 0, offset = 0, onChange }) {
    const activeTab = active
    const [inTransition, setInTransition] = useState(true)
    const timerRef = useRef()

    useLayoutEffect(() => {
        window.scrollTo({ top: offset })
    }, [offset, active])

    // Handle transition
    useEffect(() => {
        setInTransition(true)
        clearInterval(timerRef.current)

        timerRef.current = setTimeout(() => {
            setInTransition(false)
            if (typeof onChange === 'function') onChange(activeTab)
        }, 250)

        return () => clearTimeout(timerRef.current)
    }, [active, activeTab, onChange])

    const childnodes = Array.isArray(children) ? children : [children]

    return (
        <div>
            <div className={cx('inner')} style={{ transform: `translateX(${activeTab * -100}%)` }}>
                {childnodes.map((child, i) => (
                    <div
                        key={i}
                        className={cx('tab', { transition: inTransition && activeTab !== i })}
                        hidden={!inTransition && activeTab !== i}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}

Tab.propTypes = {
    /**
     * Child elements that will be wrapped
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    /**
     * Tab inddex to show
     */
    active: PropTypes.number,
}
