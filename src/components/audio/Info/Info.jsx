import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames/bind'
import styles from './Info.module.css'
const cx = classNames.bind(styles)

export default function Info({ title }) {
    const titleRef = useRef(null)
    const textRef = useRef(null)
    const [rollingText, setRollingText] = useState(false)

    useEffect(() => {
        if (!titleRef.current || !textRef.current) return

        const checkSize = () => {
            // Check if text fits in container
            const { width: parentWidth } = titleRef.current.getBoundingClientRect()
            const { width: textWidth } = textRef.current.getBoundingClientRect()
            const isSmaller = parentWidth < textWidth

            // If text exceeds container space make it roll-left
            if (rollingText !== isSmaller) isSmaller ? setRollingText(true) : setRollingText(false)

            // Calculate how much we need to scroll the text
            if (isSmaller) titleRef.current.style.setProperty('--text-roll-width', `-${textWidth}px`)
        }

        checkSize()
        window.addEventListener('resize', checkSize)

        return () => {
            window.removeEventListener('resize', checkSize)
        }
    }, [title, rollingText])

    return (
        <div className={cx('container', { masked: rollingText })}>
            <div ref={titleRef} className={cx('title', { rolling: rollingText })}>
                <span ref={textRef}>{title}</span>
                {rollingText && <span>{title}</span>}
            </div>
        </div>
    )
}

Info.propTypes = {
    title: PropTypes.string.isRequired,
    img: PropTypes.string,
}
