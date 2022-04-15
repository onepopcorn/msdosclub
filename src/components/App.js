import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path'

// Providers
import ThemeProvider from './state/ThemeStore'
import AudioProvider, { VOLUME_KEY, PROG_KEY, FINISHED_KEY } from './state/AudioStore'
import MenuProvider from './state/MenuStore'

// Custom components
import Header from './layout/Header'
import Menu from './layout/Menu'
import MenuCollapsed from './layout/Menu/MenuCollapsed'
import Posts from './data/Posts'
import Player from './audio/Player'
import ErrorFallback from './data/ErrorFallback'

// Styles
import classNames from 'classnames/bind'
import styles from './App.module.css'
const cx = classNames.bind(styles)

// Config shoelace assets path & custom icons
setBasePath('/shoelace')

const storedState = {
    volume: localStorage.getItem(VOLUME_KEY),
    progress: localStorage.getItem(PROG_KEY),
    finished: localStorage.getItem(FINISHED_KEY),
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            refetchOnMount: false,
        },
    },
})

export default function App() {
    const [categories, setCategories] = useState(2)
    const menuContents = [
        { icon: 'megaphone-fill', label: 'Podcasts', value: 2 },
        { icon: 'book-fill', label: 'Artículos', value: [4, 46] },
        { icon: 'filetype-exe', label: 'Utilidades', value: 6 },
    ]

    return (
        <div className={cx('container')}>
            <div className={cx('content')}>
                <Menu menuItems={menuContents} onItemClick={setCategories} />
                <div className={cx('maincolumn')}>
                    <ThemeProvider>
                        <MenuProvider>
                            <Header />
                            <MenuCollapsed menuItems={menuContents} onItemClick={setCategories} />
                        </MenuProvider>
                    </ThemeProvider>
                    <AudioProvider initialState={storedState}>
                        <Player />
                        <QueryClientProvider client={queryClient}>
                            <QueryErrorResetBoundary>
                                {({ reset }) => (
                                    <ErrorBoundary onReset={reset} fallbackRender={ErrorFallback}>
                                        <Posts categories={categories} />
                                    </ErrorBoundary>
                                )}
                            </QueryErrorResetBoundary>
                        </QueryClientProvider>
                    </AudioProvider>
                </div>
            </div>
        </div>
    )
}
