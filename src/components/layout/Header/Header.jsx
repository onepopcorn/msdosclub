import { useContext } from 'react'
import { SlIconButton } from '@shoelace-style/shoelace/dist/react'

// Providers
import { ThemeStore, THEME_DARK, THEME_LIGHT } from 'providers/ThemeStore'
import { MenuStore } from 'providers/MenuStore'

// Styles
import classNames from 'classnames/bind'
import styles from './Header.module.css'
const cx = classNames.bind(styles)

export default function Header() {
    const { theme, setTheme } = useContext(ThemeStore)
    const { setMenuOpen } = useContext(MenuStore)

    const icon = theme === THEME_DARK ? 'brightness-high-fill' : 'moon-stars-fill'
    const onChangeTheme = () => setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK)

    return (
        <header className={cx('container')}>
            <div className={cx('content')}>
                <SlIconButton data-testid="theme-btn" name={icon} onClick={onChangeTheme} label="change theme" />
                <img width="42" height="42" src="/logo192.png" alt="MS-DOS Club" />
                <SlIconButton
                    data-testid="menu-btn"
                    className={cx('menu')}
                    name="list"
                    label="menu"
                    onClick={() => setMenuOpen(true)}
                />
            </div>
        </header>
    )
}
