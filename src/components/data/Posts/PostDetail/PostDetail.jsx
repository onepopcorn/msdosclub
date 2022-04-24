import { useState } from 'react'
import PropTypes from 'prop-types'
import { SlIconButton, SlSpinner } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'

import styles from './PostDetail.module.css'
const cx = classNames.bind(styles)

export default function PostDetail({ title, author, date, beforeContent, afterContent, images, close, children }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <article className={cx('container')}>
            <nav>
                <SlIconButton data-testid="close-btn" name="chevron-left" onClick={close} label="volver" />
            </nav>
            <header>
                <div className={cx('thumbContainer')}>
                    <img
                        onLoad={() => setLoaded(true)}
                        className={cx('thumb', { loaded })}
                        srcSet={images.srcset}
                        alt={images.caption || title}
                        sizes={images.sizes}
                        width={images.full.width}
                        height={images.full.height}
                    />
                    {!loaded && <SlSpinner className={cx('spinner')} />}
                </div>
                <h2 className={cx('title')}>{title}</h2>
                <sub className={cx('author')}>por {author}</sub> <sub>{date}</sub>
            </header>
            {beforeContent}
            <div className={cx('content')} dangerouslySetInnerHTML={{ __html: children }}></div>
            {afterContent}
        </article>
    )
}

PostDetail.propTypes = {
    /**
     * Post title
     */
    title: PropTypes.string.isRequired,
    /**
     * Post author
     */
    author: PropTypes.string.isRequired,
    /**
     * Post date
     */
    date: PropTypes.string.isRequired,
    /**
     * Call back for closing the detail view
     */
    close: PropTypes.func.isRequired,
    /**
     * Slot for an optional component that will be printed
     * before the text child content
     */
    beforeContent: PropTypes.node,
    /**
     * Slot for an optional component that will be printed
     * after the text child content
     */
    afterContent: PropTypes.node,
    /**
     * Image data
     */
    images: PropTypes.shape({
        /**
         * Source set for img tag
         */
        srcset: PropTypes.string.isRequired,
        /**
         * Sizes for img tag
         */
        sizes: PropTypes.string.isRequired,
        /**
         * Full size image data
         */
        full: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            source_url: PropTypes.string.isRequired,
        }),
        /**
         * Optional caption text. If not provided, post title
         * will be used as img alt text
         */
        caption: PropTypes.string,
    }),
    /**
     * Only text or null children is accepted
     */
    children: PropTypes.string,
}
