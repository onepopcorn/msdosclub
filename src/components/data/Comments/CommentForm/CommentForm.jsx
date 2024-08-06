import PropTypes from 'prop-types';

// Styles
import classNames from 'classnames/bind';
import styles from './CommentForm.module.css';
const cx = classNames.bind(styles);

export default function CommentForm({ inResponseTo }) {
  const onsubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form className={cx('form')} onSubmit={onsubmit}>
      <label className={cx('authorField')} htmlFor="author">
        nombre:
        <input id="author" name="author" type="text" autoComplete="true" />
      </label>
      <label className={cx('emailField')} htmlFor="email">
        correo electrónico:
        <input id="email" name="email" type="text" autoComplete="true" />
      </label>
      <label className={cx('urlField')} htmlFor="url">
        web:
        <input id="url" name="url" type="text" autoComplete="true" />
      </label>
      <label className={cx('commentField')} htmlFor="comment">
        Comentario:
        <textarea
          id="comment"
          name="comment"
          maxLength="65525"
          autoComplete="false"
          autoCorrect="true"
          rows={12}
        ></textarea>
      </label>
      <button className={cx('button')}>Enviar</button>
    </form>
  );
}

CommentForm.propTypes = {
  /**
   * Optional comment parent ID to respond to
   */
  inResponseTo: PropTypes.number,
};
