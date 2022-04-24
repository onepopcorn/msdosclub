import PropTypes from 'prop-types'

// Styles
import classNames from 'classnames/bind'
import styles from './Comment.module.css'
const cx = classNames.bind(styles)

export default function Comment({ author, avatar, date, content, parent = null, onResponse, isConnected = false }) {
    return (
        <li className={cx('container', { connected: isConnected })}>
            <div className={cx('header')}>
                <img className={cx('avatar')} src={avatar} alt={author} />
                <div className={cx('metadata')}>
                    <sub className={cx('author')}>{author}</sub>
                    <sub>{new Date(date).toLocaleDateString()}</sub>
                </div>
            </div>
            <div className={cx('content')} dangerouslySetInnerHTML={{ __html: content }}></div>
            <div className={cx('actions')}>
                {onResponse && (
                    <button
                        className={cx('btn')}
                        onClick={() => typeof onResponse === 'function' && onResponse(parent)}
                    >
                        Contestar
                    </button>
                )}
            </div>
        </li>
    )
}

Comment.propTypes = {
    /**
     * Comment author
     */
    author: PropTypes.string.isRequired,
    /**
     * Comment author avatar
     */
    avatar: PropTypes.string.isRequired,
    /**
     * String representation of comment date
     */
    date: PropTypes.string.isRequired,
    /**
     * Comment content
     */
    content: PropTypes.string.isRequired,
    /**
     * Comment parent comment id (used to know what to reply)
     */
    parent: PropTypes.number,
    /**
     * Used to know if a thread has to be shown next to the comment
     */
    isConnected: PropTypes.bool,
    /**
     * Callback for when reply button is clicked
     */
    onResponse: PropTypes.func,
}
