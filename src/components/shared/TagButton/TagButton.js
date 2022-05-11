import PropTypes from 'prop-types'
import { ReactComponent as CloseIcon } from '@shoelace-style/shoelace/dist/assets/icons/x-circle-fill.svg'

// Styles
import classNames from 'classnames/bind'
import styles from './TagButton.module.css'
const cx = classNames.bind(styles)

export default function TagButton({ onClick, children }) {
    return (
        <div className={cx('container')}>
            {children}
            {onClick && (
                <button className={cx('btn')} onClick={onClick}>
                    <CloseIcon />
                </button>
            )}
        </div>
    )
}

TagButton.propTypes = {
    /**
     * Content to be shown inside the tag
     */
    children: PropTypes.node.isRequired,
    /**
     * Callback for when the button is clicked
     */
    onClick: PropTypes.func,
}
