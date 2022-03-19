import { SlIconButton } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'
import { useContext } from 'react'
import { ThemeStore, THEME_DARK, THEME_LIGHT } from '../../state/ThemeStore'

import styles from './Header.module.css'
const cx = classNames.bind(styles)

export default function Header() {
    const { theme, setTheme } = useContext(ThemeStore)
    const icon = theme === THEME_DARK ? 'brightness-high-fill' : 'moon-stars-fill'
    const onChangeTheme = () => setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK)
    return (
        <header className={cx('container')}>
            <div className={cx('content')}>
                <SlIconButton data-testid="theme-btn" name={icon} onClick={onChangeTheme} label="change theme" />
                <img width="42" height="42" src={`${process.env.PUBLIC_URL}/logo192.png`} alt="MS-DOS Club" />
                <SlIconButton data-testid="menu-btn" className={cx('menu')} name="list" label="menu" />
            </div>
        </header>
    )
}
