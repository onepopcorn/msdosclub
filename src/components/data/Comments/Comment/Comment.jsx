import PropTypes from 'prop-types';

// Styles
import classNames from 'classnames/bind';
import styles from './Comment.module.css';
const cx = classNames.bind(styles);

export default function Comment({ author, avatar, date, content, isConnected = false, children }) {
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
      <div className={cx('actions')}>{children}</div>
    </li>
  );
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
   * Used to know if a thread has to be shown next to the comment
   */
  isConnected: PropTypes.bool,
  /**
   * Any passed children
   */
  children: PropTypes.node,
};
