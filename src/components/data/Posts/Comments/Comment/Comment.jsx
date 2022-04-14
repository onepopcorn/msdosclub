import PropTypes from 'prop-types'

// Styles
import classNames from 'classnames/bind'
import styles from './Comment.module.css'
const cx = classNames.bind(styles)

export default function Comment({ author, avatar, date, content, isConnected = false }) {
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
        </li>
    )
}

Comment.propTypes = {
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isConnected: PropTypes.bool,
}
