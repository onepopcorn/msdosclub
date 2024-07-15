import { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import ChevronRightIcon from '@shoelace-style/shoelace/dist/assets/icons/chevron-right.svg?react'
import CheckIcon from '@shoelace-style/shoelace/dist/assets/icons/check-circle-fill.svg?react'

import styles from './Post.module.css'
const cx = classNames.bind(styles)

export default function Post({ post, children, viewed = false, isCurrent = false, onClick }) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const onPostClicked = (e) => {
        const { postid } = e.currentTarget.dataset
        if (typeof onClick === 'function') onClick(parseInt(postid))
    }

    return (
        <article className={cx('entry', { isPlaying: isCurrent })}>
            <button className={cx('btn')} onClick={onPostClicked} data-postid={post.id} tabIndex="0">
                <div className={cx('thumb')}>
                    <img
                        onLoad={() => setImgLoaded(true)}
                        className={cx({ loaded: imgLoaded })}
                        src={post.thumb}
                        alt={post.caption || post.title}
                    />
                    {viewed && <CheckIcon className={cx('check')} aria-label="check" />}
                </div>

                <header className={cx('header')}>
                    <sub className={cx('date')}>{post.date}</sub>
                    <h2 className={cx('title')}>{post.title}</h2>
                    <div className={cx('icon')} aria-hidden="true">
                        <ChevronRightIcon />
                    </div>
                </header>
            </button>
            {children}
        </article>
    )
}

Post.propTypes = {
    post: PropTypes.shape({
        /**
         * Post ID
         */
        id: PropTypes.number.isRequired,
        /**
         * Post title
         */
        title: PropTypes.string.isRequired,
        /**
         * Post date
         */
        date: PropTypes.string.isRequired,
        /**
         * Post thumbnail
         */
        thumb: PropTypes.string.isRequired,
        /**
         * Optional thumbnail caption (it defaults to post title)
         */
        caption: PropTypes.string,
    }).isRequired,
    /**
     * Function to be called when clicked on the post
     */
    onClick: PropTypes.func,
    /**
     * Mark the podcast as viewed
     *
     */
    viewed: PropTypes.bool,
    /**
     * Mark the podcast as currently listening
     *
     */
    isCurrent: PropTypes.bool,
    /**
     * Any children type that will be appended at the end of the content
     */
    children: PropTypes.node,
}
