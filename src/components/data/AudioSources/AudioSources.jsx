import { useContext } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@shoelace-style/shoelace/dist/assets/icons/download.svg?react';
import PlayIcon from '@shoelace-style/shoelace/dist/assets/icons/play-fill.svg?react';
import EarIcon from '@shoelace-style/shoelace/dist/assets/icons/speaker-fill.svg?react';
import ApplePodcastIcon from 'assets/icons/msdos-apple-podcast.svg?react';
import IvooxIcon from 'assets/icons/msdos-ivoox.svg?react';
import SpotifyIcon from 'assets/icons/msdos-spotify.svg?react';
import GooglePodcastsIcon from 'assets/icons/msdos-google-podcast.svg?react';
import PodimoIcon from 'assets/icons/msdos-podimo.svg?react';

// Providers
import { AudioStore } from 'providers/AudioStore';

// Styles
import classNames from 'classnames/bind';
import styles from './AudioSources.module.css';
const cx = classNames.bind(styles);

const platformIcons = new Map([
  ['iTunes', <ApplePodcastIcon />],
  ['iVoox', <IvooxIcon />],
  ['Spotify', <SpotifyIcon />],
  ['Google Podcasts', <GooglePodcastsIcon />],
  ['Podimo', <PodimoIcon />],
]);

export default function AudioSources({ id, file, sources = [], onPlayClick }) {
  const {
    state: { id: playingId },
  } = useContext(AudioStore);

  const platforms = sources.map(({ name, url }) =>
    !platformIcons.has(name) ? null : (
      <a
        key={name}
        href={url}
        className={cx('platform', 'generic-icon')}
        aria-disabled="false"
        aria-label={name}
        target="_blank"
        rel="noreferrer noopener"
      >
        {platformIcons.get(name)}
      </a>
    ),
  );

  return (
    <div className={cx('container')}>
      <div className={cx('sources')}>{platforms}</div>
      <div className={cx('actions')}>
        <a
          className={cx('download', 'generic-icon')}
          href={file}
          target="_blank"
          rel="noreferrer noopener"
          aria-disabled="false"
          aria-label="Descargar"
        >
          <DownloadIcon />
        </a>

        {playingId !== id ? (
          <button
            data-id={id}
            className={cx('play', 'generic-icon')}
            onClick={() => onPlayClick(id)}
            aria-label="Reproducir"
          >
            <PlayIcon />
          </button>
        ) : (
          <button className={cx('playing', 'generic-icon')} aria-label="Reproduciendo">
            <EarIcon />
          </button>
        )}
      </div>
    </div>
  );
}

AudioSources.propTypes = {
  /**
   * Post ID
   */
  id: PropTypes.number.isRequired,
  /**
   * File url to be played by the player
   */
  file: PropTypes.string.isRequired,
  /**
   * List of external sources
   */
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
  /**
   * Callback function when play button is clicked
   */
  onPlayClick: PropTypes.func.isRequired,
};
