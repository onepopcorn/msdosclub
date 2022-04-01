import { useState } from 'react'
import PropTypes from 'prop-types'
import { SlIcon } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'

import styles from './Post.module.css'
const cx = classNames.bind(styles)

export default function Post({ post, children, onClick }) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const onPostClicked = (e) => {
        const { postid } = e.currentTarget.dataset
        if (typeof onClick === 'function') onClick(parseInt(postid))
    }

    return (
        <article className={cx('entry')}>
            <button className={cx('btn')} onClick={onPostClicked} data-postid={post.id} tabIndex="0">
                <div className={cx('thumb')}>
                    <img
                        onLoad={() => setImgLoaded(true)}
                        className={cx({ loaded: imgLoaded })}
                        src={post.thumb}
                        alt={post.caption || post.title}
                    />
                </div>

                <header className={cx('header')}>
                    <sub className={cx('date')}>{post.date}</sub>
                    <h2 className={cx('title')}>{post.title}</h2>
                    <SlIcon className={cx('icon')} name="chevron-right" />
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
     * Any children type that will be appended at the end of the content
     */
    children: PropTypes.node,
}
