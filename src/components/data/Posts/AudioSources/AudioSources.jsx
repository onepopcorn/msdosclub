import { useContext } from 'react'
import PropTypes from 'prop-types'
import { SlIconButton } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'
import { AudioStore } from '../../../state/AudioStore'

import styles from './AudioSources.module.css'
const cx = classNames.bind(styles)

const platformIcons = new Map([
    ['iTunes', 'msdos-apple-podcast'],
    ['iVoox', 'msdos-ivoox'],
    ['Spotify', 'msdos-spotify'],
    ['Google Podcasts', 'msdos-google-podcast'],
    ['Podimo', 'msdos-podimo'],
])

export default function AudioSources({ id, file, sources = [], onPlayClick }) {
    const {
        state: { id: playingId },
    } = useContext(AudioStore)
    const platforms = sources.map(({ name, url }) =>
        !platformIcons.has(name) ? null : (
            <SlIconButton
                data-testid={`source-${platformIcons.get(name)}`}
                key={name}
                library="msdos"
                name={platformIcons.get(name)}
                label={name}
                href={url}
                target="_blank"
            />
        ),
    )

    return (
        <div className={cx('container')}>
            <div className={cx('sources')}>{platforms}</div>
            <div className={cx('actions')}>
                <SlIconButton
                    data-testid="download-btn"
                    name="download"
                    label="Descargar"
                    href={file}
                    target="_blank"
                    download
                    circle
                    size="big"
                />
                {playingId !== id ? (
                    <SlIconButton
                        data-testid="play-btn"
                        className={cx('play')}
                        data-id={id}
                        onClick={onPlayClick}
                        name="play-fill"
                        label="Play"
                    />
                ) : (
                    <SlIconButton data-testid="is-playing" className={cx('playing')} name="activity" label="Playing" />
                )}
            </div>
        </div>
    )
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
}
