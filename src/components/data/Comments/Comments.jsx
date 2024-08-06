import { Fragment, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { SlSpinner } from '@shoelace-style/shoelace/dist/react';

import { getComments } from 'api/wpapi';

// Styles
import classNames from 'classnames/bind';
import styles from './Comments.module.css';
const cx = classNames.bind(styles);

// Lazy loaded components
const Comment = lazy(() => import('./Comment'));

export default function Comments({ postId }) {
  const { data, isLoading } = useQuery(['comments', postId], getComments);

  if (isLoading)
    return (
      <div className={cx('container')}>
        <SlSpinner data-testid="spinner" />
      </div>
    );

  const { parentComments, childComments } = data;
  const text = () => {
    if (parentComments.length > 0) return 'Déjanos tu comentario';
    return 'Sé el primero de dejar un comentario';
  };

  return (
    <div className={cx('container')}>
      <a href={`https://msdos.club?p=${postId}#comments`} target="_blank" rel="noopener noreferrer nofollow">
        {text()}
      </a>
      <ul className={cx('list')}>
        {parentComments.map((comment) => (
          <Fragment key={comment.id}>
            <Comment
              author={comment.author_name}
              avatar={comment.author_avatar_urls[48]}
              date={comment.date}
              content={comment.content.rendered}
              isConnected={comment._links.hasOwnProperty('children')}
            />
            {Object.keys(childComments).includes(comment.id.toString()) &&
              childComments[comment.id].map((subcomment, i) => (
                <Comment
                  key={subcomment.id}
                  author={subcomment.author_name}
                  avatar={subcomment.author_avatar_urls[48]}
                  date={subcomment.date}
                  content={subcomment.content.rendered}
                  parent={comment.id}
                  isConnected={i + 1 !== childComments[comment.id].length}
                />
              ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

Comments.propTypes = {
  /**
   * Post ID
   */
  postId: PropTypes.number.isRequired,
};
